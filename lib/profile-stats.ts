import { mockActivities, type Activity } from '@/lib/mock-data'

export const CURRENT_USER = {
  name: '小林',
  displayName: '小林同学',
  city: '伦敦',
  role: '留学生',
  tags: ['川菜控', '科技圈', '电影迷', '周末活跃', '深度聊天'],
}

const TAG_KEYWORDS = ['辣', '火锅', '川', '云南', '科技', '电影', '探店', '咖啡', 'Deep', '艺术', '港']

function activityMatchesUser(activity: Activity) {
  if (activity.city === CURRENT_USER.city) return true
  const blob = [activity.title, activity.category, ...activity.tasteTags, ...activity.interestTags].join(
    ' '
  )
  return TAG_KEYWORDS.some((kw) => blob.includes(kw))
}

function estimateTotalSpots(activity: Activity) {
  return Math.max(activity.spotsLeft + 1, 4)
}

export function computeProfileStats() {
  const relatedActivities = mockActivities.filter(activityMatchesUser)

  const activityCount = relatedActivities.length

  const buddyNames = new Set(relatedActivities.map((a) => a.user.name))
  const buddyCount = buddyNames.size

  const occupancyScores = relatedActivities.map((a) => {
    const total = estimateTotalSpots(a)
    const filled = total - a.spotsLeft
    return filled / total
  })
  const avgFill =
    occupancyScores.length > 0
      ? occupancyScores.reduce((sum, v) => sum + v, 0) / occupancyScores.length
      : 0.85
  const goodReviewRate = Math.min(99, Math.max(86, Math.round(80 + avgFill * 20)))

  const recentActivities = relatedActivities.slice(0, 3).map((a) => ({
    id: a.id,
    title: a.title.length > 18 ? `${a.title.slice(0, 18)}…` : a.title,
    time: a.time,
    partnerName: a.user.name,
    status: '完成' as const,
  }))

  return {
    activityCount,
    buddyCount,
    goodReviewRate,
    recentActivities,
  }
}
