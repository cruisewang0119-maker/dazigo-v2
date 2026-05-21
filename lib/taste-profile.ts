/** Taste radar mock data (0-100) */
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
  { key: 'spiceTolerance', label: 'Spice' },
  { key: 'tastePreference', label: 'Flavor' },
  { key: 'spendingLevel', label: 'Budget' },
  { key: 'socialActivity', label: 'Social' },
  { key: 'exploreWillingness', label: 'Explorer' },
  { key: 'timeRegularity', label: 'Schedule' },
]

export function getTasteValues(data: TasteRadarData): number[] {
  return TASTE_DIMENSIONS.map((d) => data[d.key])
}

export function generateTasteSummary(data: TasteRadarData): string {
  const traits: string[] = []

  if (data.spiceTolerance > 70) traits.push('a spice lover')
  else if (data.spiceTolerance < 35) traits.push('into milder flavors')

  if (data.tastePreference > 70) traits.push('an adventurous eater')
  else if (data.tastePreference < 40) traits.push('a classics person')

  if (data.spendingLevel > 70) traits.push('quality-first')
  else if (data.spendingLevel < 40) traits.push('budget-savvy')
  else traits.push('flexible on spend')

  if (data.socialActivity > 80) traits.push('a social foodie')
  else if (data.socialActivity < 45) traits.push('small-circle vibes')

  if (data.exploreWillingness > 75) traits.push('always down to try new spots')
  else if (data.exploreWillingness < 40) traits.push('creature of habit')

  if (data.timeRegularity > 70) traits.push('loves a steady dinner routine')
  else if (data.timeRegularity < 40) traits.push('spontaneous planner')

  const traitText = traits.length > 0 ? traits.slice(0, 3).join(', ') : 'well-rounded'

  let habit = 'You keep meals pretty balanced.'
  if (data.socialActivity > 75 && data.exploreWillingness > 70) {
    habit = 'Weekends are for group hangs and new restaurants.'
  } else if (data.timeRegularity > 65) {
    habit = 'You like reliable meal times — easy to plan around.'
  } else if (data.spiceTolerance > 65 && data.tastePreference > 60) {
    habit = 'You chase bold flavors and regional spots.'
  } else if (data.spendingLevel < 45) {
    habit = 'Hidden gems that taste great without breaking the bank? Yes please.'
  }

  let matchHint = 'Best matched with buddies who actually want to chat over food.'
  if (data.socialActivity > 80) {
    matchHint = 'Great fit for outgoing, chatty dining partners.'
  } else if (data.exploreWillingness > 75) {
    matchHint = 'Pair up with fellow food explorers who love new openings.'
  } else if (data.spiceTolerance > 70) {
    matchHint = 'Find buddies who can handle the heat with you.'
  }

  return `You're ${traitText}. ${habit} ${matchHint}`
}
