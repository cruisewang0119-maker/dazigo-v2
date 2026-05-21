'use client'

import { useState } from 'react'
import { Plus, X, Calendar, Users } from 'lucide-react'

interface FloatingPublishButtonProps {
  visible?: boolean
  onPublishTrip: () => void
  onFindBuddy: () => void
}

const publishOptions = [
  {
    id: 'trip' as const,
    emoji: '📅',
    title: '发布行程',
    subtitle: '发布一个新的出游计划',
    icon: Calendar,
  },
  {
    id: 'buddy' as const,
    emoji: '🙋',
    title: '找搭子',
    subtitle: '基于现有行程找同伴',
    icon: Users,
  },
]

export default function FloatingPublishButton({
  visible = true,
  onPublishTrip,
  onFindBuddy,
}: FloatingPublishButtonProps) {
  const [showPublishPanel, setShowPublishPanel] = useState(false)

  if (!visible) return null

  const handleOptionSelect = (id: 'trip' | 'buddy') => {
    setShowPublishPanel(false)
    if (id === 'trip') onPublishTrip()
    else onFindBuddy()
  }

  return (
    <>
      <div className="fixed top-7 right-7 z-50 flex flex-col items-center gap-1.5 pointer-events-none">
        <div className="pointer-events-auto">
        <button
          type="button"
          onClick={() => setShowPublishPanel(true)}
          aria-label="打开发布选项"
          aria-expanded={showPublishPanel}
          className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform duration-150"
        >
          <span
            className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-white text-white shadow-[0_6px_20px_rgba(255,107,107,0.45)]"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%)',
            }}
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </span>
          <span className="text-[11px] font-medium text-[#A68B6B] leading-none">发布</span>
        </button>
        </div>
      </div>

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
