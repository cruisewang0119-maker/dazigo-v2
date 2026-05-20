/** 口味图谱六维 mock 数据（0-100） */
export interface TasteRadarData {
  spiceTolerance: number
  tastePreference: number
  spendingLevel: number
  socialActivity: number
  exploreWillingness: number
  timeRegularity: number
}

export const tasteRadarMock: TasteRadarData = {
  spiceTolerance: 78,
  tastePreference: 72,
  spendingLevel: 58,
  socialActivity: 86,
  exploreWillingness: 81,
  timeRegularity: 54,
}

export const TASTE_DIMENSIONS: { key: keyof TasteRadarData; label: string }[] = [
  { key: 'spiceTolerance', label: '辣度接受' },
  { key: 'tastePreference', label: '口味偏好' },
  { key: 'spendingLevel', label: '消费水平' },
  { key: 'socialActivity', label: '社交活跃' },
  { key: 'exploreWillingness', label: '探店意愿' },
  { key: 'timeRegularity', label: '时间规律' },
]

export function getTasteValues(data: TasteRadarData): number[] {
  return TASTE_DIMENSIONS.map((d) => data[d.key])
}

/** 根据雷达图维度动态生成 AI 总结 */
export function generateTasteSummary(data: TasteRadarData): string {
  const traits: string[] = []

  if (data.spiceTolerance > 70) {
    traits.push('川湘菜爱好者')
  } else if (data.spiceTolerance < 35) {
    traits.push('清淡口味偏好者')
  }

  if (data.tastePreference > 70) {
    traits.push('味蕾冒险家')
  } else if (data.tastePreference < 40) {
    traits.push('经典口味坚守派')
  }

  if (data.spendingLevel > 70) {
    traits.push('品质生活派')
  } else if (data.spendingLevel < 40) {
    traits.push('性价比达人')
  } else {
    traits.push('灵活消费型')
  }

  if (data.socialActivity > 80) {
    traits.push('探索型食客')
  } else if (data.socialActivity < 45) {
    traits.push('小圈社交型')
  }

  if (data.exploreWillingness > 75) {
    traits.push('探店达人')
  } else if (data.exploreWillingness < 40) {
    traits.push('固定路线型')
  }

  if (data.timeRegularity > 70) {
    traits.push('作息规律党')
  } else if (data.timeRegularity < 40) {
    traits.push('随心型食客')
  }

  const uniqueTraits = [...new Set(traits)]
  const traitText =
    uniqueTraits.length > 0 ? uniqueTraits.join('、') : '均衡型美食玩家'

  let habit = '用餐习惯比较均衡'
  if (data.socialActivity > 75 && data.exploreWillingness > 70) {
    habit = '周末更爱组局探新店，社交能量满满'
  } else if (data.timeRegularity > 65) {
    habit = '倾向于固定时段约饭，节奏稳定靠谱'
  } else if (data.spiceTolerance > 65 && data.tastePreference > 60) {
    habit = '偏爱有记忆点的风味，愿意尝试地方特色菜'
  } else if (data.spendingLevel < 45) {
    habit = '会优先找好吃不贵的宝藏小店'
  }

  let matchHint = '适合匹配同样愿意聊天的饭搭子'
  if (data.socialActivity > 80) {
    matchHint = '适合匹配爱聊天、爱分享的活跃型搭子'
  } else if (data.exploreWillingness > 75) {
    matchHint = '适合匹配一起打卡新店的探店型搭子'
  } else if (data.spiceTolerance > 70) {
    matchHint = '适合匹配能吃辣的川湘菜系搭子'
  }

  return `你是典型的${traitText}，${habit}。${matchHint}。`
}
