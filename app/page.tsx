import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const platforms = [
  "LinkedIn", "X / Twitter", "Instagram", "Facebook", "Threads",
  "YouTube", "Pinterest", "Bluesky", "TikTok", "Newsletter",
]

const steps = [
  { n: "1", title: "Paste your content", desc: "Drop in a URL, paste text, or upload a doc — any format works." },
  { n: "2", title: "AI rewrites for every platform", desc: "Claude reads your content, extracts the core message, and generates 10 optimised variants in seconds." },
  { n: "3", title: "Review, edit, and publish", desc: "See all variants side-by-side, tweak anything, then copy or schedule directly to each platform." },
]

const plans = [
  { name: "Free", price: "$0", limit: "5 repurposes / month", platforms: "5 platforms", cta: "Get started", highlight: false },
  { name: "Creator", price: "$19/mo", limit: "Unlimited repurposes", platforms: "All 10 platforms + scheduling + brand voice", cta: "Start free trial", highlight: true },
  { name: "Agency", price: "$79/mo", limit: "Unlimited repurposes", platforms: "All 10 platforms + 10 team members", cta: "Contact us", highlight: false },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold">Repurpose Engine</span>
          <div className="flex gap-3">
            <Button variant="ghost" asChild><Link href="/sign-in">Log in</Link></Button>
            <Button asChild><Link href="/sign-up">Get started free</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center">
        <Badge className="mb-4">Powered by Claude AI</Badge>
        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
          One piece of content.<br />
          <span className="text-primary">Ten platforms. Instantly.</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
          Paste a URL, text, or doc — Repurpose Engine rewrites it into platform-perfect posts
          for LinkedIn, X, Instagram, YouTube, and 6 more. No copy-paste grind.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild><Link href="/sign-up">Start for free</Link></Button>
          <Button size="lg" variant="outline" asChild><Link href="/sign-in">See a demo</Link></Button>
        </div>
      </section>

      {/* Platforms */}
      <section className="border-y bg-muted/40 py-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">Posts generated for</p>
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map((p) => (
              <Badge key={p} variant="secondary" className="px-4 py-2 text-sm">{p}</Badge>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="mb-14 text-center text-3xl font-bold">How it works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{s.n}</span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t bg-muted/40 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-14 text-center text-3xl font-bold">Simple pricing</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={`flex flex-col gap-6 p-8 ${plan.highlight ? "border-primary shadow-lg ring-2 ring-primary" : ""}`}>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{plan.name}</p>
                  <p className="mt-2 text-4xl font-extrabold">{plan.price}</p>
                </div>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <li>✓ {plan.limit}</li>
                  <li>✓ {plan.platforms}</li>
                </ul>
                <Button variant={plan.highlight ? "default" : "outline"} asChild className="mt-auto">
                  <Link href="/sign-up">{plan.cta}</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Repurpose Engine. All rights reserved.</p>
      </footer>
    </div>
  )
}
