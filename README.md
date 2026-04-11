# Repurpose Engine (Social Engine)

AI-powered content repurposing SaaS. Input one piece of content → AI reformats it → outputs platform-optimized posts for 10 social media channels.

## Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** Clerk
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude API
- **Payments:** Stripe
- **Email:** Resend

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in all keys in .env.local

# 3. Set up Supabase database
# Run schema.sql in your Supabase SQL editor

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

See `.env.example` for all required variables.

## Database

Run `schema.sql` in the Supabase SQL editor to create all tables.

## Build Phases

- **Phase 1 (MVP):** Content input → AI generation → side-by-side editor → copy to clipboard
- **Phase 2 (Connected):** OAuth platform connections → one-click publish → scheduler
- **Phase 3 (Brain):** Brand voice builder → post history → team workspaces

See `CLAUDE.md` in the repo root for full build specification.
