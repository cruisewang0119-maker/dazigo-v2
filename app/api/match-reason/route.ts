import { NextResponse } from 'next/server'
import {
  getFallbackMatchReason,
  type MatchReasonRequest,
  type PublishedActivityContext,
} from '@/lib/match-reasons'

const SYSTEM_PROMPT = `You are BuddyGO's matching engine. Write a natural match reason.
Rules:
- English, 2-3 sentences, like a friend introducing two people
- Mention 2 specific things in common
- End with a concrete meetup suggestion
- Under 60 words total
Output plain text only, no labels or formatting.`

function trimReason(text: string): string {
  return text
    .replace(/^["']|["']$/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 200)
}

export async function POST(request: Request) {
  const apiKey = process.env.REACT_APP_DEEP_SEEK_KEY

  let body: MatchReasonRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ reason: '', fromFallback: true }, { status: 400 })
  }

  const activity: PublishedActivityContext = {
    type: body.activityType,
    location: body.activityLocation,
    time: body.activityTime,
  }

  const fallback = getFallbackMatchReason(body.partnerName, body.commonPoints, activity)

  if (!apiKey || apiKey === 'your-key-here') {
    return NextResponse.json({ reason: fallback, fromFallback: true })
  }

  const userPrompt = `[Me]
City: ${body.myCity}
Role: ${body.myRole}
Interests: ${body.myTags.join(', ')}

[Them]
Name: ${body.partnerName}
City: ${body.partnerCity}
Role: ${body.partnerTag}
Interests: ${body.partnerTags.join(', ')}
In common: ${body.commonPoints.join(', ')}
Match: ${body.matchPercent}%

[Hangout]
Type: ${body.activityType}
Place: ${body.activityLocation}
${body.activityTime ? `When: ${body.activityTime}` : ''}

Write the match reason.`

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
        temperature: 0.7,
        max_tokens: 128,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ reason: fallback, fromFallback: true })
    }

    const data = await response.json()
    const content: string = data?.choices?.[0]?.message?.content?.trim() ?? ''

    if (!content) {
      return NextResponse.json({ reason: fallback, fromFallback: true })
    }

    return NextResponse.json({
      reason: trimReason(content),
      fromFallback: false,
    })
  } catch {
    return NextResponse.json({ reason: fallback, fromFallback: true })
  }
}
