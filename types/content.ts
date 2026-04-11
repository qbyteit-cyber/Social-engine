import { PlatformKey } from './platforms'

export type InputType = 'url' | 'text' | 'doc'

export interface ExtractedContent {
  title: string
  body: string
  key_points: string[]
  tone: string
  word_count: number
  estimated_read_time: number
}

export interface PlatformVariant {
  text: string
  thread_parts?: string[]
  hashtags: string[]
  media_suggestion?: string
  hook: string
  cta: string
}

export interface PlatformVariantsOutput {
  platforms: Partial<Record<PlatformKey, PlatformVariant>>
}

export type JobStatus = 'pending' | 'generating' | 'ready' | 'failed'
export type VariantStatus = 'draft' | 'approved' | 'scheduled' | 'published' | 'failed'
export type ScheduledPostStatus = 'queued' | 'posted' | 'failed'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
