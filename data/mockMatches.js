/**
 * 搭子GO - Mock 匹配结果数据
 * 当前用户视角：小林同学（伦敦）
 */

export const currentUserId = 'me'

export const mockMatchSession = {
  id: 'match-20260520-001',
  createdAt: '2026-05-20T14:32:00Z',
  city: '伦敦',
  intent: '周末吃饭',
  totalCandidates: 28,
  matchedCount: 5,
}

export const mockMatches = [
  {
    id: 'm1',
    userId: 'u1',
    name: '小雨',
    city: '伦敦',
    tag: '留学生',
    tagColor: 'bg-emerald-100 text-emerald-800',
    matchPercent: 98,
    isOnline: true,
    commonPoints: ['科技圈', '电影迷', '能吃辣', 'Deep talk'],
    greeting: '嗨！看到你也喜欢云南菜，Yun 那家过桥米线你去过吗？周六可以一起～',
    suggestedActivityId: 'a1',
    suggestedActivityTitle: '周六晚组个云南菜局',
  },
  {
    id: 'm2',
    userId: 'u2',
    name: '浩然',
    city: '伦敦',
    tag: 'IT外派',
    tagColor: 'bg-blue-100 text-blue-800',
    matchPercent: 91,
    isOnline: false,
    commonPoints: ['精酿', '探店打卡', '随性聊天'],
    greeting: '同是 IT 狗，周五 Canary Wharf 喝一杯？不聊代码只聊生活那种。',
    suggestedActivityId: 'a2',
    suggestedActivityTitle: 'Canary Wharf 下班喝一杯',
  },
  {
    id: 'm3',
    userId: 'u3',
    name: '思琪',
    city: '纽约',
    tag: '金融',
    tagColor: 'bg-amber-100 text-amber-800',
    matchPercent: 87,
    isOnline: true,
    commonPoints: ['Foodie', '红酒', '安静聚餐'],
    greeting: '纽约金融圈姐妹！下次你来伦敦或我去纽约，约个日料 lunch～',
    suggestedActivityId: 'a3',
    suggestedActivityTitle: 'Midtown 午餐约个日料',
  },
  {
    id: 'm4',
    userId: 'u6',
    name: '一鸣',
    city: '悉尼',
    tag: 'IT外派',
    tagColor: 'bg-blue-100 text-blue-800',
    matchPercent: 82,
    isOnline: true,
    commonPoints: ['咖啡控', '打卡探店', '随性聊天'],
    greeting: '悉尼咖啡探店党报到！你伦敦有推荐的独立咖啡馆吗？可以互换清单哈哈。',
    suggestedActivityId: 'a7',
    suggestedActivityTitle: 'Haymarket 精品咖啡探店',
  },
  {
    id: 'm5',
    userId: 'u7',
    name: '慧敏',
    city: '多伦多',
    tag: '留学生',
    tagColor: 'bg-purple-100 text-purple-800',
    matchPercent: 79,
    isOnline: true,
    commonPoints: ['港乐迷', '预算友好', '安静聚餐'],
    greeting: 'PhD 辛苦！万锦早茶局考虑一下？富来茶餐厅菠萝油绝绝子。',
    suggestedActivityId: 'a9',
    suggestedActivityTitle: '万锦港式茶餐厅 brunch',
  },
]

/** 与活动绑定的推荐匹配（用于活动详情页） */
export const mockActivityMatches = {
  a1: [mockMatches[0], mockMatches[1]],
  a2: [mockMatches[1]],
  a14: [mockMatches[0]],
}

export default mockMatches
