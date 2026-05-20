import { NextResponse } from 'next/server'
import {
  getFallbackMatchReason,
  type MatchReasonRequest,
  type PublishedActivityContext,
} from '@/lib/match-reasons'

const SYSTEM_PROMPT = `你是搭子GO的智能匹配引擎，根据两个用户的信息，
生成一段自然的匹配理由。

要求：
- 中文，2-3句话，像朋友介绍朋友的语气
- 具体说出2个共同点
- 结尾给出一个具体的见面建议
- 不超过60字

输出格式：直接输出文字，不加任何标签或格式`

function trimReason(text: string): string {
  return text
    .replace(/^["'「『]|["'」』]$/g, '')
    .replace(/\n+/g, '')
    .trim()
    .slice(0, 60)
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

  if (!apiKey || apiKey === '你的key') {
    return NextResponse.json({ reason: fallback, fromFallback: true })
  }

  const userPrompt = `【我】
城市：${body.myCity}
身份：${body.myRole}
兴趣标签：${body.myTags.join('、')}

【对方】
昵称：${body.partnerName}
城市：${body.partnerCity}
身份：${body.partnerTag}
兴趣标签：${body.partnerTags.join('、')}
共同点：${body.commonPoints.join('、')}
匹配度：${body.matchPercent}%

【本次活动】
类型：${body.activityType}
地点：${body.activityLocation}
${body.activityTime ? `时间：${body.activityTime}` : ''}

请生成匹配理由。`

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
