import { mockUsers } from '@/data/mockUsers'

/** 从 mockUsers 匹配对方完整兴趣标签 */
export function getPartnerTags(partnerName: string, fallback: string[] = []): string[] {
  const user = mockUsers.find(
    (u) => u.nickname === partnerName || u.name === partnerName || u.name.includes(partnerName)
  )
  if (user?.tags?.length) return user.tags
  return fallback.length > 0 ? fallback : [partnerName]
}
