'use client'

import { ArrowLeft, MapPin, Clock, Users } from 'lucide-react'
import { type Activity } from '@/lib/mock-data'
import LetterAvatar from '@/components/ui/letter-avatar'

interface ActivityDetailPageProps {
  activity: Activity
  onBack: () => void
  onInterested: () => void
  onGreet: () => void
}

export default function ActivityDetailPage({
  activity,
  onBack,
  onInterested,
  onGreet,
}: ActivityDetailPageProps) {
  const matchPercent = 75 + (parseInt(activity.id, 10) % 23)

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
      <header className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-serif text-lg text-foreground">活动详情</h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              {activity.category}
            </span>
            <span className="text-xs text-muted-foreground">{activity.city}</span>
            <span className="text-sm font-semibold text-accent ml-auto">{matchPercent}% 匹配</span>
          </div>

          <h2 className="text-xl font-semibold text-foreground leading-snug mb-4">
            {activity.title}
          </h2>

          <div className="flex items-center gap-3 mb-6">
            <LetterAvatar name={activity.user.name} size="lg" />
            <div>
              <p className="font-medium text-foreground">{activity.user.name}</p>
              <p className="text-xs text-muted-foreground">{activity.user.tag}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2 text-sm text-foreground">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>{activity.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>{activity.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Users className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>还剩 {activity.spotsLeft} 个名额</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">口味标签</p>
            <div className="flex flex-wrap gap-2">
              {activity.tasteTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">兴趣标签</p>
            <div className="flex flex-wrap gap-2">
              {activity.interestTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background border-t border-border max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
        <div className="flex gap-2">
          <button
            onClick={onInterested}
            className="flex-1 py-3.5 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all"
          >
            感兴趣
          </button>
          <button
            onClick={onGreet}
            className="flex-1 py-3.5 rounded-full text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-all"
          >
            打招呼
          </button>
        </div>
      </div>
    </div>
  )
}
