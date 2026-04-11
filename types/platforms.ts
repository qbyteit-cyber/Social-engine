export type PlatformKey =
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'facebook'
  | 'threads'
  | 'youtube'
  | 'pinterest'
  | 'bluesky'
  | 'tiktok'
  | 'newsletter'

export interface PlatformConstraint {
  maxChars: number
  supportsThread: boolean
  supportsHashtags: boolean
  maxHashtags: number
}

export const PLATFORM_CONSTRAINTS: Record<PlatformKey, PlatformConstraint> = {
  linkedin:   { maxChars: 3000,  supportsThread: false, supportsHashtags: true,  maxHashtags: 5 },
  twitter:    { maxChars: 280,   supportsThread: true,  supportsHashtags: true,  maxHashtags: 3 },
  instagram:  { maxChars: 2200,  supportsThread: false, supportsHashtags: true,  maxHashtags: 30 },
  facebook:   { maxChars: 63206, supportsThread: false, supportsHashtags: true,  maxHashtags: 10 },
  threads:    { maxChars: 500,   supportsThread: true,  supportsHashtags: true,  maxHashtags: 5 },
  youtube:    { maxChars: 5000,  supportsThread: false, supportsHashtags: true,  maxHashtags: 15 },
  pinterest:  { maxChars: 500,   supportsThread: false, supportsHashtags: false, maxHashtags: 0 },
  bluesky:    { maxChars: 300,   supportsThread: true,  supportsHashtags: true,  maxHashtags: 3 },
  tiktok:     { maxChars: 2200,  supportsThread: false, supportsHashtags: true,  maxHashtags: 10 },
  newsletter: { maxChars: 99999, supportsThread: false, supportsHashtags: false, maxHashtags: 0 },
}

export const ALL_PLATFORMS: PlatformKey[] = Object.keys(PLATFORM_CONSTRAINTS) as PlatformKey[]

export const FREE_PLATFORMS: PlatformKey[] = [
  'linkedin', 'twitter', 'instagram', 'facebook', 'bluesky',
]
