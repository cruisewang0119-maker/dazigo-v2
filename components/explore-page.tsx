'use client'

import { MapPin } from 'lucide-react'
import LetterAvatar from '@/components/ui/letter-avatar'

const exploreCategories = [
  { id: 1, name: 'Food crawl', count: 128, emoji: '🍜' },
  { id: 2, name: 'Coffee', count: 86, emoji: '☕' },
  { id: 3, name: 'Drinks', count: 52, emoji: '🍷' },
  { id: 4, name: 'Art & shows', count: 34, emoji: '🎨' },
  { id: 5, name: 'Outdoors', count: 29, emoji: '🥾' },
  { id: 6, name: 'Karaoke', count: 18, emoji: '🎤' },
]

const nearbyBuddies = [
  { id: 1, name: 'Mia', distance: '0.5 mi', interests: ['Coffee', 'Art'] },
  { id: 2, name: 'David', distance: '0.8 mi', interests: ['Food', 'Hike'] },
  { id: 3, name: 'Chloe', distance: '1 mi', interests: ['Film', 'Drinks'] },
]

export default function ExplorePage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-5 pt-8 pb-4">
        <h1 className="font-serif text-3xl text-foreground mb-1">
          Explore <span className="italic">nearby</span>
        </h1>
        <p className="text-sm text-muted-foreground">What&apos;s happening around you</p>
      </div>

      <div className="px-5 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Manhattan, NY</span>
        </div>
      </div>

      <div className="px-5 mb-8">
        <h2 className="text-sm font-medium text-foreground mb-4">Popular</h2>
        <div className="grid grid-cols-2 gap-3">
          {exploreCategories.map((cat) => (
            <button
              key={cat.id}
              className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-foreground/20 transition-colors text-left"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div>
                <p className="font-medium text-foreground">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.count} plans</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-8">
        <h2 className="text-sm font-medium text-foreground mb-4">Nearby</h2>
        <div className="space-y-3">
          {nearbyBuddies.map((buddy) => (
            <div
              key={buddy.id}
              className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border"
            >
              <LetterAvatar name={buddy.name} size="lg" isOnline={true} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{buddy.name}</p>
                <p className="text-xs text-muted-foreground">{buddy.distance}</p>
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
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
