"use client";

export default function Erreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-10">
      <h1 className="text-4xl">Quelque chose s'est mal passé.</h1>
      <p className="mt-4">Ce n'est pas de ta faute. Tu peux réessayer.</p>
      <button
        onClick={reset}
        className="autocollant mt-6 mr-3 rounded-lg bg-vermillon px-5 py-3 font-bold text-white"
      >
        Réessayer
      </button>
      <a href="/" className="underline">
        Retour à l'accueil
      </a>
    </main>
  );
}
