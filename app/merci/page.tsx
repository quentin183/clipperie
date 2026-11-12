export const metadata = { title: "Merci — Clipperie" };

type SessionStripe = {
  status?: string;
  customer_details?: { email?: string | null } | null;
};

async function lireSession(id: string): Promise<SessionStripe | null> {
  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return null;
  try {
    const reponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${id}`,
      { headers: { Authorization: `Bearer ${cle}` }, cache: "no-store" },
    );
    if (!reponse.ok) return null;
    return (await reponse.json()) as SessionStripe;
  } catch {
    return null;
  }
}

export default async function Merci({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = session_id ? await lireSession(session_id) : null;

  // Page d'information seulement : l'abonnement est confirmé par le webhook serveur
  if (session?.status === "open") {
    return (
      <main className="mx-auto max-w-2xl px-5 pt-10">
        <h1 className="text-4xl">Le paiement n'est pas terminé.</h1>
        <p className="mt-4">Tu n'as rien payé. Tu peux réessayer quand tu veux.</p>
        <a
          href="/paiement"
          className="autocollant mt-6 inline-block rounded-lg bg-vermillon px-5 py-3 font-bold text-white"
        >
          Revenir au paiement
        </a>
      </main>
    );
  }

  // Sans paiement confirmé par Stripe, on n'affiche jamais « c'est payé »
  if (session?.status !== "complete") {
    return (
      <main className="mx-auto max-w-2xl px-5 pt-10">
        <h1 className="text-4xl">Rien à afficher ici.</h1>
        <p className="mt-4">
          Si tu viens de payer, ton abonnement est bien pris en compte et tu
          recevras un reçu de Stripe par email.
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

  const email = session.customer_details?.email;

  return (
    <main className="mx-auto max-w-2xl px-5 pt-10">
      <h1 className="text-4xl">Merci, c'est payé.</h1>
      <p className="mt-4">
        Ton abonnement Clipperie est enregistré.
        {email ? ` Un reçu de Stripe est envoyé à ${email}.` : " Tu vas recevoir un reçu de Stripe par email."}
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
