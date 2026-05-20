'use client'

import { useState, useCallback } from 'react'
import BottomNav from '@/components/bottom-nav'
import DiscoverPage from '@/components/discover-page'
import ExplorePage from '@/components/explore-page'
import RoutePage from '@/components/route-page'
import ProfilePage from '@/components/profile-page'
import PublishPage from '@/components/publish-page'
import MatchResultsPage, { type MatchedUser } from '@/components/match-results-page'
import ChatPage from '@/components/chat-page'
import ActivityDetailPage from '@/components/activity-detail-page'
import PageTransition from '@/components/page-transition'
import { type Activity } from '@/lib/mock-data'
import type { PublishedActivityContext } from '@/lib/match-reasons'

type TabId = 'discover' | 'explore' | 'route' | 'profile'
type OverlayPage = 'none' | 'activityDetail' | 'publish' | 'matchResults' | 'chat'

function activityToMatchedUser(activity: Activity): MatchedUser {
  const id = parseInt(activity.id, 10) || 0
  return {
    id,
    name: activity.user.name,
    city: activity.city,
    tag: activity.user.tag,
    tagColor: 'bg-muted text-muted-foreground',
    matchPercent: 75 + (id % 23),
    isOnline: true,
    commonPoints: activity.interestTags.slice(0, 3),
    greeting: activity.title,
  }
}

function activityInfoLabel(activity: Activity) {
  return `${activity.time} · ${activity.category} · ${activity.location}`
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('discover')
  const [overlayPage, setOverlayPage] = useState<OverlayPage>('none')
  const [pageKey, setPageKey] = useState(0)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [chatUser, setChatUser] = useState<MatchedUser | null>(null)
  const [chatReturnTo, setChatReturnTo] = useState<'discover' | 'matchResults' | 'activityDetail'>('discover')
  const [matchReturnTo, setMatchReturnTo] = useState<'activityDetail' | 'publish'>('activityDetail')
  const [matchActivityContext, setMatchActivityContext] = useState<PublishedActivityContext>({
    type: '吃饭',
    location: '伦敦',
    time: '本周末',
  })

  const navigate = useCallback((next: {
    tab?: TabId
    overlay?: OverlayPage
    activity?: Activity | null
    chatUser?: MatchedUser | null
    chatReturnTo?: 'discover' | 'matchResults' | 'activityDetail'
    matchReturnTo?: 'activityDetail' | 'publish'
  }) => {
    if (next.tab !== undefined) setActiveTab(next.tab)
    if (next.overlay !== undefined) setOverlayPage(next.overlay)
    if (next.activity !== undefined) setSelectedActivity(next.activity)
    if (next.chatUser !== undefined) setChatUser(next.chatUser)
    if (next.chatReturnTo !== undefined) setChatReturnTo(next.chatReturnTo)
    if (next.matchReturnTo !== undefined) setMatchReturnTo(next.matchReturnTo)
    setPageKey((k) => k + 1)
  }, [])

  const handleTabChange = useCallback(
    (tab: string) => {
      navigate({ tab: tab as TabId, overlay: 'none', activity: null, chatUser: null })
    },
    [navigate]
  )

  const handleOpenActivity = useCallback(
    (activity: Activity) => {
      navigate({ overlay: 'activityDetail', activity })
    },
    [navigate]
  )

  const handleOpenPublish = useCallback(() => {
    navigate({ overlay: 'publish' })
  }, [navigate])

  const handleOpenMatch = useCallback(
    (from: 'activityDetail' | 'publish') => {
      navigate({ overlay: 'matchResults', matchReturnTo: from })
    },
    [navigate]
  )

  const handleOpenChat = useCallback(
    (user: MatchedUser, returnTo: 'discover' | 'matchResults' | 'activityDetail') => {
      navigate({ overlay: 'chat', chatUser: user, chatReturnTo: returnTo })
    },
    [navigate]
  )

  const handleGreetFromDiscover = useCallback(
    (activity: Activity) => {
      handleOpenChat(activityToMatchedUser(activity), 'discover')
    },
    [handleOpenChat]
  )

  const handleGreetFromDetail = useCallback(() => {
    if (!selectedActivity) return
    handleOpenChat(activityToMatchedUser(selectedActivity), 'activityDetail')
  }, [selectedActivity, handleOpenChat])

  const handleBackFromDetail = useCallback(() => {
    navigate({ overlay: 'none', activity: null })
  }, [navigate])

  const handleClosePublish = useCallback(() => {
    navigate({ overlay: 'none' })
  }, [navigate])

  const handlePublishSuccess = useCallback(
    (activity: PublishedActivityContext) => {
      setMatchActivityContext(activity)
      handleOpenMatch('publish')
    },
    [handleOpenMatch]
  )

  const handleInterestedFromDetail = useCallback(() => {
    if (selectedActivity) {
      setMatchActivityContext({
        type: selectedActivity.category,
        location: selectedActivity.location,
        time: selectedActivity.time,
        description: selectedActivity.title,
      })
    }
    handleOpenMatch('activityDetail')
  }, [selectedActivity, handleOpenMatch])

  const handleBackFromMatch = useCallback(() => {
    if (matchReturnTo === 'publish') {
      navigate({ overlay: 'publish' })
    } else {
      navigate({ overlay: 'activityDetail' })
    }
  }, [matchReturnTo, navigate])

  const handleCloseMatch = useCallback(() => {
    if (matchReturnTo === 'publish') {
      navigate({ overlay: 'none' })
    } else {
      navigate({ overlay: 'none', activity: null })
    }
  }, [matchReturnTo, navigate])

  const handleBackFromChat = useCallback(() => {
    if (chatReturnTo === 'matchResults') {
      navigate({ overlay: 'matchResults', chatUser: null })
    } else if (chatReturnTo === 'activityDetail') {
      navigate({ overlay: 'activityDetail', chatUser: null })
    } else {
      navigate({ overlay: 'none', chatUser: null })
    }
  }, [chatReturnTo, navigate])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discover':
        return (
          <DiscoverPage
            onActivityClick={handleOpenActivity}
            onGreet={handleGreetFromDiscover}
          />
        )
      case 'explore':
        return <ExplorePage />
      case 'route':
        return <RoutePage />
      case 'profile':
        return <ProfilePage />
      default:
        return (
          <DiscoverPage
            onActivityClick={handleOpenActivity}
            onGreet={handleGreetFromDiscover}
          />
        )
    }
  }

  const showBottomNav = overlayPage === 'none'

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto lg:max-w-lg xl:max-w-xl relative lg:my-4 lg:rounded-[2.5rem] lg:overflow-hidden lg:border lg:border-border lg:shadow-xl">
      <main className="flex-1 overflow-hidden">
        {overlayPage === 'none' && (
          <PageTransition pageKey={`tab-${activeTab}-${pageKey}`}>
            {renderTabContent()}
          </PageTransition>
        )}

        {overlayPage === 'activityDetail' && selectedActivity && (
          <PageTransition pageKey={`detail-${pageKey}`} className="fixed inset-0 z-50">
            <ActivityDetailPage
              activity={selectedActivity}
              onBack={handleBackFromDetail}
              onInterested={handleInterestedFromDetail}
              onGreet={handleGreetFromDetail}
            />
          </PageTransition>
        )}

        {overlayPage === 'publish' && (
          <PageTransition pageKey={`publish-${pageKey}`} className="fixed inset-0 z-50">
            <PublishPage onClose={handleClosePublish} onPublishSuccess={handlePublishSuccess} />
          </PageTransition>
        )}

        {overlayPage === 'matchResults' && (
          <PageTransition pageKey={`match-${pageKey}`} className="fixed inset-0 z-50">
            <MatchResultsPage
              onClose={handleCloseMatch}
              onBack={handleBackFromMatch}
              onStartChat={(user) => handleOpenChat(user, 'matchResults')}
              activityContext={matchActivityContext}
            />
          </PageTransition>
        )}

        {overlayPage === 'chat' && chatUser && (
          <PageTransition pageKey={`chat-${pageKey}`} className="fixed inset-0 z-50">
            <ChatPage
              user={chatUser}
              activityInfo={
                selectedActivity
                  ? activityInfoLabel(selectedActivity)
                  : `${matchActivityContext.time ?? ''} · ${matchActivityContext.type} · ${matchActivityContext.location}`
              }
              activityType={selectedActivity?.category ?? matchActivityContext.type}
              activityLocation={selectedActivity?.location ?? matchActivityContext.location}
              onBack={handleBackFromChat}
            />
          </PageTransition>
        )}
      </main>

      {showBottomNav && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onPublish={handleOpenPublish}
        />
      )}
    </div>
  )
}
