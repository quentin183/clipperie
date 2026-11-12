"use client";

import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import {
  PRIX_ANNUEL,
  PRIX_MENSUEL,
  euros,
} from "../../lib/offre";

const cle = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = cle ? loadStripe(cle) : null;

type Plan = "annuel" | "mensuel";

const FORMULES: {
  id: Plan;
  titre: string;
  prix: string;
  detail: string;
  jour: string;
  badge?: string;
}[] = [
  {
    id: "annuel",
    titre: "Annuel",
    prix: `${euros(PRIX_ANNUEL)} € par an`,
    detail: `soit ${euros(PRIX_ANNUEL / 12)} € par mois`,
    jour: `${euros(PRIX_ANNUEL / 365)} € par jour`,
    badge: "2 mois offerts",
  },
  {
    id: "mensuel",
    titre: "Mensuel",
    prix: `${euros(PRIX_MENSUEL)} € par mois`,
    detail: "Sans durée minimale",
    jour: `${euros((PRIX_MENSUEL * 12) / 365)} € par jour`,
  },
];

export default function Paiement() {
  const [plan, setPlan] = useState<Plan>("annuel");

  const fetchClientSecret = useCallback(async () => {
    const reponse = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const donnees = (await reponse.json()) as { clientSecret?: string };
    if (!reponse.ok || !donnees.clientSecret) {
      throw new Error("Paiement indisponible");
    }
    return donnees.clientSecret;
  }, [plan]);

  return (
    <section id="formules" className="mt-10">
      <h2 className="text-3xl">Choisis ta formule</h2>

      <div className="mt-5 space-y-4">
        {FORMULES.map((f) => {
          const actif = plan === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={actif}
              onClick={() => setPlan(f.id)}
              className={`autocollant block w-full rounded-lg p-4 text-left ${
                actif ? "bg-white outline outline-4 outline-vermillon" : "bg-creme"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-titre text-xl font-extrabold">{f.titre}</span>
                {f.badge && (
                  <span className="rounded bg-sapin px-2 py-1 text-xs font-bold text-white">
                    {f.badge}
                  </span>
                )}
              </span>
              <span className="mt-1 block text-lg font-bold">{f.prix}</span>
              <span className="block text-sm text-encre/70">
                {f.detail} · {f.jour}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center font-bold text-sapin">
        Sans engagement, résiliable à tout moment.
      </p>

      <div className="mt-4">
        {stripePromise ? (
          <EmbeddedCheckoutProvider
            key={plan}
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <p className="autocollant rounded-lg bg-white p-4">
            Le paiement est momentanément indisponible. Tu n'as rien payé.
            Réessaie dans un instant.
          </p>
        )}
      </div>
    </section>
  );
}
