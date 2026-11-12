import { createHmac, timingSafeEqual } from "crypto";

export const runtime = "nodejs";

function signatureValide(payload: string, entete: string, secret: string) {
  const parties = Object.fromEntries(
    entete.split(",").map((p) => {
      const [cle, ...reste] = p.split("=");
      return [cle, reste.join("=")];
    }),
  );
  const horodatage = parties["t"];
  const signature = parties["v1"];
  if (!horodatage || !signature) return false;

  // Refuse les messages vieux de plus de 5 minutes
  const age = Math.abs(Date.now() / 1000 - Number(horodatage));
  if (!Number.isFinite(age) || age > 300) return false;

  const attendue = createHmac("sha256", secret)
    .update(`${horodatage}.${payload}`)
    .digest("hex");

  const a = Buffer.from(attendue);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

type SessionStripe = {
  id: string;
  customer?: string | null;
  subscription?: string | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
};

async function enregistrerAbonnement(session: SessionStripe) {
  const url = process.env.SUPABASE_URL;
  const cle = process.env.SUPABASE_SECRET_KEY;
  if (!url || !cle) throw new Error("Supabase non configuré");

  const entetes: Record<string, string> = {
    apikey: cle,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  };
  // Les anciennes clés Supabase sont des jetons (eyJ...) qui vont aussi dans Authorization
  if (cle.startsWith("eyJ")) entetes.Authorization = `Bearer ${cle}`;

  const reponse = await fetch(
    `${url.replace(/\/$/, "")}/rest/v1/abonnements?on_conflict=stripe_subscription_id`,
    {
      method: "POST",
      headers: entetes,
      body: JSON.stringify({
        email: session.customer_details?.email ?? session.customer_email ?? null,
        stripe_customer_id: session.customer ?? null,
        stripe_subscription_id: session.subscription ?? session.id,
        statut: "actif",
      }),
    },
  );

  if (!reponse.ok) {
    throw new Error(`Enregistrement refusé (${reponse.status})`);
  }
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook non configuré", { status: 500 });
  }

  const payload = await req.text();
  const entete = req.headers.get("stripe-signature") ?? "";

  if (!signatureValide(payload, entete, secret)) {
    return new Response("Signature invalide", { status: 400 });
  }

  const evenement = JSON.parse(payload) as {
    type: string;
    data: { object: SessionStripe };
  };

  if (evenement.type === "checkout.session.completed") {
    try {
      await enregistrerAbonnement(evenement.data.object);
      console.log("PAIEMENT CONFIRMÉ ET ENREGISTRÉ", evenement.data.object.id);
    } catch (e) {
      console.error("ÉCHEC ENREGISTREMENT", e);
      // 500 : Stripe renverra l'événement plus tard
      return new Response("Erreur d'enregistrement", { status: 500 });
    }
  }

  return new Response("ok", { status: 200 });
}
