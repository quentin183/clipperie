export const metadata = { title: "Merci — Clipperie" };

export default function Merci() {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-10">
      <h1 className="text-4xl">Merci, c'est payé.</h1>
      <p className="mt-4">
        Ton abonnement Clipperie est enregistré. Tu vas recevoir un reçu de
        Stripe par email.
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
