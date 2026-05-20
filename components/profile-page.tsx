'use client'

import { useMemo } from 'react'
import { Settings, ChevronRight, Edit3, LogOut, Sparkles } from 'lucide-react'
import LetterAvatar from '@/components/ui/letter-avatar'
import TasteRadarChart from '@/components/taste-radar-chart'
import { mockUsers } from '@/data/mockUsers'
import { computeProfileStats, CURRENT_USER } from '@/lib/profile-stats'
import { tasteRadarMock, generateTasteSummary } from '@/lib/taste-profile'

export default function ProfilePage() {
  const stats = useMemo(() => computeProfileStats(), [])
  const tasteSummary = useMemo(() => generateTasteSummary(tasteRadarMock), [])
  const buddyWall = mockUsers.slice(0, 6)

  return (
    <div className="flex flex-col min-h-full pb-8 overflow-y-auto">
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-foreground">
          我<span className="italic">的</span>
        </h1>
        <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border hover:border-foreground/20 transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="px-5 mb-6">
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-start gap-4 mb-5">
            <LetterAvatar name="林" size="2xl" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-1">{CURRENT_USER.displayName}</h2>
              <p className="text-sm text-muted-foreground mb-2">
                {CURRENT_USER.city} · {CURRENT_USER.role}
              </p>
              <button className="flex items-center gap-1.5 text-sm text-foreground font-medium hover:underline">
                <Edit3 className="w-4 h-4" />
                编辑资料
              </button>
            </div>
          </div>

          <div className="flex items-center justify-around py-4 bg-muted/50 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">{stats.activityCount}</div>
              <div className="text-xs text-muted-foreground">活动</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">{stats.buddyCount}</div>
              <div className="text-xs text-muted-foreground">搭子</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">{stats.goodReviewRate}%</div>
              <div className="text-xs text-muted-foreground">好评</div>
            </div>
          </div>
        </div>
      </div>

      {/* 口味图谱 */}
      <div className="px-5 mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">口味图谱</h3>
        <div className="bg-card rounded-2xl border border-border p-5">
          <TasteRadarChart data={tasteRadarMock} />

          <div className="mt-4 p-4 rounded-xl bg-[#FFF5F5] border border-[#FF6B6B]/15">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
              <span className="text-xs font-medium text-[#FF6B6B]">AI 口味解读</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{tasteSummary}</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">我的标签</h3>
        <div className="flex flex-wrap gap-2">
          {CURRENT_USER.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-sm rounded-full border border-border text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">我的搭子</h3>
          <button className="text-sm text-muted-foreground flex items-center gap-1">
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center -space-x-2">
          {buddyWall.map((user) => (
            <div key={user.id} className="ring-2 ring-background rounded-full">
              <LetterAvatar
                name={user.nickname || user.name}
                size="lg"
                isOnline={user.isOnline}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {buddyWall.map((u) => u.nickname || u.name).join('、')}
        </p>
      </div>

      <div className="px-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">最近活动</h3>
          <button className="text-sm text-muted-foreground flex items-center gap-1">
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {stats.recentActivities.map((activity) => (
            <button
              key={activity.id}
              className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:border-foreground/20 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <LetterAvatar name={activity.partnerName} size="sm" />
                <div>
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                {activity.status}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        <button className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>
    </div>
  )
}
