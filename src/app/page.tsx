import Button from "@/components/Button";
import Card from "@/components/Card";
import DogDoodle from "@/components/DogDoodle";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <span className="badge mt-10">Science-based targets</span>
      <h1 className="font-heading mt-4 text-4xl font-extrabold leading-tight">Know what your dog needs—daily.</h1>
      <p className="mt-4 max-w-xl text-lg text-black/70">
        Friendly guidance and saved profiles for your pups. Calories and key nutrients calculated for breed, age, and goals. For free!
      </p>
      <div className="mt-6 flex gap-3">
        <Button href="/auth?mode=register" className="btn-primary">Sign up</Button>
        <Button href="/auth?mode=login" variant="teal">Log in</Button>
      </div>
      <ul className="mt-6 list-inside list-disc text-left text-black/70">
        <li>Popular breeds pre-loaded with ideal weights</li>
        <li>Save profiles and defaults per dog</li>
        <li>Clear daily targets for protein, fats, and minerals</li>
      </ul>
      <div className="mt-8 w-full max-w-xl">
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-sm text-black/60">Meet Haha Dog!</div>
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
