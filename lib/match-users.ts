import { mockMatches } from '@/data/mockMatches'
import type { MatchedUser } from '@/components/match-results-page'

/** 将 mockMatches 转为匹配结果页使用的用户列表 */
export function getDefaultMatchedUsers(): MatchedUser[] {
  return mockMatches.map((m, index) => ({
    id: index + 1,
    name: m.name,
    city: m.city,
    tag: m.tag,
    tagColor: m.tagColor,
    matchPercent: m.matchPercent,
    isOnline: m.isOnline,
    commonPoints: m.commonPoints,
    greeting: m.greeting,
  }))
}
