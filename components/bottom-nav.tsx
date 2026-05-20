'use client'

import { Home, Compass, Sparkles, ArrowRight, Circle } from 'lucide-react'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onPublish: () => void
}

const tabs = [
  { id: 'discover', label: '发现', icon: Home },
  { id: 'explore', label: '探索', icon: Compass },
  { id: 'buddy', label: '搭子', icon: Sparkles },
  { id: 'route', label: '路线', icon: ArrowRight },
  { id: 'profile', label: '我', icon: Circle },
]

export default function BottomNav({ activeTab, onTabChange, onPublish }: BottomNavProps) {
  const handleTabClick = (tabId: string) => {
    if (tabId === 'buddy') {
      onPublish()
    } else {
      onTabChange(tabId)
    }
  }

  return (
    <nav className="bg-card border-t border-border px-2 pb-safe">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const isBuddy = tab.id === 'buddy'
          const Icon = tab.icon
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all duration-200 ${
                isBuddy ? '-mt-1' : ''
              }`}
            >
              {isBuddy ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <Sparkles 
                    className="w-5 h-5 text-foreground"
                    strokeWidth={2}
                    fill="currentColor"
                  />
                </div>
              ) : (
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
              )}
              <span 
                className={`text-xs transition-all ${
                  isActive || isBuddy
                    ? 'font-semibold text-foreground' 
                    : 'font-normal text-muted-foreground'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
