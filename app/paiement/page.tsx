export const metadata = { title: "Paiement — Clipperie" };

export default async function Paiement({
  searchParams,
}: {
  searchParams: Promise<{ annule?: string; erreur?: string }>;
}) {
  const { annule, erreur } = await searchParams;

  return (
    <main className="mx-auto max-w-2xl px-5 pt-10">
      <h1 className="text-4xl">Clipperie, 49 € par mois</h1>
      <p className="mt-4">60 clips verticaux par mois. Sans engagement.</p>

      {annule && (
        <p className="autocollant mt-6 rounded-lg bg-white p-4">
          Le paiement a été annulé. Tu n'as rien payé. Tu peux réessayer quand
          tu veux.
        </p>
      )}
      {erreur && (
        <p className="autocollant mt-6 rounded-lg bg-white p-4">
          Le paiement n'a pas pu démarrer. Tu n'as rien payé. Réessaie dans un
          instant.
        </p>
      )}

      <form action="/api/checkout" method="post" className="mt-8">
        <button
          type="submit"
          className="autocollant block w-full rounded-lg bg-vermillon px-5 py-4 text-lg font-bold text-white"
        >
          Payer 49 € par mois
        </button>
        <p className="mt-2 text-center text-sm text-encre/70">
          Sans engagement, résiliable à tout moment.
        </p>
      </form>
    </main>
  );
}
