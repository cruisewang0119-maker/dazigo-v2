import { NextResponse } from 'next/server'
import {
  mapParsedToForm,
  parseActivityFallback,
  parseActivityResponse,
  type ParsedActivityForm,
} from '@/lib/parse-activity'

const SYSTEM_PROMPT = `用户用自然语言描述了一个搭子活动，
请提取以下信息并以JSON格式返回：
{
  activityType: 吃饭/喝酒/咖啡/看展/KTV/其他,
  timePreference: 今天/明天/本周末,
  location: 提取的城市或区域,
  budget: 低/中/高,
  vibeTag: 从[随性聊天型,深度交流型,只吃饭不尬聊型,探店打卡型]选一个,
  title: 用20字以内重新提炼活动标题
}
只输出JSON，不输出其他内容`

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

  if (!apiKey || apiKey === '你的key') {
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
