'use client'

import { Calendar, ChevronRight } from 'lucide-react'
import LetterAvatar from '@/components/ui/letter-avatar'

const upcomingRoutes = [
  {
    id: 1,
    title: 'Sat food crawl: SoHo',
    date: 'Sat · 6:00 PM',
    stops: ['Yunnan', 'Dessert', 'Bar'],
    buddies: ['Mia', 'David', 'Chloe'],
    spotsLeft: 2,
  },
  {
    id: 2,
    title: 'Sun art walk: Chelsea',
    date: 'Sun · 2:00 PM',
    stops: ['Gagosian', 'Zwirner', 'Coffee'],
    buddies: ['Ryan', 'Suki'],
    spotsLeft: 4,
  },
]

const savedRoutes = [
  { id: 1, name: 'Top Chinese in London', stops: 10, likes: 234 },
  { id: 2, name: 'NYC weekend brunch', stops: 8, likes: 189 },
  { id: 3, name: 'Sydney beach cafes', stops: 6, likes: 156 },
]

export default function RoutePage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-5 pt-8 pb-4">
        <h1 className="font-serif text-3xl text-foreground mb-1">
          My <span className="italic">routes</span>
        </h1>
        <p className="text-sm text-muted-foreground">Explore the city with buddies</p>
      </div>

      <div className="px-5 mb-8">
        <h2 className="text-sm font-medium text-foreground mb-4">Coming up</h2>
        <div className="space-y-3">
          {upcomingRoutes.map((route) => (
            <div key={route.id} className="p-4 bg-card rounded-2xl border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground mb-1">{route.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {route.date}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {route.stops.map((stop, idx) => (
                  <span key={idx} className="flex items-center text-xs text-muted-foreground">
                    {idx > 0 && <span className="mx-1">→</span>}
                    {stop}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {route.buddies.map((buddy, idx) => (
                      <LetterAvatar key={idx} name={buddy} size="sm" />
                    ))}
                  </div>
                  <span className="ml-3 text-xs text-muted-foreground">
                    {route.spotsLeft} spots left
                  </span>
                </div>
                <button className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-full">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-8">
        <h2 className="text-sm font-medium text-foreground mb-4">Saved</h2>
        <div className="space-y-2">
          {savedRoutes.map((route) => (
            <button
              key={route.id}
              className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:border-foreground/20 transition-colors text-left"
            >
              <div>
                <p className="font-medium text-foreground">{route.name}</p>
                <p className="text-xs text-muted-foreground">
                  {route.stops} stops · {route.likes} saves
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
