'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Send, Zap } from 'lucide-react'
import LetterAvatar from '@/components/ui/letter-avatar'
import {
  fetchIcebreakers,
  getDefaultIcebreakerContext,
  FALLBACK_ICEBREAKERS,
} from '@/lib/icebreakers'
import { getPartnerTags } from '@/lib/partner-tags'
import type { MatchedUser } from '@/components/match-results-page'

interface ChatPageProps {
  user: MatchedUser
  activityInfo: string
  activityType?: string
  activityLocation?: string
  onBack: () => void
}

const mockMessages = [
  {
    id: 1,
    type: 'match-info',
    content: '',
    matchTags: ['Deep talk', '咖啡控', '艺术'],
  },
  {
    id: 2,
    type: 'received',
    content: '嗨！看到你也喜欢慢brunch，试过SoHo的Butler吗？',
  },
  {
    id: 3,
    type: 'sent',
    content: '还没有！适合安静的早晨吗？',
  },
  {
    id: 4,
    type: 'received',
    content: '超适合。抹茶很棒，10点前人少。这周六要不要一起去？',
  },
  {
    id: 5,
    type: 'sent',
    content: '太好了！那就周六9:30？',
  },
]

function ThinkingDots() {
  return (
    <span className="inline-flex gap-0.5 ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-[#FF6B6B] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

export default function ChatPage({
  user,
  activityInfo,
  activityType,
  activityLocation,
  onBack,
}: ChatPageProps) {
  const [messages, setMessages] = useState(mockMessages)
  const [inputValue, setInputValue] = useState('')
  const [icebreakers, setIcebreakers] = useState<string[]>([])
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(true)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const icebreakerContext = useMemo(() => {
    const base = getDefaultIcebreakerContext(user.name, user.commonPoints, activityInfo)
    return {
      ...base,
      partnerTags: getPartnerTags(user.name, user.commonPoints),
      activityType: activityType ?? base.activityType,
      activityLocation: activityLocation ?? base.activityLocation,
    }
  }, [user.name, user.commonPoints, activityInfo, activityType, activityLocation])

  useEffect(() => {
    let cancelled = false

    async function loadIcebreakers() {
      setLoadingIcebreakers(true)
      const result = await fetchIcebreakers(icebreakerContext)
      if (!cancelled) {
        setIcebreakers(result.topics)
        setLoadingIcebreakers(false)
      }
    }

    loadIcebreakers()
    return () => {
      cancelled = true
    }
  }, [icebreakerContext])

  const handleSend = (text?: string) => {
    const content = (text ?? inputValue).trim()
    if (!content) return
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        type: 'sent',
        content,
      },
    ])
    setInputValue('')
    setShowSuggestions(false)
  }

  const handleLightningClick = () => {
    setShowSuggestions(true)
  }

  const displayTopics = icebreakers.length >= 3 ? icebreakers : FALLBACK_ICEBREAKERS

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <header className="px-4 py-3 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <LetterAvatar name={user.name} size="md" isOnline={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{user.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              在线 · {user.city} · {activityInfo}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => {
          if (msg.type === 'match-info') {
            const tags =
              msg.matchTags && msg.matchTags.length > 0 ? msg.matchTags : user.commonPoints
            return (
              <div key={msg.id} className="flex flex-col items-center py-4">
                <p className="text-xs text-muted-foreground mb-2 tracking-wide">你们匹配的兴趣</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          }

          if (msg.type === 'sent') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[80%] bg-foreground text-background px-4 py-3 rounded-2xl rounded-br-md">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            )
          }

          if (msg.type === 'received') {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-[80%] bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-bl-md">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            )
          }

          return null
        })}
      </div>

      {showSuggestions && (
        <div className="px-4 pb-2">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#FF6B6B]" fill="#FF6B6B" />
              <span className="text-sm font-medium text-foreground">AI 破冰话题</span>
            </div>

            {loadingIcebreakers ? (
              <p className="text-sm text-muted-foreground flex items-center">
                AI思考中
                <ThinkingDots />
              </p>
            ) : (
              <ul className="space-y-2">
                {displayTopics.map((topic, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => handleSend(topic)}
                      className="w-full text-left text-sm text-foreground px-3 py-2.5 rounded-xl bg-muted/60 hover:bg-muted transition-colors leading-snug"
                    >
                      {topic}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="p-4 bg-background border-t border-border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLightningClick}
            className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center border transition-all ${
              showSuggestions
                ? 'bg-[#FF6B6B]/10 border-[#FF6B6B] text-[#FF6B6B]'
                : 'bg-card border-border text-foreground hover:border-foreground/30'
            }`}
            aria-label="AI破冰话题"
          >
            <Zap className="w-5 h-5" fill={showSuggestions ? '#FF6B6B' : 'none'} />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..."
            className="flex-1 px-4 py-3 bg-card border border-border rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="w-11 h-11 bg-foreground text-background rounded-full flex items-center justify-center hover:bg-foreground/90 active:scale-95 transition-all disabled:opacity-50 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
