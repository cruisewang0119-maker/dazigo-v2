import { NextResponse } from 'next/server'
import { FALLBACK_ICEBREAKERS, parseIcebreakerLines, type IcebreakerRequest } from '@/lib/icebreakers'

const SYSTEM_PROMPT = `You are BuddyGO's AI assistant helping people make friendly connections.
Based on shared interests, generate 3 natural icebreaker lines.
Rules:
- English only, casual US tone like texting a friend
- Each line under 30 words
- Tie to shared interests or the specific hangout
- No formal or robotic phrasing
Output exactly 3 lines, one per line, no numbers or bullets.`

export async function POST(request: Request) {
  const apiKey = process.env.REACT_APP_DEEP_SEEK_KEY

  let body: IcebreakerRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ topics: FALLBACK_ICEBREAKERS, fromFallback: true })
  }

  const { myTags, partnerTags, activityType, activityLocation } = body

  const userPrompt = `My interests: ${myTags.join(', ')}
Their interests: ${partnerTags.join(', ')}
Hangout type: ${activityType}
Location: ${activityLocation}

Generate 3 icebreakers.`

  if (!apiKey || apiKey === 'your-key-here') {
    return NextResponse.json({ topics: FALLBACK_ICEBREAKERS, fromFallback: true })
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
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 256,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ topics: FALLBACK_ICEBREAKERS, fromFallback: true })
    }

    const data = await response.json()
    const content: string = data?.choices?.[0]?.message?.content?.trim() ?? ''

    if (!content) {
      return NextResponse.json({ topics: FALLBACK_ICEBREAKERS, fromFallback: true })
    }

    const topics = parseIcebreakerLines(content)
    return NextResponse.json({ topics, fromFallback: false })
  } catch {
    return NextResponse.json({ topics: FALLBACK_ICEBREAKERS, fromFallback: true })
  }
}
