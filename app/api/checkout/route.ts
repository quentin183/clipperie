import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const origin = new URL(req.url).origin;

  let plan: unknown;
  try {
    plan = ((await req.json()) as { plan?: unknown }).plan;
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  // Le prix est choisi côté serveur : le navigateur ne peut jamais l'imposer
  const prix =
    plan === "annuel"
      ? process.env.STRIPE_PRICE_ID_ANNUEL
      : plan === "mensuel"
        ? process.env.STRIPE_PRICE_ID
        : undefined;

  if (plan !== "annuel" && plan !== "mensuel") {
    return NextResponse.json({ error: "Formule inconnue" }, { status: 400 });
  }
  if (!secretKey || !prix) {
    return NextResponse.json({ error: "Paiement indisponible" }, { status: 500 });
  }

  const body = new URLSearchParams({
    ui_mode: "embedded_page",
    mode: "subscription",
    "line_items[0][price]": prix,
    "line_items[0][quantity]": "1",
    return_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
    locale: "fr",
  });

  const reponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!reponse.ok) {
    console.error("STRIPE REFUSE LA SESSION", reponse.status, await reponse.text());
    return NextResponse.json({ error: "Paiement indisponible" }, { status: 502 });
  }

  const session = (await reponse.json()) as { client_secret?: string };
  if (!session.client_secret) {
    return NextResponse.json({ error: "Paiement indisponible" }, { status: 502 });
  }

  return NextResponse.json({ clientSecret: session.client_secret });
}
