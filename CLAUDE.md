# REPURPOSE ENGINE — Claude Code Build Brief

## PRODUCT
AI-powered content repurposing SaaS. User inputs one piece of content (URL, text, or doc) → AI brain reformats it → outputs platform-optimized posts for 10 social media channels → user reviews, edits, schedules, and publishes.

Working name: **Repurpose Engine** (rebrand later)

---

## STACK
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** Clerk
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514 for generation, claude-haiku-4-5-20251001 for quick tasks)
- **Job Queue / Scheduling:** Trigger.dev
- **Payments:** Stripe
- **Deployment:** Vercel
- **Email:** Resend

---

## ENV VARIABLES (never hardcode)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
TRIGGER_API_KEY=
# Platform OAuth secrets added per platform (see PLATFORMS section)
```

---

## ARCHITECTURE

```
src/
├── app/
│   ├── (marketing)/          # Public pages: landing, pricing, blog
│   ├── (auth)/               # Clerk sign-in/sign-up
│   ├── (dashboard)/          # Protected: main app
│   │   ├── dashboard/        # Overview, recent posts, stats
│   │   ├── create/           # Input → generate flow
│   │   ├── review/[id]/      # Side-by-side platform variants editor
│   │   ├── scheduler/        # Queue management, calendar view
│   │   ├── connections/      # OAuth platform connections
│   │   ├── brand-voice/      # Brand profile settings
│   │   └── settings/         # Account, billing, team
│   └── api/
│       ├── repurpose/        # POST: trigger AI generation
│       ├── publish/          # POST: send to platform APIs
│       ├── schedule/         # POST: queue a post
│       ├── webhooks/
│       │   ├── stripe/
│       │   └── trigger/
│       └── oauth/
│           └── [platform]/   # OAuth callback handlers
├── components/
│   ├── ui/                   # shadcn/ui base components
│   ├── dashboard/            # Dashboard-specific components
│   ├── editor/               # Platform variant editor
│   └── scheduler/            # Calendar + queue components
├── lib/
│   ├── ai/
│   │   ├── repurpose.ts      # Core repurposing prompt logic
│   │   ├── extract.ts        # Content extraction from URL/doc
│   │   └── prompts/          # Platform-specific prompt templates
│   ├── platforms/
│   │   ├── index.ts          # Platform registry
│   │   ├── linkedin.ts
│   │   ├── twitter.ts
│   │   ├── instagram.ts
│   │   ├── facebook.ts
│   │   ├── threads.ts
│   │   ├── youtube.ts
│   │   ├── pinterest.ts
│   │   ├── bluesky.ts
│   │   ├── tiktok.ts
│   │   └── newsletter.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── stripe/
│       └── plans.ts
└── types/
    ├── platforms.ts
    ├── content.ts
    └── user.ts
```

---

## DATABASE SCHEMA (Supabase / PostgreSQL)

```sql
-- Users synced from Clerk
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  plan TEXT DEFAULT 'free', -- free | creator | agency
  brand_voice JSONB,        -- tone, style, keywords, examples
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Content jobs (one per repurpose request)
CREATE TABLE content_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  input_type TEXT NOT NULL,   -- url | text | doc
  input_raw TEXT NOT NULL,    -- original content
  extracted JSONB,            -- title, body, key_points, tone
  status TEXT DEFAULT 'pending', -- pending | generating | ready | failed
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Platform variants (10 per job)
CREATE TABLE platform_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES content_jobs(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,     -- linkedin | twitter | instagram | etc.
  content JSONB NOT NULL,     -- { text, hashtags, thread_parts?, media_suggestions? }
  status TEXT DEFAULT 'draft', -- draft | approved | scheduled | published | failed
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Scheduled posts queue
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES platform_variants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  posted_at TIMESTAMPTZ,
  platform_post_id TEXT,      -- ID returned by platform after posting
  status TEXT DEFAULT 'queued', -- queued | posted | failed
  error TEXT
);

-- Platform OAuth connections
CREATE TABLE platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  access_token TEXT NOT NULL, -- encrypt at rest
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  platform_user_id TEXT,
  platform_username TEXT,
  connected_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, platform)
);
```

---

## PLATFORMS

### Supported (v1)
| Key | Platform | API | Auth | Notes |
|-----|----------|-----|------|-------|
| `linkedin` | LinkedIn | REST | OAuth 2.0 | Use UGC Posts API |
| `twitter` | X / Twitter | REST v2 | OAuth 2.0 | Requires Basic tier ($100/mo) |
| `instagram` | Instagram | Meta Graph | OAuth | Business/Creator accounts only |
| `facebook` | Facebook | Meta Graph | OAuth | Pages only |
| `threads` | Threads | Meta Graph | OAuth | Threads API (2024) |
| `youtube` | YouTube | Data API v3 | OAuth | Community posts + descriptions |
| `pinterest` | Pinterest | REST v5 | OAuth 2.0 | Pins + board posts |
| `bluesky` | Bluesky | AT Protocol | App password | No OAuth yet, use ATP agent |
| `tiktok` | TikTok | Content Posting | OAuth 2.0 | Text posts + video descriptions |
| `newsletter` | Newsletter | Beehiiv / Mailchimp | API key | Export as HTML email block |

### Platform Format Constraints
```typescript
// src/types/platforms.ts
export const PLATFORM_CONSTRAINTS = {
  linkedin:  { maxChars: 3000, supportsThread: false, supportsHashtags: true, maxHashtags: 5 },
  twitter:   { maxChars: 280,  supportsThread: true,  supportsHashtags: true, maxHashtags: 3 },
  instagram: { maxChars: 2200, supportsThread: false, supportsHashtags: true, maxHashtags: 30 },
  facebook:  { maxChars: 63206,supportsThread: false, supportsHashtags: true, maxHashtags: 10 },
  threads:   { maxChars: 500,  supportsThread: true,  supportsHashtags: true, maxHashtags: 5 },
  youtube:   { maxChars: 5000, supportsThread: false, supportsHashtags: true, maxHashtags: 15 },
  pinterest: { maxChars: 500,  supportsThread: false, supportsHashtags: false,maxHashtags: 0 },
  bluesky:   { maxChars: 300,  supportsThread: true,  supportsHashtags: true, maxHashtags: 3 },
  tiktok:    { maxChars: 2200, supportsThread: false, supportsHashtags: true, maxHashtags: 10 },
  newsletter:{ maxChars: 99999,supportsThread: false, supportsHashtags: false,maxHashtags: 0 },
}
```

---

## AI REPURPOSING LOGIC

### Step 1 — Extract (content ingestion)
```
Input: URL | raw text | uploaded doc
→ If URL: scrape with cheerio or use Jina AI reader (jina.ai/reader)
→ If doc: extract with pdf-parse or mammoth
→ Output: { title, body, key_points[], tone, word_count, estimated_read_time }
```

### Step 2 — Generate (Claude API)
Use a two-pass approach:
1. **Pass 1 (Haiku):** Extract key message, 5 bullet points, emotional hook, CTA suggestion
2. **Pass 2 (Sonnet):** Generate all 10 platform variants in one call using structured JSON output

System prompt must include:
- User's brand voice profile (from DB)
- Platform constraints (char limits, format rules)
- Tone calibration (professional → casual spectrum per platform)
- Instruction to return valid JSON matching `PlatformVariantsOutput` type

### Step 3 — Output format
```typescript
interface PlatformVariantsOutput {
  platforms: {
    [key: string]: {
      text: string;
      thread_parts?: string[];   // for Twitter/Threads/Bluesky
      hashtags: string[];
      media_suggestion?: string; // text description of ideal image/graphic
      hook: string;              // first line / attention grabber
      cta: string;               // call to action
    }
  }
}
```

---

## PLANS & LIMITS

```typescript
export const PLANS = {
  free: {
    price: 0,
    repurposes_per_month: 5,
    platforms: ['linkedin', 'twitter', 'instagram', 'facebook', 'bluesky'],
    scheduling: false,
    brand_voice: false,
    team_members: 1,
  },
  creator: {
    price: 19,
    repurposes_per_month: -1, // unlimited
    platforms: 'all',
    scheduling: true,
    brand_voice: true,
    team_members: 1,
  },
  agency: {
    price: 79,
    repurposes_per_month: -1,
    platforms: 'all',
    scheduling: true,
    brand_voice: true,
    team_members: 10,
    white_label: false, // v2
  },
}
```

---

## BUILD ORDER (phases)

### Phase 1 — MVP (build this first)
- [ ] Project setup: Next.js 15 + Tailwind + shadcn/ui + Clerk + Supabase
- [ ] Landing page (marketing) with waitlist/signup CTA
- [ ] Auth flow (Clerk sign up/in → Supabase user sync)
- [ ] Dashboard shell with sidebar navigation
- [ ] Content input page: URL paste + text input + doc upload
- [ ] AI extraction (Step 1 above)
- [ ] AI generation (Step 2 above) — all 10 variants
- [ ] Review page: side-by-side editor for all variants (no posting yet)
- [ ] Copy-to-clipboard per platform
- [ ] Supabase persistence (jobs + variants)
- [ ] Basic usage limits (free plan: 5/month)

### Phase 2 — Connected
- [ ] Platform OAuth connections page
- [ ] OAuth flow for LinkedIn, Meta (IG/FB/Threads), YouTube, Pinterest, Bluesky, TikTok
- [ ] One-click publish (immediate posting)
- [ ] Scheduler UI + Trigger.dev queue
- [ ] Stripe billing integration

### Phase 3 — Brain
- [ ] Brand voice profile builder (onboarding wizard)
- [ ] Post history + performance tracking
- [ ] AI learns from approved/edited variants (fine-tuning brand voice)
- [ ] Team/agency workspaces
- [ ] Obsidian vault sync (plugin)

---

## CONVENTIONS

- All server actions in `app/api/` — never call Supabase directly from client
- Encrypt OAuth tokens before storing (use `@node-rs/bcrypt` or AES-256 via `crypto`)
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- Use `zod` for all API input validation
- Conventional commits: `feat:` `fix:` `chore:` `refactor:`
- Error handling: all API routes return `{ success: boolean, data?, error? }`
- Loading states: every async action has a skeleton or spinner
- Mobile-first: dashboard must work on tablet minimum

---

## RISK FLAGS
- `platform_connections` table: tokens are sensitive — encrypt at rest before MVP launch
- Twitter API: requires paid tier, implement last or mock in dev
- TikTok API: posting approval takes weeks, start application early
- Rate limits: implement per-user rate limiting on `/api/repurpose` from day 1
- GDPR: users are EU — add data deletion endpoint before launch, cookie consent on marketing pages

---

## START HERE

When starting a new session, begin with Phase 1, Step 1:
```
Set up Next.js 15 project with TypeScript, Tailwind, shadcn/ui, Clerk auth, and Supabase client. 
Create the folder structure as defined in ARCHITECTURE. 
Initialize the database with the schema defined in DATABASE SCHEMA.
Do not build UI yet — confirm setup is working first.
```
