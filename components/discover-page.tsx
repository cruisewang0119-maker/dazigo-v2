'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { mockActivities, type Activity, type ActivityBudget, type ActivitySchedule } from '@/lib/mock-data'
import LetterAvatar from '@/components/ui/letter-avatar'

const categoryTags = ['全部', '吃饭', '喝酒', '咖啡', '看展', 'KTV'] as const

const cities = ['伦敦', '纽约', '悉尼', '多伦多', '新加坡'] as const
const scheduleOptions: { id: ActivitySchedule; label: string }[] = [
  { id: 'today', label: '今天' },
  { id: 'tomorrow', label: '明天' },
  { id: 'weekend', label: '本周末' },
]
const peopleOptions = [
  { id: '1', label: '1人' },
  { id: '2', label: '2人' },
  { id: '3+', label: '3人以上' },
] as const
const budgetOptions: { id: ActivityBudget; label: string }[] = [
  { id: 'low', label: '£20以下' },
  { id: 'mid', label: '£20-50' },
  { id: 'high', label: '£50+' },
]

type PeopleFilter = (typeof peopleOptions)[number]['id']

interface PanelFilters {
  city: string | null
  schedule: ActivitySchedule | null
  people: PeopleFilter | null
  budget: ActivityBudget | null
}

const emptyPanelFilters: PanelFilters = {
  city: null,
  schedule: null,
  people: null,
  budget: null,
}

interface DiscoverPageProps {
  onActivityClick: (activity: Activity) => void
  onGreet: (activity: Activity) => void
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>

  const lowerText = text.toLowerCase()
  const lowerQuery = q.toLowerCase()
  const parts: { text: string; match: boolean }[] = []
  let cursor = 0

  while (cursor < text.length) {
    const index = lowerText.indexOf(lowerQuery, cursor)
    if (index === -1) {
      parts.push({ text: text.slice(cursor), match: false })
      break
    }
    if (index > cursor) parts.push({ text: text.slice(cursor, index), match: false })
    parts.push({ text: text.slice(index, index + q.length), match: true })
    cursor = index + q.length
  }

  return (
    <>
      {parts.map((part, i) =>
        part.match ? (
          <span key={i} className="text-[#E07A5F] font-medium">
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  )
}

function matchesPeople(spotsLeft: number, people: PeopleFilter | null) {
  if (!people) return true
  if (people === '1') return spotsLeft === 1
  if (people === '2') return spotsLeft === 2
  return spotsLeft >= 3
}

function activitySearchText(activity: Activity) {
  return [
    activity.title,
    activity.category,
    activity.city,
    activity.location,
    activity.user.name,
    activity.user.tag,
    ...activity.tasteTags,
    ...activity.interestTags,
  ]
    .join(' ')
    .toLowerCase()
}

function BuddyCard({
  activity,
  searchQuery,
  onActivityClick,
  onGreet,
}: {
  activity: Activity
  searchQuery: string
  onActivityClick: (activity: Activity) => void
  onGreet: (activity: Activity) => void
}) {
  const matchPercent = 75 + (parseInt(activity.id.replace(/\D/g, ''), 10) % 23)
  const interests = activity.interestTags.slice(0, 3)
  const displayTitle = `"${activity.title.slice(0, 56)}${activity.title.length > 56 ? '...' : ''}"`

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onActivityClick(activity)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onActivityClick(activity)
      }}
      className="bg-card rounded-2xl border border-border p-5 mb-4 cursor-pointer hover:border-foreground/20 transition-colors active:scale-[0.99]"
    >
      <div className="flex gap-4">
        <LetterAvatar name={activity.user.name} size="xl" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-foreground shrink-0">
                <HighlightText text={activity.user.name} query={searchQuery} />
              </span>
              <span className="text-xs text-muted-foreground truncate">
                · {activity.user.tag} · {activity.city}
              </span>
            </div>
            <span className="text-sm font-semibold text-accent shrink-0 ml-2">
              {matchPercent}% 匹配
            </span>
          </div>

          <p className="text-sm text-foreground mb-2 leading-relaxed">
            <HighlightText text={displayTitle} query={searchQuery} />
          </p>

          <p className="text-xs text-muted-foreground mb-3">
            <HighlightText text={`${activity.time} · ${activity.location}`} query={searchQuery} />
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              <HighlightText text={activity.category} query={searchQuery} />
            </span>
            {interests.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground"
              >
                <HighlightText text={tag} query={searchQuery} />
              </span>
            ))}
            {activity.tasteTags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground"
              >
                <HighlightText text={tag} query={searchQuery} />
              </span>
            ))}
          </div>

          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onGreet(activity)}
              className="flex-1 py-2.5 rounded-full text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-all"
            >
              打招呼
            </button>
            <button className="flex-1 py-2.5 rounded-full text-sm font-medium border border-border text-foreground hover:border-foreground transition-all">
              跳过
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterPanel({
  draft,
  onChange,
  onApply,
  onReset,
  onClose,
}: {
  draft: PanelFilters
  onChange: (next: PanelFilters) => void
  onApply: () => void
  onReset: () => void
  onClose: () => void
}) {
  const toggle = <T extends string>(key: keyof PanelFilters, value: T) => {
    onChange({ ...draft, [key]: draft[key] === value ? null : value })
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="关闭筛选"
        className="flex-1 bg-black/40"
        onClick={onClose}
      />
      <div className="bg-card rounded-t-3xl border-t border-border shadow-2xl max-h-[78%] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-serif text-lg text-foreground">筛选</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-6">
          <section>
            <p className="text-sm font-medium text-muted-foreground mb-3">城市</p>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => toggle('city', city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    draft.city === city
                      ? 'bg-foreground text-background'
                      : 'bg-background border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-medium text-muted-foreground mb-3">时间</p>
            <div className="flex flex-wrap gap-2">
              {scheduleOptions.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle('schedule', id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    draft.schedule === id
                      ? 'bg-foreground text-background'
                      : 'bg-background border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-medium text-muted-foreground mb-3">人数</p>
            <div className="flex flex-wrap gap-2">
              {peopleOptions.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle('people', id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    draft.people === id
                      ? 'bg-foreground text-background'
                      : 'bg-background border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-medium text-muted-foreground mb-3">预算</p>
            <div className="flex flex-wrap gap-2">
              {budgetOptions.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle('budget', id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    draft.budget === id
                      ? 'bg-foreground text-background'
                      : 'bg-background border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-5 py-4 flex gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-3 rounded-full text-sm font-medium border border-border text-foreground hover:bg-muted transition-all"
          >
            重置
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-[2] py-3 rounded-full text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-all"
          >
            筛选
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DiscoverPage({ onActivityClick, onGreet }: DiscoverPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [draftFilters, setDraftFilters] = useState<PanelFilters>(emptyPanelFilters)
  const [appliedFilters, setAppliedFilters] = useState<PanelFilters>(emptyPanelFilters)
  const [panelFiltersActive, setPanelFiltersActive] = useState(false)

  const hasPanelFilters = (f: PanelFilters) =>
    !!(f.city || f.schedule || f.people || f.budget)

  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return mockActivities.filter((activity) => {
      if (selectedCategory !== '全部' && activity.category !== selectedCategory) {
        return false
      }

      if (q && !activitySearchText(activity).includes(q)) {
        return false
      }

      if (panelFiltersActive) {
        if (appliedFilters.city && activity.city !== appliedFilters.city) return false
        if (appliedFilters.schedule && activity.schedule !== appliedFilters.schedule) return false
        if (appliedFilters.people && !matchesPeople(activity.spotsLeft, appliedFilters.people)) {
          return false
        }
        if (appliedFilters.budget && activity.budget !== appliedFilters.budget) return false
      }

      return true
    })
  }, [selectedCategory, searchQuery, appliedFilters, panelFiltersActive])

  const showResultCount =
    panelFiltersActive ||
    selectedCategory !== '全部' ||
    searchQuery.trim().length > 0

  const openFilterPanel = () => {
    setDraftFilters(appliedFilters)
    setShowFilterPanel(true)
  }

  const applyFilters = () => {
    setAppliedFilters(draftFilters)
    setPanelFiltersActive(hasPanelFilters(draftFilters))
    setShowFilterPanel(false)
  }

  const resetDraftFilters = () => {
    setDraftFilters(emptyPanelFilters)
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <div className="px-5 pt-8 pb-2 shrink-0 pr-[5.5rem]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h1 className="font-serif text-4xl text-foreground leading-tight">找到你的</h1>
            <h1 className="font-serif text-4xl italic text-foreground">搭子。</h1>
          </div>
          <button
            type="button"
            onClick={openFilterPanel}
            className="mt-2 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-foreground/30 transition-colors shrink-0"
            aria-label="打开筛选"
          >
            <SlidersHorizontal className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索活动、标签、城市..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted"
              aria-label="清空搜索"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {showResultCount ? (
          <p className="text-sm font-medium text-foreground">
            找到 <span className="text-accent">{filteredActivities.length}</span> 个活动
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {mockActivities.length} 个活动等你发现
          </p>
        )}
      </div>

      <div className="px-5 py-3 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoryTags.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-foreground text-background'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 min-h-0">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <BuddyCard
              key={activity.id}
              activity={activity}
              searchQuery={searchQuery}
              onActivityClick={onActivityClick}
              onGreet={onGreet}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-foreground font-medium mb-1">暂无匹配活动</p>
            <p className="text-sm text-muted-foreground">试试调整分类、搜索词或筛选条件</p>
          </div>
        )}
      </div>

      {showFilterPanel && (
        <FilterPanel
          draft={draftFilters}
          onChange={setDraftFilters}
          onApply={applyFilters}
          onReset={resetDraftFilters}
          onClose={() => setShowFilterPanel(false)}
        />
      )}
    </div>
  )
}
