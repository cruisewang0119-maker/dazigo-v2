import { NextResponse } from 'next/server'
import { FALLBACK_ICEBREAKERS, parseIcebreakerLines, type IcebreakerRequest } from '@/lib/icebreakers'

const SYSTEM_PROMPT = `你是搭子GO App的AI助手，专门帮助海外华人建立友好连接。
根据两个用户的共同点，生成3条自然、友好、有趣的破冰话题建议。
要求：
- 中文输出，语气轻松像朋友发消息
- 每条话题不超过30字
- 结合具体的共同兴趣或本次活动
- 避免过于正式或像机器人
输出格式：直接输出3条，每条一行，不加序号`

export async function POST(request: Request) {
  const apiKey = process.env.REACT_APP_DEEP_SEEK_KEY

  let body: IcebreakerRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ topics: FALLBACK_ICEBREAKERS, fromFallback: true })
  }

  const { myTags, partnerTags, activityType, activityLocation } = body

  const userPrompt = `我的兴趣标签：${myTags.join('、')}
对方的兴趣标签：${partnerTags.join('、')}
本次活动类型：${activityType}
活动地点：${activityLocation}

请生成3条破冰话题。`

  if (!apiKey || apiKey === '你的key') {
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
