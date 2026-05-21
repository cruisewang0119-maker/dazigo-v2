import { NextResponse } from 'next/server'
import {
  mapParsedToForm,
  parseActivityFallback,
  parseActivityResponse,
} from '@/lib/parse-activity'

const SYSTEM_PROMPT = `The user described a buddy hangout in natural language.
Extract the following and return JSON only:
{
  activityType: Dining/Drinks/Coffee/Art/KTV/Other,
  timePreference: Today/Tomorrow/This weekend,
  location: city or neighborhood,
  budget: Low/Mid/High,
  vibeTag: pick one from [Casual chat, Deep convo, Low-key meal, Foodie crawl],
  title: a catchy title under 40 characters
}
Output JSON only, no other text.`

export async function POST(request: Request) {
  const apiKey = process.env.REACT_APP_DEEP_SEEK_KEY

  let description = ''
  try {
    const body = await request.json()
    description = body.description?.trim() ?? ''
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  if (description.length <= 10) {
    return NextResponse.json({ error: 'description too short' }, { status: 400 })
  }

  const fallback = parseActivityFallback(description)
  const fallbackMapped = mapParsedToForm(fallback)

  if (!apiKey || apiKey === 'your-key-here') {
    return NextResponse.json({ parsed: fallback, mapped: fallbackMapped, fromFallback: true })
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: description },
        ],
        temperature: 0.3,
        max_tokens: 256,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ parsed: fallback, mapped: fallbackMapped, fromFallback: true })
    }

    const data = await response.json()
    const content: string = data?.choices?.[0]?.message?.content?.trim() ?? ''
    const parsed = parseActivityResponse(content)

    if (!parsed) {
      return NextResponse.json({ parsed: fallback, mapped: fallbackMapped, fromFallback: true })
    }

    const mapped = mapParsedToForm(parsed)
    return NextResponse.json({ parsed, mapped, fromFallback: false })
  } catch {
    return NextResponse.json({ parsed: fallback, mapped: fallbackMapped, fromFallback: true })
  }
}
