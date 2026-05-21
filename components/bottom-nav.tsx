'use client'

import type { LucideIcon } from 'lucide-react'
import { Home, Compass, ArrowRight, Circle, Plus } from 'lucide-react'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onPublish: () => void
}

const sideTabs = [
  { id: 'discover', label: '发现', icon: Home },
  { id: 'explore', label: '探索', icon: Compass },
  { id: 'route', label: '路线', icon: ArrowRight },
  { id: 'profile', label: '我', icon: Circle },
]

function TabButton({
  id,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  id: string
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

export default function BottomNav({ activeTab, onTabChange, onPublish }: BottomNavProps) {
  const leftTabs = sideTabs.slice(0, 2)
  const rightTabs = sideTabs.slice(2)

  return (
    <nav className="relative bg-card border-t border-border px-2 pt-1 pb-safe">
      <div className="flex items-end justify-between h-[4.5rem]">
        <div className="flex flex-1 justify-around">
          {leftTabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </div>

        {/* 中间发布按钮 */}
        <div className="flex flex-col items-center justify-end px-1 -mt-5 shrink-0">
          <button
            type="button"
            onClick={onPublish}
            aria-label="发布新行程"
            className="group flex flex-col items-center gap-1.5"
          >
            <span className="relative flex items-center justify-center w-[3.25rem] h-[3.25rem] rounded-full bg-accent text-accent-foreground shadow-[0_4px_14px_rgba(224,122,95,0.45)] ring-4 ring-background transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_6px_18px_rgba(224,122,95,0.55)] group-active:scale-95">
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </span>
            <span className="text-xs font-semibold text-accent leading-none">发行程</span>
          </button>
        </div>

        <div className="flex flex-1 justify-around">
          {rightTabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}
