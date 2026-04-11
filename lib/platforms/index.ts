import { PlatformKey, PLATFORM_CONSTRAINTS } from '@/types/platforms'

export interface PlatformMeta {
  key: PlatformKey
  name: string
  icon: string
  color: string
  authType: 'oauth2' | 'app_password' | 'api_key'
  apiTier?: string
}

export const PLATFORM_REGISTRY: Record<PlatformKey, PlatformMeta> = {
  linkedin:   { key: 'linkedin',   name: 'LinkedIn',   icon: 'linkedin',   color: '#0A66C2', authType: 'oauth2' },
  twitter:    { key: 'twitter',    name: 'X / Twitter', icon: 'twitter',   color: '#000000', authType: 'oauth2', apiTier: 'Basic ($100/mo)' },
  instagram:  { key: 'instagram',  name: 'Instagram',  icon: 'instagram',  color: '#E4405F', authType: 'oauth2' },
  facebook:   { key: 'facebook',   name: 'Facebook',   icon: 'facebook',   color: '#1877F2', authType: 'oauth2' },
  threads:    { key: 'threads',    name: 'Threads',    icon: 'threads',    color: '#000000', authType: 'oauth2' },
  youtube:    { key: 'youtube',    name: 'YouTube',    icon: 'youtube',    color: '#FF0000', authType: 'oauth2' },
  pinterest:  { key: 'pinterest',  name: 'Pinterest',  icon: 'pinterest',  color: '#E60023', authType: 'oauth2' },
  bluesky:    { key: 'bluesky',    name: 'Bluesky',    icon: 'bluesky',    color: '#0285FF', authType: 'app_password' },
  tiktok:     { key: 'tiktok',     name: 'TikTok',     icon: 'tiktok',     color: '#010101', authType: 'oauth2' },
  newsletter: { key: 'newsletter', name: 'Newsletter', icon: 'newsletter', color: '#6B7280', authType: 'api_key' },
}

export function getPlatformMeta(key: PlatformKey): PlatformMeta {
  return PLATFORM_REGISTRY[key]
}

export function getPlatformConstraints(key: PlatformKey) {
  return PLATFORM_CONSTRAINTS[key]
}
