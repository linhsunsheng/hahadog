import { BREEDS, type BreedKey } from './breeds'

export type Activity = 'low' | 'normal' | 'high'
export type Neuter = 'neutered' | 'intact'
export type Goal = 'maintain' | 'lose' | 'gain'
export type LifeStage = 'puppy' | 'adult' | 'senior'

export interface NutritionInput {
  breed: BreedKey
  weightKg: number
  ageYears: number
  ageMonths: number
  activity: Activity
  neuter: Neuter
  goal?: Goal
}

export interface NutritionOutput {
  kcalPerDay: number
  proteinG: number
  fatG: number
  linoleicG: number
  calciumG: number
  phosphorusG: number
  caToPRatio: number
  factorUsed: number
  lifeStage: LifeStage
  idealWeightKg: number
  goal: Goal
  notes: string[]
}
// Convenient alias expected by some pages
export type Outputs = NutritionOutput

function round(n: number, digits = 0) {
  const f = 10 ** digits
  return Math.round(n * f) / f
}

function totalMonths(ageYears: number, ageMonths: number) {
  const total = Math.max(0, Math.round(ageYears * 12 + ageMonths))
  return total
}

function sizeOfBreed(breed: BreedKey) {
  return BREEDS[breed].size
}

function stageFromAge(breed: BreedKey, months: number): LifeStage {
  const size = sizeOfBreed(breed)
  const adultThreshold = size === 'giant' ? 18 : size === 'large' ? 15 : 12
  const seniorThreshold = size === 'giant' ? 84 : size === 'large' ? 96 : 120
  if (months < adultThreshold) return 'puppy'
  if (months >= seniorThreshold) return 'senior'
  return 'adult'
}

function recommendGoal(currentKg: number, idealKg: number): Goal {
  const ratio = currentKg / Math.max(1, idealKg)
  if (ratio > 1.1) return 'lose'
  if (ratio < 0.9) return 'gain'
  return 'maintain'
}

export function computeNutrition(input: NutritionInput): NutritionOutput {
  const { breed, weightKg, ageYears, ageMonths, activity, neuter } = input
  const months = totalMonths(ageYears, ageMonths)
  const lifeStage = stageFromAge(breed, months)
  const [lo, hi] = BREEDS[breed].idealWeightRangeKg
  const idealWeight = (lo + hi) / 2
  const _goal = input.goal ?? recommendGoal(weightKg, idealWeight)
  const kgForRER = _goal === 'maintain' ? Math.max(1, weightKg) : Math.max(1, idealWeight)
  const RER = 70 * kgForRER ** 0.75

  const size = sizeOfBreed(breed)
  let factor: number
  const notes: string[] = []

  if (_goal !== 'maintain') {
    // Base goal factors, then apply small adjustments so user inputs still matter
    factor = _goal === 'lose' ? 1.0 : 1.4
    // Activity adjustments so changes are reflected even during weight-change plans
    if (activity === 'low') factor -= 0.1
    if (activity === 'high') factor += 0.2
    // Intact dogs often need a touch more energy
    if (neuter === 'intact') factor += 0.1
    // Reasonable clamp to avoid extreme values while cutting/gaining
    factor = Math.max(0.9, Math.min(1.6, factor))
    notes.push('Used ideal body weight for RER due to goal; applied activity/neuter adjustments.')
  } else if (lifeStage === 'puppy') {
    factor = size === 'large' || size === 'giant' ? 1.7 : 2.0
    notes.push('Puppy needs increased calories for growth.')
  } else {
    factor = neuter === 'neutered' ? 1.3 : 1.5
    if (activity === 'low') factor -= 0.1
    if (activity === 'high') factor += 0.2
    if (lifeStage === 'senior') {
      const clamped = Math.min(1.3, Math.max(1.1, factor))
      if (clamped !== factor) notes.push('Senior factor clamped to 1.1–1.3.')
      factor = clamped
    }
  }

  const MER = RER * factor
  const per1000 = lifeStage === 'puppy'
    ? { protein: 56, fat: 21, linoleic: 2.8, calcium: 3.0, phosphorus: 2.5, dhaEpaNote: 'Growth: include DHA+EPA ~0.13 g/1000 kcal' }
    : { protein: 45, fat: 13.8, linoleic: 2.8, calcium: 1.25, phosphorus: 1.0, dhaEpaNote: '' }

  if (lifeStage === 'puppy') notes.push(per1000.dhaEpaNote)
  notes.push('Consider a veterinary-balanced micronutrient supplement when home-preparing diets.')

  const proteinG = (MER * per1000.protein) / 1000
  const fatG = (MER * per1000.fat) / 1000
  const linoleicG = (MER * per1000.linoleic) / 1000
  const calciumG = (MER * per1000.calcium) / 1000
  const phosphorusG = (MER * per1000.phosphorus) / 1000
  const ratio = calciumG / Math.max(0.0001, phosphorusG)

  return {
    kcalPerDay: round(MER, 0),
    proteinG: round(proteinG, 1),
    fatG: round(fatG, 1),
    linoleicG: round(linoleicG, 2),
    calciumG: round(calciumG, 2),
    phosphorusG: round(phosphorusG, 2),
    caToPRatio: round(ratio, 2),
    factorUsed: round(factor, 2),
    lifeStage,
    idealWeightKg: round(idealWeight, 1),
    goal: _goal,
    notes,
  }
}

export function deriveAgeFromBirthday(iso?: string) {
  if (!iso) return { years: 0, months: 0 }
  const birth = new Date(iso)
  const now = new Date()
  let y = now.getFullYear() - birth.getFullYear()
  let m = now.getMonth() - birth.getMonth()
  if (now.getDate() < birth.getDate()) m -= 1
  if (m < 0) { y -= 1; m += 12 }
  return { years: Math.max(0, y), months: Math.max(0, m) }
}
