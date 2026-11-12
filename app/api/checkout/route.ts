import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const origin = new URL(req.url).origin;

  if (!secretKey || !priceId) {
    return NextResponse.redirect(`${origin}/paiement?erreur=1`, 303);
  }

  const body = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: `${origin}/merci`,
    cancel_url: `${origin}/paiement?annule=1`,
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
    return NextResponse.redirect(`${origin}/paiement?erreur=1`, 303);
  }

  const session = (await reponse.json()) as { url?: string };
  if (!session.url) {
    return NextResponse.redirect(`${origin}/paiement?erreur=1`, 303);
  }

  return NextResponse.redirect(session.url, 303);
}
