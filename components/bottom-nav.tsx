'use client'

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Home, Compass, ArrowRight, Circle, Plus, X, Calendar, Users } from 'lucide-react'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onPublishTrip: () => void
  onFindBuddy: () => void
}

const sideTabs = [
  { id: 'discover', label: '发现', icon: Home },
  { id: 'explore', label: '探索', icon: Compass },
  { id: 'route', label: '路线', icon: ArrowRight },
  { id: 'profile', label: '我', icon: Circle },
]

const publishOptions = [
  {
    id: 'trip',
    emoji: '📅',
    title: '发布行程',
    subtitle: '发布一个新的出游计划',
    icon: Calendar,
  },
  {
    id: 'buddy',
    emoji: '🙋',
    title: '找搭子',
    subtitle: '基于现有行程找同伴',
    icon: Users,
  },
] as const

function TabButton({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string
  icon: LucideIcon
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 flex-col items-center justify-center gap-1 py-2 min-w-0 transition-colors"
    >
      <Icon
        className={`w-5 h-5 transition-colors ${
          isActive ? 'text-foreground' : 'text-muted-foreground'
        }`}
        strokeWidth={isActive ? 2 : 1.5}
      />
      <span
        className={`text-xs transition-all truncate ${
          isActive ? 'font-semibold text-foreground' : 'font-normal text-muted-foreground'
        }`}
      >
        {label}
      </span>
    </button>
  )
}

export default function BottomNav({
  activeTab,
  onTabChange,
  onPublishTrip,
  onFindBuddy,
}: BottomNavProps) {
  const [showPublishPanel, setShowPublishPanel] = useState(false)
  const leftTabs = sideTabs.slice(0, 2)
  const rightTabs = sideTabs.slice(2)

  const handleOptionSelect = (id: 'trip' | 'buddy') => {
    setShowPublishPanel(false)
    if (id === 'trip') onPublishTrip()
    else onFindBuddy()
  }

  return (
    <>
      <nav className="relative bg-card border-t border-border px-1 pt-1 pb-safe overflow-visible">
        <div className="flex items-end h-[3.75rem]">
          <div className="flex flex-1 justify-around min-w-0">
            {leftTabs.map((tab) => (
              <TabButton
                key={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
              />
            ))}
          </div>

          {/* 中间发布：80% 尺寸，上浮，标签浅棕 */}
          <div className="flex flex-col items-center justify-end w-[4.5rem] shrink-0 -mt-2.5 pb-0.5">
            <button
              type="button"
              onClick={() => setShowPublishPanel(true)}
              aria-label="打开发布选项"
              aria-expanded={showPublishPanel}
              className="flex flex-col items-center active:scale-95 transition-transform duration-150"
            >
              <span
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white text-white shadow-[0_4px_16px_rgba(255,107,107,0.42)]"
                style={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%)',
                }}
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </span>
              <span className="text-[11px] font-medium text-[#A68B6B] -mt-2.5 leading-none">
                发布
              </span>
            </button>
          </div>

          <div className="flex flex-1 justify-around min-w-0">
            {rightTabs.map((tab) => (
              <TabButton
                key={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* 发布选项面板：从底部滑出 */}
      {showPublishPanel && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
          <button
            type="button"
            aria-label="关闭"
            className="flex-1 bg-black/45 animate-in fade-in duration-200"
            onClick={() => setShowPublishPanel(false)}
          />
          <div className="bg-card rounded-t-3xl border-t border-border px-5 pt-5 pb-safe shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg text-foreground">想要做什么？</h2>
              <button
                type="button"
                onClick={() => setShowPublishPanel(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3 pb-4">
              {publishOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option.id)}
                    className="w-full flex items-center gap-4 p-4 bg-background rounded-2xl border border-border hover:border-[#FF6B6B]/40 hover:bg-[#FFF5F5] transition-all text-left active:scale-[0.98]"
                  >
                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B6B]/15 to-[#FF8C42]/15 text-2xl shrink-0">
                      {option.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-foreground">{option.title}</p>
                        <Icon className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
