import Stripe from "stripe"

let cached: Stripe | null = null

/**
 * Lazy Stripe client accessor.
 *
 * The Stripe SDK throws on construction if `STRIPE_SECRET_KEY` is missing.
 * Instantiating at module top-level causes the build to fail during Next's
 * page-data collection step when the env var isn't set (e.g. in preview
 * deploys without billing configured). Calling this inside request handlers
 * defers the check to runtime, so builds succeed and only actual Stripe
 * requests surface the misconfiguration.
 */
export function getStripe(): Stripe {
  if (!cached) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured")
    }
    cached = new Stripe(key)
  }
  return cached
}
