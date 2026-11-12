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
    data: { object: { id: string; customer_email?: string | null } };
  };

  if (evenement.type === "checkout.session.completed") {
    // Paiement confirmé côté serveur. La base de données arrive à l'étape 3.
    console.log("PAIEMENT CONFIRMÉ", evenement.data.object.id);
  }

  return new Response("ok", { status: 200 });
}
