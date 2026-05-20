'use client'

import { MapPin, Clock, Users } from 'lucide-react'
import LetterAvatar from '@/components/ui/letter-avatar'

const exploreCategories = [
  { id: 1, name: '美食探店', count: 128, emoji: '🍜' },
  { id: 2, name: '咖啡续命', count: 86, emoji: '☕' },
  { id: 3, name: '小酒微醺', count: 52, emoji: '🍷' },
  { id: 4, name: '看展打卡', count: 34, emoji: '🎨' },
  { id: 5, name: '户外徒步', count: 29, emoji: '🥾' },
  { id: 6, name: 'K歌之王', count: 18, emoji: '🎤' },
]

const nearbyBuddies = [
  { id: 1, name: '小雨', distance: '0.8km', interests: ['咖啡', '看展'] },
  { id: 2, name: 'David', distance: '1.2km', interests: ['美食', '徒步'] },
  { id: 3, name: 'Chloe', distance: '1.5km', interests: ['电影', '小酒'] },
]

export default function ExplorePage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <h1 className="font-serif text-3xl text-foreground mb-1">
          探索<span className="italic">附近</span>
        </h1>
        <p className="text-sm text-muted-foreground">发现你身边的精彩</p>
      </div>

      {/* Location */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>当前位置 · Manhattan</span>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 mb-8">
        <h2 className="text-sm font-medium text-foreground mb-4">热门分类</h2>
        <div className="grid grid-cols-2 gap-3">
          {exploreCategories.map((cat) => (
            <button
              key={cat.id}
              className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-foreground/20 transition-colors text-left"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div>
                <p className="font-medium text-foreground">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.count} 个活动</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Buddies */}
      <div className="px-5 pb-8">
        <h2 className="text-sm font-medium text-foreground mb-4">附近的搭子</h2>
        <div className="space-y-3">
          {nearbyBuddies.map((buddy) => (
            <div
              key={buddy.id}
              className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border"
            >
              <LetterAvatar name={buddy.name} size="lg" isOnline={true} />
              <div className="flex-1">
                <p className="font-medium text-foreground">{buddy.name}</p>
                <p className="text-xs text-muted-foreground">{buddy.distance}</p>
              </div>
              <div className="flex gap-1">
                {buddy.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
