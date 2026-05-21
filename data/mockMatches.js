/**
 * BuddyGO - Mock match results
 */

export const currentUserId = 'me'

export const mockMatchSession = {
  id: 'match-20260520-001',
  createdAt: '2026-05-20T14:32:00Z',
  city: 'London',
  intent: 'Weekend dining',
  totalCandidates: 28,
  matchedCount: 5,
}

export const mockMatches = [
  {
    id: 'm1',
    userId: 'u1',
    name: 'Mia',
    city: 'London',
    tag: 'Grad student',
    tagColor: 'bg-emerald-100 text-emerald-800',
    matchPercent: 98,
    isOnline: true,
    commonPoints: ['Tech', 'Film buff', 'Spicy food', 'Deep talk'],
    greeting: 'Love Yunnan food too — been to Yun? Down to go Saturday.',
    suggestedActivityId: 'a1',
    suggestedActivityTitle: 'Yunnan dinner in Shoreditch',
  },
  {
    id: 'm2',
    userId: 'u2',
    name: 'Ryan',
    city: 'London',
    tag: 'Tech',
    tagColor: 'bg-blue-100 text-blue-800',
    matchPercent: 91,
    isOnline: false,
    commonPoints: ['Craft beer', 'Food crawl', 'Easy hang'],
    greeting: 'Fellow tech person — drinks Friday at Canary Wharf? No work talk.',
    suggestedActivityId: 'a2',
    suggestedActivityTitle: 'After-work drinks at Canary Wharf',
  },
  {
    id: 'm3',
    userId: 'u3',
    name: 'Suki',
    city: 'NYC',
    tag: 'Finance',
    tagColor: 'bg-amber-100 text-amber-800',
    matchPercent: 87,
    isOnline: true,
    commonPoints: ['Foodie', 'Wine', 'Low-key'],
    greeting: 'NYC finance friend! Next time in London or NYC — sushi lunch?',
    suggestedActivityId: 'a3',
    suggestedActivityTitle: 'Midtown sushi lunch',
  },
  {
    id: 'm4',
    userId: 'u6',
    name: 'Alex',
    city: 'Sydney',
    tag: 'Tech',
    tagColor: 'bg-blue-100 text-blue-800',
    matchPercent: 82,
    isOnline: true,
    commonPoints: ['Coffee lover', 'Food crawl', 'Easy hang'],
    greeting: 'Sydney coffee nerd here — got any London cafe recs to trade?',
    suggestedActivityId: 'a7',
    suggestedActivityTitle: 'Coffee crawl in Haymarket',
  },
  {
    id: 'm5',
    userId: 'u7',
    name: 'Jen',
    city: 'Toronto',
    tag: 'Grad student',
    tagColor: 'bg-purple-100 text-purple-800',
    matchPercent: 79,
    isOnline: true,
    commonPoints: ['Canto-pop', 'Budget-friendly', 'Low-key'],
    greeting: 'PhD life is real — Markham brunch? Full Love has great pineapple buns.',
    suggestedActivityId: 'a9',
    suggestedActivityTitle: 'HK-style brunch in Markham',
  },
]

export const mockActivityMatches = {
  a1: [mockMatches[0], mockMatches[1]],
  a2: [mockMatches[1]],
  a14: [mockMatches[0]],
}

export default mockMatches
