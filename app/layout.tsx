import type { Metadata, Viewport } from "next";
import "@fontsource/fraunces/800.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clipperie — Ton live de 2 heures devient 30 clips verticaux",
  description:
    "Dépose ta vidéo longue. Clipperie repère les meilleurs moments, les découpe en clips verticaux sous-titrés, prêts à publier. Essai gratuit, sans carte.",
  openGraph: {
    title: "Ton live de 2 heures devient 30 clips verticaux.",
    description:
      "Clips verticaux sous-titrés, prêts à publier. Essai gratuit sur une vidéo, sans carte.",
    locale: "fr_FR",
    type: "website",
    siteName: "Clipperie",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F1E7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <footer className="mx-auto max-w-2xl px-5 pb-28 pt-10 text-sm text-encre/70">
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <a className="underline" href="/mentions-legales">Mentions légales</a>
            <a className="underline" href="/cgv">CGV</a>
            <a className="underline" href="/confidentialite">Confidentialité</a>
          </nav>
          <p className="mt-3">© 2026 Clipperie</p>
        </footer>
      </body>
    </html>
  );
}
