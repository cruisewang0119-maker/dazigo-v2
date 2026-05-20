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
  吃饭: 'eat',
  喝酒: 'drink',
  咖啡: 'coffee',
  看展: 'exhibition',
  KTV: 'ktv',
  其他: 'other',
}

const TIME_MAP: Record<string, string> = {
  今天: 'today',
  明天: 'tomorrow',
  本周末: 'weekend',
}

const BUDGET_MAP: Record<string, string> = {
  低: 'low',
  中: 'mid',
  高: 'high',
}

const VIBE_MAP: Record<string, string> = {
  随性聊天型: '随性聊天',
  深度交流型: '深度交流',
  '只吃饭不尬聊型': '安静聚餐',
  探店打卡型: '探店打卡',
}

export function mapParsedToForm(parsed: ParsedActivityForm): MappedActivityForm {
  const typeKey = Object.keys(TYPE_MAP).find((k) => parsed.activityType?.includes(k)) ?? '吃饭'
  const timeKey = Object.keys(TIME_MAP).find((k) => parsed.timePreference?.includes(k)) ?? '本周末'
  const budgetKey = Object.keys(BUDGET_MAP).find((k) => parsed.budget?.includes(k)) ?? '中'
  const atmosphereTag =
    VIBE_MAP[parsed.vibeTag ?? ''] ??
    Object.entries(VIBE_MAP).find(([k]) => parsed.vibeTag?.includes(k))?.[1] ??
    '随性聊天'

  return {
    typeId: TYPE_MAP[typeKey] ?? 'eat',
    dateId: TIME_MAP[timeKey] ?? 'weekend',
    location: parsed.location?.trim() || '伦敦',
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
  let activityType = '吃饭'
  if (/喝|酒|bar|精酿|威士忌/.test(description)) activityType = '喝酒'
  else if (/咖啡|奶茶|抹茶/.test(description)) activityType = '咖啡'
  else if (/展|博物馆|艺术/.test(description)) activityType = '看展'
  else if (/k歌|唱|ktv/i.test(description)) activityType = 'KTV'

  let timePreference = '本周末'
  if (/今天|今晚|今夜/.test(description)) timePreference = '今天'
  else if (/明天|明晚/.test(description)) timePreference = '明天'

  let location = '伦敦'
  const cities = ['伦敦', '纽约', '悉尼', '多伦多', '新加坡', 'Shoreditch', 'Manhattan', 'Flushing']
  for (const c of cities) {
    if (description.includes(c)) {
      location = c
      break
    }
  }

  let budget = '中'
  if (/便宜|预算|20以下|低消费|小贩/.test(description)) budget = '低'
  else if (/50\+|高端|威士忌|私房菜|请客/.test(description)) budget = '高'

  let vibeTag = '随性聊天型'
  if (/深度|聊天|交流|不尬/.test(description)) vibeTag = '深度交流型'
  if (/探店|打卡|新店/.test(description)) vibeTag = '探店打卡型'
  if (/只吃饭|不尬聊|安静/.test(description)) vibeTag = '只吃饭不尬聊型'

  const title = description.length > 20 ? `${description.slice(0, 18)}…` : description

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
