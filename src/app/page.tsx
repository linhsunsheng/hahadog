import Button from "@/components/Button";
import Card from "@/components/Card";
import DogDoodle from "@/components/DogDoodle";

export default function Home() {
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
      <div>
        <span className="badge">Science-based targets</span>
        <h1 className="mt-4 text-4xl font-bold leading-tight">Know what your dog needs—daily.</h1>
        <p className="mt-3 max-w-xl text-lg text-black/70">
          Friendly guidance and saved profiles for your pups. Calories and key nutrients calculated for breed, age, and goals.
        </p>
        <div className="mt-6 flex gap-3">
          <Button href="/auth" className="btn-primary">Sign up</Button>
          <Button href="/auth" variant="teal">Log in</Button>
        </div>
        <ul className="mt-6 space-y-2 text-black/70">
          <li>• Popular breeds pre-loaded with ideal weights</li>
          <li>• Save profiles and defaults per dog</li>
          <li>• Clear daily targets for protein, fats, and minerals</li>
        </ul>
      </div>
      <div>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-black/60">Meet Pepper</div>
              <div className="text-2xl font-semibold">A very good dog</div>
            </div>
            <DogDoodle className="h-20 w-40" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-[color:var(--color-peach-300)]/40 p-4">
              <div className="text-black/60">Calories</div>
              <div className="text-2xl font-semibold">845 kcal</div>
            </div>
            <div className="rounded-xl bg-[color:var(--color-teal-700)]/15 p-4">
              <div className="text-black/60">Protein</div>
              <div className="text-2xl font-semibold">38 g</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-black/60">Actual numbers come from your dog’s profile.</div>
        </Card>
      </div>
    </div>
  );
}
