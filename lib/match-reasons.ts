import { CURRENT_USER } from '@/lib/profile-stats'
import { getPartnerTags } from '@/lib/partner-tags'

export interface PublishedActivityContext {
  type: string
  location: string
  time?: string
  description?: string
  atmosphere?: string[]
  budget?: string
}

export interface MatchReasonRequest {
  myTags: string[]
  myCity: string
  myRole: string
  partnerName: string
  partnerCity: string
  partnerTag: string
  partnerTags: string[]
  commonPoints: string[]
  activityType: string
  activityLocation: string
  activityTime?: string
  matchPercent: number
}

export function buildMatchReasonPayload(
  partner: {
    name: string
    city: string
    tag: string
    commonPoints: string[]
    matchPercent: number
  },
  activity: PublishedActivityContext
): MatchReasonRequest {
  return {
    myTags: CURRENT_USER.tags,
    myCity: CURRENT_USER.city,
    myRole: CURRENT_USER.role,
    partnerName: partner.name,
    partnerCity: partner.city,
    partnerTag: partner.tag,
    partnerTags: getPartnerTags(partner.name, partner.commonPoints),
    commonPoints: partner.commonPoints,
    activityType: activity.type,
    activityLocation: activity.location,
    activityTime: activity.time,
    matchPercent: partner.matchPercent,
  }
}

export function getFallbackMatchReason(
  partnerName: string,
  commonPoints: string[],
  activity: PublishedActivityContext
): string {
  const points = commonPoints.slice(0, 2)
  const pointText = points.length >= 2 ? `${points[0]} and ${points[1]}` : points[0] || 'food'
  const timeHint = activity.time ? ` ${activity.time}` : ''
  return `${partnerName} is into ${pointText} too. Try ${activity.type}${timeHint} at ${activity.location}.`
}

export async function fetchMatchReason(payload: MatchReasonRequest): Promise<{
  reason: string
  fromFallback: boolean
}> {
  try {
    const res = await fetch('/api/match-reason', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (!res.ok || !data.reason) {
      return {
        reason: getFallbackMatchReason(
          payload.partnerName,
          payload.commonPoints,
          {
            type: payload.activityType,
            location: payload.activityLocation,
            time: payload.activityTime,
          }
        ),
        fromFallback: true,
      }
    }

    return { reason: data.reason, fromFallback: !!data.fromFallback }
  } catch {
    return {
      reason: getFallbackMatchReason(
        payload.partnerName,
        payload.commonPoints,
        {
          type: payload.activityType,
          location: payload.activityLocation,
          time: payload.activityTime,
        }
      ),
      fromFallback: true,
    }
  }
}
