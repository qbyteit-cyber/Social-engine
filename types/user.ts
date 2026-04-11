export type Plan = 'free' | 'creator' | 'agency'

export interface BrandVoice {
  tone?: string
  style?: string
  keywords?: string[]
  examples?: string[]
}

export interface User {
  id: string
  clerk_id: string
  email: string
  plan: Plan
  brand_voice?: BrandVoice
  created_at: string
}
