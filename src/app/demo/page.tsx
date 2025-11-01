"use client"
import { useEffect, useMemo, useState } from 'react'
import { allBreedOptions, type BreedKey } from '@/lib/breeds'
import { computeNutrition, deriveAgeFromBirthday, type Activity, type Neuter, type Outputs } from '@/lib/nutrition'
import { Field, Input, Select } from '@/components/Field'

export default function DemoPage() {
  const breeds = useMemo(() => allBreedOptions(), [])
  const [breed, setBreed] = useState<BreedKey>('corgi')
  const [birthday, setBirthday] = useState<string>('')
  const [weight, setWeight] = useState<string>('10')
  const [activity, setActivity] = useState<Activity>('normal')
  const [neuter, setNeuter] = useState<Neuter>('neutered')
  

  const age = useMemo(() => deriveAgeFromBirthday(birthday || undefined), [birthday])
  const ageMonthsTotal = age.years * 12 + age.months
  const showPuppyWarning = Boolean(birthday) && ageMonthsTotal < 24

  const weightNum = Number(weight)
  const weightOutOfRange = Number.isFinite(weightNum) && (weightNum < 1 || weightNum > 80)

  const [result, setResult] = useState<Outputs | null>(null)

  function handleCalculate() {
    const w = Number(weight)
    if (!Number.isFinite(w) || w <= 0) return
    const a = birthday ? age : { years: 2, months: 0 }
    const out = computeNutrition({
      breed,
      weightKg: w,
      ageYears: a.years,
      ageMonths: a.months,
      activity,
      neuter,
    })
    setResult(out)
  }

  return (
    <div className="mx-auto mt-8 max-w-[960px] space-y-8">
      <section className="rounded-2xl bg-yellow-200 p-6 shadow-lg text-brown-600">
        <h1 className="mb-4 text-2xl font-semibold">Demo: Daily Nutrition Calculator</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Breed" id="breed">
            <Select id="breed" value={breed} onChange={(e)=> setBreed(e.target.value as BreedKey)}>
              {breeds.map((b) => <option key={b.key} value={b.key}>{b.label}</option>)}
            </Select>
          </Field>
          <Field label="Birthday" id="birthday">
            <Input id="birthday" type="date" value={birthday} onChange={(e)=> setBirthday(e.target.value)} />
          </Field>
          <Field label="Weight (kg)" id="weight">
            <Input id="weight" type="number" inputMode="decimal" min={1} max={80} step={0.1} value={weight} onChange={(e)=> setWeight(e.target.value)} />
            <p className="mt-1 text-xs text-brown-600/80">Typical range 1–80 kg. Results may be inaccurate outside this range.</p>
            {weightOutOfRange && (
              <p className="mt-1 text-xs text-red-800">Note: Weight entered is outside 1–80 kg.</p>
            )}
          </Field>
          <Field label="Activity" id="activity">
            <Select id="activity" value={activity} onChange={(e)=> setActivity(e.target.value as Activity)}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </Select>
          </Field>
          <Field label="Neuter status" id="neuter">
            <Select id="neuter" value={neuter} onChange={(e)=> setNeuter(e.target.value as Neuter)}>
              <option value="neutered">Neutered</option>
              <option value="intact">Intact</option>
            </Select>
          </Field>
          {/* Goal is derived automatically from weight vs ideal weight */}
        </div>
        <button className="btn btn-primary mt-4" onClick={handleCalculate}>Calculate</button>
      </section>

      {showPuppyWarning && (
        <div role="alert" aria-live="polite" className="mx-auto rounded-xl border border-yellow-600/40 bg-yellow-100 p-3 text-sm text-yellow-900">
          Puppy detected (&lt; 2 years). This calculator targets adult dogs; values may not be appropriate.
        </div>
      )}

      <section className="rounded-2xl bg-peach-300 p-6 shadow-lg text-brown-600">
        <h2 className="mb-4 text-xl font-semibold">Daily Targets</h2>
        {result ? (
          <div>
            <div className="mb-6">
              <div className="text-sm">Daily Calories</div>
              <div className="text-4xl font-bold">{result.kcalPerDay} kcal/day</div>
              <div className="mt-1 text-sm">Recommended goal: <span className="font-semibold capitalize">{result.goal}</span> · Ideal weight: {result.idealWeightKg} kg</div>
            </div>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-sm">Protein</dt>
                <dd className="text-lg font-medium">{result.proteinG} g/day</dd>
              </div>
              <div>
                <dt className="text-sm">Fat</dt>
                <dd className="text-lg font-medium">{result.fatG} g/day</dd>
              </div>
              <div>
                <dt className="text-sm">Linoleic acid</dt>
                <dd className="text-lg font-medium">{result.linoleicG} g/day</dd>
              </div>
              <div>
                <dt className="text-sm">Calcium</dt>
                <dd className="text-lg font-medium">{result.calciumG} g/day</dd>
              </div>
              <div>
                <dt className="text-sm">Phosphorus</dt>
                <dd className="text-lg font-medium">{result.phosphorusG} g/day</dd>
              </div>
              <div>
                <dt className="text-sm">Ca:P ratio</dt>
                <dd className="text-lg font-medium">{result.caToPRatio}:1</dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="text-sm opacity-80">Enter details and click Calculate.</p>
        )}
      </section>
    </div>
  )
}
