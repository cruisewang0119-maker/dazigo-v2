export interface ParsedActivityForm {
  activityType: string
  timePreference: string
  location: string
  budget: string
  vibeTag: string
  title: string
}

export interface MappedActivityForm {
  typeId: string
  dateId: string
  location: string
  budgetId: string
  atmosphereTag: string
  title: string
}

const TYPE_MAP: Record<string, string> = {
  Dining: 'eat',
  Drinks: 'drink',
  Coffee: 'coffee',
  Art: 'exhibition',
  KTV: 'ktv',
  Other: 'other',
}

const TIME_MAP: Record<string, string> = {
  Today: 'today',
  Tomorrow: 'tomorrow',
  'This weekend': 'weekend',
}

const BUDGET_MAP: Record<string, string> = {
  Low: 'low',
  Mid: 'mid',
  High: 'high',
}

const VIBE_MAP: Record<string, string> = {
  'Casual chat': 'Easy hang',
  'Deep convo': 'Deep talk',
  'Low-key meal': 'Low-key',
  'Foodie crawl': 'Food crawl',
}

export function mapParsedToForm(parsed: ParsedActivityForm): MappedActivityForm {
  const typeKey = Object.keys(TYPE_MAP).find((k) => parsed.activityType?.includes(k)) ?? 'Dining'
  const timeKey = Object.keys(TIME_MAP).find((k) => parsed.timePreference?.includes(k)) ?? 'This weekend'
  const budgetKey = Object.keys(BUDGET_MAP).find((k) => parsed.budget?.includes(k)) ?? 'Mid'

  const atmosphereTag =
    VIBE_MAP[parsed.vibeTag ?? ''] ??
    Object.entries(VIBE_MAP).find(([k]) => parsed.vibeTag?.includes(k))?.[1] ??
    'Easy hang'

  return {
    typeId: TYPE_MAP[typeKey] ?? 'eat',
    dateId: TIME_MAP[timeKey] ?? 'weekend',
    location: parsed.location?.trim() || 'London',
    budgetId: BUDGET_MAP[budgetKey] ?? 'mid',
    atmosphereTag,
    title: parsed.title?.trim() || '',
  }
}

function extractJsonFromText(text: string): ParsedActivityForm | null {
  const trimmed = text.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  try {
    return JSON.parse(jsonMatch[0]) as ParsedActivityForm
  } catch {
    return null
  }
}

export function parseActivityFallback(description: string): ParsedActivityForm {
  let activityType = 'Dining'
  if (/drink|bar|beer|cocktail|whiskey/i.test(description)) activityType = 'Drinks'
  else if (/coffee|latte|matcha/i.test(description)) activityType = 'Coffee'
  else if (/museum|gallery|art|exhibit/i.test(description)) activityType = 'Art'
  else if (/karaoke|ktv|sing/i.test(description)) activityType = 'KTV'

  let timePreference = 'This weekend'
  if (/today|tonight/i.test(description)) timePreference = 'Today'
  else if (/tomorrow/i.test(description)) timePreference = 'Tomorrow'

  let location = 'London'
  const cities = ['London', 'NYC', 'New York', 'Sydney', 'Toronto', 'Singapore', 'Shoreditch', 'Manhattan', 'Flushing']
  for (const c of cities) {
    if (description.includes(c)) {
      location = c === 'New York' ? 'NYC' : c
      break
    }
  }

  let budget = 'Mid'
  if (/cheap|budget|under \$20|low/i.test(description)) budget = 'Low'
  else if (/\$50\+|upscale|fancy|treat/i.test(description)) budget = 'High'

  let vibeTag = 'Casual chat'
  if (/deep|meaningful|real talk/i.test(description)) vibeTag = 'Deep convo'
  if (/food crawl|new spot|restaurant hop/i.test(description)) vibeTag = 'Foodie crawl'
  if (/low.?key|no awkward|chill meal/i.test(description)) vibeTag = 'Low-key meal'

  const title = description.length > 40 ? `${description.slice(0, 38)}…` : description

  return { activityType, timePreference, location, budget, vibeTag, title }
}

export async function fetchParseActivity(description: string): Promise<{
  parsed: MappedActivityForm
  fromFallback: boolean
}> {
  try {
    const res = await fetch('/api/parse-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    })
    const data = await res.json()

    if (!res.ok || !data.parsed) {
      const fallback = parseActivityFallback(description)
      return { parsed: mapParsedToForm(fallback), fromFallback: true }
    }

    return {
      parsed: mapParsedToForm(data.parsed as ParsedActivityForm),
      fromFallback: !!data.fromFallback,
    }
  } catch {
    const fallback = parseActivityFallback(description)
    return { parsed: mapParsedToForm(fallback), fromFallback: true }
  }
}

export function parseActivityResponse(raw: string): ParsedActivityForm | null {
  const json = extractJsonFromText(raw)
  if (json?.activityType) return json
  return null
}
