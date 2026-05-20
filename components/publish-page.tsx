'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  X,
  Utensils,
  Wine,
  Coffee,
  Palette,
  Mic2,
  MoreHorizontal,
  MapPin,
  Users,
  Sparkles,
} from 'lucide-react'
import type { PublishedActivityContext } from '@/lib/match-reasons'
import { fetchParseActivity } from '@/lib/parse-activity'

interface PublishPageProps {
  onClose: () => void
  onPublishSuccess: (activity: PublishedActivityContext) => void
}

const activityTypes = [
  { id: 'eat', label: '吃饭', icon: Utensils },
  { id: 'drink', label: '喝酒', icon: Wine },
  { id: 'coffee', label: '咖啡', icon: Coffee },
  { id: 'exhibition', label: '看展', icon: Palette },
  { id: 'ktv', label: 'KTV', icon: Mic2 },
  { id: 'other', label: '其他', icon: MoreHorizontal },
]

const timeOptions = [
  { id: 'today', label: '今天' },
  { id: 'tomorrow', label: '明天' },
  { id: 'weekend', label: '本周末' },
]

const budgetOptions = [
  { id: 'low', label: '£20以下' },
  { id: 'mid', label: '£20-50' },
  { id: 'high', label: '£50+' },
]

const atmosphereTags = [
  '随性聊天',
  '深度交流',
  '安静聚餐',
  '探店打卡',
]

type HighlightField = 'description' | 'type' | 'time' | 'location' | 'budget' | 'atmosphere'

function highlightClass(field: HighlightField, highlighted: Set<HighlightField>) {
  return highlighted.has(field) ? 'field-highlight-flash' : ''
}

export default function PublishPage({ onClose, onPublishSuccess }: PublishPageProps) {
  const [description, setDescription] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [location, setLocation] = useState('')
  const [peopleCount, setPeopleCount] = useState(2)
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<string[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const [highlightedFields, setHighlightedFields] = useState<Set<HighlightField>>(new Set())

  const canUseAI = description.trim().length > 10
  const showStep2 = description.length > 0
  const showStep3 = showStep2 && selectedType && selectedDate && location

  const flashFields = useCallback((fields: HighlightField[]) => {
    setHighlightedFields(new Set(fields))
  }, [])

  useEffect(() => {
    if (highlightedFields.size === 0) return
    const timer = setTimeout(() => setHighlightedFields(new Set()), 500)
    return () => clearTimeout(timer)
  }, [highlightedFields])

  const toggleAtmosphere = (tag: string) => {
    setSelectedAtmosphere((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleAIOrganize = async () => {
    if (!canUseAI || aiLoading) return

    setAiLoading(true)
    try {
      const { parsed } = await fetchParseActivity(description.trim())

      if (parsed.title) setDescription(parsed.title)
      setSelectedType(parsed.typeId)
      setSelectedDate(parsed.dateId)
      setLocation(parsed.location)
      setSelectedBudget(parsed.budgetId)
      setSelectedAtmosphere([parsed.atmosphereTag])

      flashFields(['description', 'type', 'time', 'location', 'budget', 'atmosphere'])
    } finally {
      setAiLoading(false)
    }
  }

  const handlePublish = () => {
    const typeLabel = activityTypes.find((t) => t.id === selectedType)?.label ?? '聚餐'
    const timeLabel = timeOptions.find((t) => t.id === selectedDate)?.label
    const budgetLabel = budgetOptions.find((b) => b.id === selectedBudget)?.label

    onPublishSuccess({
      type: typeLabel,
      location,
      time: timeLabel,
      description,
      atmosphere: selectedAtmosphere,
      budget: budgetLabel,
    })
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
      <header className="flex items-center justify-between px-5 py-4 border-b border-border">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-serif text-lg text-foreground">发布活动</h1>
        <div className="w-9" />
      </header>

      <div className="flex-1 overflow-y-auto pb-28">
        <section className="p-5">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">说说你的想法</h2>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="想找人一起去试试新开的云南菜，喜欢聊科技或电影的优先～"
              className={`w-full h-32 p-4 pb-12 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-foreground/30 transition-all ${highlightClass('description', highlightedFields)}`}
            />
            <button
              type="button"
              onClick={handleAIOrganize}
              disabled={!canUseAI || aiLoading}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {aiLoading ? '整理中...' : 'AI帮我整理'}
            </button>
          </div>
        </section>

        <section
          className={`border-t border-border transition-all duration-300 ${showStep2 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}
        >
          <div className="p-5">
            <div className={`mb-6 rounded-2xl p-1 -m-1 ${highlightClass('type', highlightedFields)}`}>
              <label className="text-sm font-medium text-muted-foreground mb-3 block px-1">
                活动类型
              </label>
              <div className="grid grid-cols-3 gap-2">
                {activityTypes.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedType(id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                      selectedType === id
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border bg-card text-foreground hover:border-foreground/30'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`mb-6 rounded-2xl p-1 -m-1 ${highlightClass('time', highlightedFields)}`}>
              <label className="text-sm font-medium text-muted-foreground mb-3 block px-1">时间</label>
              <div className="flex gap-2">
                {timeOptions.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedDate(id)}
                    className={`flex-1 py-3 rounded-full border text-sm font-medium transition-all ${
                      selectedDate === id
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border bg-card text-foreground hover:border-foreground/30'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`mb-6 rounded-2xl p-1 -m-1 ${highlightClass('location', highlightedFields)}`}>
              <label className="text-sm font-medium text-muted-foreground mb-3 block px-1">地点</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="伦敦 Shoreditch"
                  className="w-full py-3 pl-12 pr-4 bg-card border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-all"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                人数 · <span className="text-foreground">{peopleCount}人</span>
              </label>
              <div className="flex items-center gap-4">
                <Users className="w-5 h-5 text-muted-foreground" />
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                  className="flex-1 h-1 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
                />
              </div>
            </div>

            <div className={`rounded-2xl p-1 -m-1 ${highlightClass('budget', highlightedFields)}`}>
              <label className="text-sm font-medium text-muted-foreground mb-3 block px-1">预算</label>
              <div className="flex gap-2">
                {budgetOptions.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedBudget(id)}
                    className={`flex-1 py-3 rounded-full border text-sm font-medium transition-all ${
                      selectedBudget === id
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border bg-card text-foreground hover:border-foreground/30'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className={`border-t border-border transition-all duration-300 ${showStep3 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}
        >
          <div className={`p-5 rounded-2xl ${highlightClass('atmosphere', highlightedFields)}`}>
            <label className="text-sm font-medium text-muted-foreground mb-3 block">氛围偏好</label>
            <div className="flex flex-wrap gap-2">
              {atmosphereTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleAtmosphere(tag)}
                  className={`py-2.5 px-4 rounded-full border text-sm font-medium transition-all ${
                    selectedAtmosphere.includes(tag)
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-card text-foreground hover:border-foreground/30'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background border-t border-border max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
        <button
          onClick={handlePublish}
          className="w-full py-4 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!description || !selectedType || !selectedDate || !location}
        >
          发布，让AI匹配
        </button>
      </div>
    </div>
  )
}
