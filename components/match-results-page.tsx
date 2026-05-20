'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Lightbulb } from 'lucide-react'
import LetterAvatar from '@/components/ui/letter-avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { getDefaultMatchedUsers } from '@/lib/match-users'
import {
  buildMatchReasonPayload,
  fetchMatchReason,
  getFallbackMatchReason,
  type PublishedActivityContext,
} from '@/lib/match-reasons'

export interface MatchedUser {
  id: number
  name: string
  city: string
  tag: string
  tagColor: string
  matchPercent: number
  isOnline: boolean
  commonPoints: string[]
  greeting: string
}

interface MatchResultsPageProps {
  onClose: () => void
  onBack: () => void
  onStartChat: (user: MatchedUser) => void
  activityContext: PublishedActivityContext
}

const DEFAULT_ACTIVITY: PublishedActivityContext = {
  type: '吃饭',
  location: '伦敦',
  time: '本周末',
}

function MatchReasonSkeleton() {
  return (
    <div className="space-y-2 mb-3">
      <Skeleton className="h-3.5 w-full rounded-md" />
      <Skeleton className="h-3.5 w-[92%] rounded-md" />
      <Skeleton className="h-3.5 w-[75%] rounded-md" />
    </div>
  )
}

export default function MatchResultsPage({
  onClose,
  onBack,
  onStartChat,
  activityContext,
}: MatchResultsPageProps) {
  const matchedUsers = useMemo(() => getDefaultMatchedUsers(), [])
  const [greetedUsers, setGreetedUsers] = useState<number[]>([])
  const [matchReasons, setMatchReasons] = useState<Record<number, string>>({})
  const [loadingReasons, setLoadingReasons] = useState<Record<number, boolean>>({})

  const context = activityContext.type ? activityContext : DEFAULT_ACTIVITY

  useEffect(() => {
    let cancelled = false

    async function loadAllReasons() {
      const initialLoading = Object.fromEntries(matchedUsers.map((u) => [u.id, true]))
      setLoadingReasons(initialLoading)

      await Promise.all(
        matchedUsers.map(async (user) => {
          const payload = buildMatchReasonPayload(user, context)
          const { reason } = await fetchMatchReason(payload)

          if (cancelled) return

          setMatchReasons((prev) => ({ ...prev, [user.id]: reason }))
          setLoadingReasons((prev) => ({ ...prev, [user.id]: false }))
        })
      )
    }

    loadAllReasons()
    return () => {
      cancelled = true
    }
  }, [
    matchedUsers,
    context.type,
    context.location,
    context.time,
    context.description,
    context.budget,
  ])

  const topSuggestion = useMemo(() => {
    const firstLoaded = matchedUsers.find((u) => matchReasons[u.id])
    if (firstLoaded) return matchReasons[firstLoaded.id]
    return getFallbackMatchReason(
      matchedUsers[0]?.name ?? '搭子',
      matchedUsers[0]?.commonPoints ?? [],
      context
    )
  }, [matchReasons, matchedUsers, context])

  const handleGreet = (user: MatchedUser) => {
    if (!greetedUsers.includes(user.id)) {
      setGreetedUsers([...greetedUsers, user.id])
    }
    onStartChat(user)
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <header className="px-5 py-4 bg-background">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-serif text-xl text-foreground">为你找到的搭子</h1>
            <p className="text-xs text-muted-foreground">
              {context.type} · {context.location}
              {context.time ? ` · ${context.time}` : ''}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-5 py-3">
          <div className="bg-[#FDF6E3] rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EDE4C8] flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4 text-[#8B7355]" />
              </div>
              {Object.values(loadingReasons).some(Boolean) ? (
                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-3 w-full rounded-md bg-[#EDE4C8]/80" />
                  <Skeleton className="h-3 w-[85%] rounded-md bg-[#EDE4C8]/80" />
                </div>
              ) : (
                <p className="text-sm text-[#5C4D3C] leading-relaxed">{topSuggestion}</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 space-y-4">
          {matchedUsers.map((user) => {
            const isLoading = loadingReasons[user.id] !== false
            const reason = matchReasons[user.id]

            return (
              <div key={user.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex gap-4">
                  <LetterAvatar name={user.name} size="xl" isOnline={user.isOnline} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground">· {user.city}</span>
                      </div>
                      <span className="text-sm font-semibold text-accent">
                        {user.matchPercent}% 匹配
                      </span>
                    </div>

                    {isLoading ? (
                      <MatchReasonSkeleton />
                    ) : (
                      <p className="text-sm text-foreground mb-3 leading-relaxed">
                        {reason ?? user.greeting}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {user.commonPoints.map((point, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground"
                        >
                          {point}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGreet(user)}
                        className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
                          greetedUsers.includes(user.id)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-foreground text-background hover:bg-foreground/90'
                        }`}
                      >
                        {greetedUsers.includes(user.id) ? '已打招呼' : '打招呼'}
                      </button>
                      <button className="flex-1 py-2.5 rounded-full text-sm font-medium border border-border text-foreground hover:border-foreground transition-all">
                        跳过
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
        <div className="p-5">
          <p className="text-xs text-center text-muted-foreground mb-3">
            AI已为你准备好开场白，点击打招呼即可发送
          </p>
          <button
            onClick={() => setGreetedUsers(matchedUsers.map((u) => u.id))}
            disabled={greetedUsers.length === matchedUsers.length}
            className={`w-full py-4 font-medium rounded-full transition-all ${
              greetedUsers.length === matchedUsers.length
                ? 'bg-primary text-primary-foreground'
                : 'bg-foreground text-background hover:bg-foreground/90'
            }`}
          >
            {greetedUsers.length === matchedUsers.length
              ? '已向所有人打招呼'
              : '一键给所有人打招呼'}
          </button>
        </div>
      </div>
    </div>
  )
}
