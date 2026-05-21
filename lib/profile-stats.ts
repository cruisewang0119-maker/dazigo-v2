import { mockActivities, type Activity } from '@/lib/mock-data'

export const CURRENT_USER = {
  name: 'Lin',
  displayName: 'Lin',
  city: 'London',
  role: 'Grad student',
  tags: ['Sichuan food', 'Tech', 'Film buff', 'Weekend plans', 'Deep talk'],
}

const TAG_KEYWORDS = [
  'spicy',
  'hot pot',
  'sichuan',
  'yunnan',
  'tech',
  'film',
  'food crawl',
  'coffee',
  'deep',
  'art',
  'cantonese',
]

function activityMatchesUser(activity: Activity) {
  if (activity.city === CURRENT_USER.city) return true
  const blob = [activity.title, activity.category, ...activity.tasteTags, ...activity.interestTags].join(
    ' '
  )
  return TAG_KEYWORDS.some((kw) => blob.toLowerCase().includes(kw))
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
    title: a.title.length > 28 ? `${a.title.slice(0, 28)}…` : a.title,
    time: a.time,
    partnerName: a.user.name,
    status: 'Done' as const,
  }))

  return {
    activityCount,
    buddyCount,
    goodReviewRate,
    recentActivities,
  }
}
