import { PlatformKey, FREE_PLATFORMS, ALL_PLATFORMS } from '@/types/platforms'
import { Plan } from '@/types/user'

export interface PlanConfig {
  price: number
  repurposes_per_month: number // -1 = unlimited
  platforms: PlatformKey[] | 'all'
  scheduling: boolean
  brand_voice: boolean
  team_members: number
  white_label?: boolean
}

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    price: 0,
    repurposes_per_month: 5,
    platforms: FREE_PLATFORMS,
    scheduling: false,
    brand_voice: false,
    team_members: 1,
  },
  creator: {
    price: 19,
    repurposes_per_month: -1,
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
    white_label: false,
  },
}

export function getPlatformsForPlan(plan: Plan): PlatformKey[] {
  const config = PLANS[plan]
  return config.platforms === 'all' ? ALL_PLATFORMS : config.platforms
}
