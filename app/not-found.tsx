export const metadata = { title: "Page introuvable — Clipperie" };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-10">
      <h1 className="text-4xl">Cette page n'existe pas.</h1>
      <p className="mt-4">Le lien est peut-être cassé. Reviens à l'accueil.</p>
      <a
        href="/"
        className="autocollant mt-6 inline-block rounded-lg bg-vermillon px-5 py-3 font-bold text-white"
      >
        Retour à l'accueil
      </a>
    </main>
  );
}
