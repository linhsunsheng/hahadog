import Card from './Card'

export interface NutritionProps {
  kcalPerDay: number
  proteinG: number
  fatG: number
  linoleicG: number
  calciumG: number
  phosphorusG: number
  caToPRatio: number
  factorUsed: number
  lifeStage: string
  notes: string[]
}

export default function NutritionResults(props: NutritionProps) {
  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-sm text-black/60">Daily Calories</div>
          <div className="text-4xl font-semibold">{props.kcalPerDay} kcal</div>
          <div className="mt-2 text-xs text-black/50">Factor: {props.factorUsed} · {props.lifeStage}</div>
        </div>
        <span className="badge">Ca:P {props.caToPRatio}:1</span>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="text-left text-xs uppercase text-black/60">
              <th className="pr-4">Nutrient</th>
              <th>g/day</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pr-4">Protein</td>
              <td>{props.proteinG}</td>
            </tr>
            <tr>
              <td className="pr-4">Fat</td>
              <td>{props.fatG}</td>
            </tr>
            <tr>
              <td className="pr-4">Linoleic acid</td>
              <td>{props.linoleicG}</td>
            </tr>
            <tr>
              <td className="pr-4">Calcium</td>
              <td>{props.calciumG}</td>
            </tr>
            <tr>
              <td className="pr-4">Phosphorus</td>
              <td>{props.phosphorusG}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-[color:var(--color-teal-700)]">Why these numbers?</summary>
        <p className="mt-2 text-black/70">
          We use RER = 70 × kg^0.75 and a life-stage/activity factor to estimate daily calories.
          Protein, fats, calcium, phosphorus and linoleic acid are scaled per 1000 kcal using AAFCO-like targets.
          Consider using a veterinary balancer for micronutrients.
        </p>
      </details>
      {props.notes?.length ? (
        <ul className="mt-3 list-disc pl-5 text-xs text-black/60">
          {props.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      ) : null}
    </Card>
  )
}

