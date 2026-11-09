export const metadata = { title: "Commencer — Clipperie" };

export default function Commencer() {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-10">
      <h1 className="text-4xl">On ouvre très bientôt.</h1>
      <p className="mt-4">
        Le parcours d'essai gratuit est en cours de construction. Il arrive
        dans la prochaine étape.
      </p>
      <a
        href="/"
        className="autocollant mt-6 inline-block rounded-lg bg-vermillon px-5 py-3 font-bold text-white"
      >
        Retour à l'accueil
      </a>
    </main>
  );
}
