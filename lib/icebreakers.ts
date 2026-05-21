import { CURRENT_USER } from '@/lib/profile-stats'

export interface IcebreakerRequest {
  myTags: string[]
  partnerTags: string[]
  activityType: string
  activityLocation: string
}

export const FALLBACK_ICEBREAKERS = [
  'What are you most excited to try there?',
  'Do you explore new spots on weekends too?',
  'Any other hidden gems you would recommend?',
]

export function getDefaultIcebreakerContext(
  partnerName: string,
  partnerCommonPoints: string[],
  activityInfo: string
): IcebreakerRequest {
  const parts = activityInfo.split('·').map((s) => s.trim())
  const activityType = parts[1] || 'Hangout'
  const activityLocation = parts[2] || parts[0] || 'Nearby'

  return {
    myTags: CURRENT_USER.tags,
    partnerTags: partnerCommonPoints.length > 0 ? partnerCommonPoints : [partnerName],
    activityType,
    activityLocation,
  }
}

export function parseIcebreakerLines(text: string): string[] {
  const lines = text
    .split('\n')
    .map((line) =>
      line
        .replace(/^[\d]+[.、)\]]\s*/, '')
        .replace(/^[-*•]\s*/, '')
        .trim()
    )
    .filter((line) => line.length > 0 && line.length <= 80)

  if (lines.length >= 3) return lines.slice(0, 3)

  const fallback = [...FALLBACK_ICEBREAKERS]
  lines.forEach((line, i) => {
    if (i < 3) fallback[i] = line
  })
  return fallback.slice(0, 3)
}

export async function fetchIcebreakers(payload: IcebreakerRequest): Promise<{
  topics: string[]
  fromFallback: boolean
}> {
  try {
    const res = await fetch('/api/icebreakers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok || !data.topics?.length) {
      return { topics: FALLBACK_ICEBREAKERS, fromFallback: true }
    }

    return {
      topics: parseIcebreakerLines(data.topics.join('\n')),
      fromFallback: !!data.fromFallback,
    }
  } catch {
    return { topics: FALLBACK_ICEBREAKERS, fromFallback: true }
  }
}
