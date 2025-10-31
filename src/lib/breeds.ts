export type SizeKey = 'toy' | 'small' | 'medium' | 'large' | 'giant'

export type BreedKey =
  | 'corgi'
  | 'shiba inu'
  | 'poodle_toy' | 'poodle_mini' | 'poodle_standard'
  | 'mixed_toy' | 'mixed_small' | 'mixed_medium' | 'mixed_large' | 'mixed_giant'
  | 'french bulldog' | 'maltese' | 'chihuahua'
  | 'dachshund_mini' | 'dachshund_standard'
  | 'pomeranian' | 'siberian husky' | 'golden retriever' | 'labrador'
  | 'yorkshire terrier' | 'bichon frise' | 'shih tzu'
  | 'schnauzer_mini' | 'schnauzer_standard' | 'schnauzer_giant'
  | 'japanese spitz' | 'pug' | 'shar pei' | 'great dane'

export interface BreedInfo {
  label: string
  size: SizeKey
  idealWeightRangeKg: [number, number]
}

export const BREEDS: Record<BreedKey, BreedInfo> = {
  corgi: { label: 'Corgi', size: 'small', idealWeightRangeKg: [10, 14] },
  'shiba inu': { label: 'Shiba Inu', size: 'small', idealWeightRangeKg: [7, 11] },
  poodle_toy: { label: 'Poodle (Toy)', size: 'toy', idealWeightRangeKg: [2, 4] },
  poodle_mini: { label: 'Poodle (Mini)', size: 'small', idealWeightRangeKg: [5, 8] },
  poodle_standard: { label: 'Poodle (Standard)', size: 'large', idealWeightRangeKg: [20, 32] },
  mixed_toy: { label: 'Mixed (Toy)', size: 'toy', idealWeightRangeKg: [2, 4] },
  mixed_small: { label: 'Mixed (Small)', size: 'small', idealWeightRangeKg: [5, 10] },
  mixed_medium: { label: 'Mixed (Medium)', size: 'medium', idealWeightRangeKg: [11, 24] },
  mixed_large: { label: 'Mixed (Large)', size: 'large', idealWeightRangeKg: [25, 40] },
  mixed_giant: { label: 'Mixed (Giant)', size: 'giant', idealWeightRangeKg: [41, 80] },
  'french bulldog': { label: 'French Bulldog', size: 'small', idealWeightRangeKg: [8, 14] },
  maltese: { label: 'Maltese', size: 'toy', idealWeightRangeKg: [3, 4] },
  chihuahua: { label: 'Chihuahua', size: 'toy', idealWeightRangeKg: [2, 3] },
  dachshund_mini: { label: 'Dachshund (Mini)', size: 'small', idealWeightRangeKg: [4, 5] },
  dachshund_standard: { label: 'Dachshund (Standard)', size: 'small', idealWeightRangeKg: [7, 14] },
  pomeranian: { label: 'Pomeranian', size: 'toy', idealWeightRangeKg: [2, 3.5] },
  'siberian husky': { label: 'Siberian Husky', size: 'medium', idealWeightRangeKg: [16, 27] },
  'golden retriever': { label: 'Golden Retriever', size: 'large', idealWeightRangeKg: [25, 34] },
  labrador: { label: 'Labrador', size: 'large', idealWeightRangeKg: [25, 36] },
  'yorkshire terrier': { label: 'Yorkshire Terrier', size: 'toy', idealWeightRangeKg: [2, 3.2] },
  'bichon frise': { label: 'Bichon Frise', size: 'small', idealWeightRangeKg: [5, 8] },
  'shih tzu': { label: 'Shih Tzu', size: 'small', idealWeightRangeKg: [4, 7.2] },
  schnauzer_mini: { label: 'Schnauzer (Mini)', size: 'small', idealWeightRangeKg: [5, 9] },
  schnauzer_standard: { label: 'Schnauzer (Standard)', size: 'medium', idealWeightRangeKg: [14, 20] },
  schnauzer_giant: { label: 'Schnauzer (Giant)', size: 'giant', idealWeightRangeKg: [27, 48] },
  'japanese spitz': { label: 'Japanese Spitz', size: 'small', idealWeightRangeKg: [5, 10] },
  pug: { label: 'Pug', size: 'small', idealWeightRangeKg: [6, 10] },
  'shar pei': { label: 'Shar Pei', size: 'medium', idealWeightRangeKg: [18, 30] },
  'great dane': { label: 'Great Dane', size: 'giant', idealWeightRangeKg: [50, 82] },
}

export function allBreedOptions() {
  // Flat list for select inputs
  return Object.entries(BREEDS).map(([key, info]) => ({ key: key as BreedKey, label: info.label }))
}

export function getIdealWeightMidpointKg(key: BreedKey) {
  const [lo, hi] = BREEDS[key].idealWeightRangeKg
  return (lo + hi) / 2
}

