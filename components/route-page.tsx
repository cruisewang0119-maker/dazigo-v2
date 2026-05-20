'use client'

import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react'
import LetterAvatar from '@/components/ui/letter-avatar'

const upcomingRoutes = [
  {
    id: 1,
    title: '周六探店：Soho美食路线',
    date: '本周六 · 6:00 PM',
    stops: ['云南菜', '甜品店', '清吧'],
    buddies: ['小雨', 'David', 'Chloe'],
    spotsLeft: 2,
  },
  {
    id: 2,
    title: '周日文艺：Chelsea画廊日',
    date: '本周日 · 2:00 PM',
    stops: ['Gagosian', 'David Zwirner', '咖啡'],
    buddies: ['阿杰', 'Sophie'],
    spotsLeft: 4,
  },
]

const savedRoutes = [
  { id: 1, name: '伦敦中餐Top10', stops: 10, likes: 234 },
  { id: 2, name: '纽约周末brunch攻略', stops: 8, likes: 189 },
  { id: 3, name: '悉尼海边咖啡馆', stops: 6, likes: 156 },
]

export default function RoutePage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <h1 className="font-serif text-3xl text-foreground mb-1">
          我的<span className="italic">路线</span>
        </h1>
        <p className="text-sm text-muted-foreground">和搭子一起探索城市</p>
      </div>

      {/* Upcoming Routes */}
      <div className="px-5 mb-8">
        <h2 className="text-sm font-medium text-foreground mb-4">即将出发</h2>
        <div className="space-y-3">
          {upcomingRoutes.map((route) => (
            <div
              key={route.id}
              className="p-4 bg-card rounded-2xl border border-border"
            >
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
              
              <div className="flex items-center gap-2 mb-3">
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
                    还差 {route.spotsLeft} 人
                  </span>
                </div>
                <button className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-full">
                  加入
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Routes */}
      <div className="px-5 pb-8">
        <h2 className="text-sm font-medium text-foreground mb-4">收藏的路线</h2>
        <div className="space-y-2">
          {savedRoutes.map((route) => (
            <button
              key={route.id}
              className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:border-foreground/20 transition-colors text-left"
            >
              <div>
                <p className="font-medium text-foreground">{route.name}</p>
                <p className="text-xs text-muted-foreground">{route.stops} 个地点 · {route.likes} 收藏</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
