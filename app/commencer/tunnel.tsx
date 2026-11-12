"use client";

import { useState } from "react";

// Hypothèses du calcul, faciles à modifier
const HEURES_PAR_VIDEO = 8; // une journée de découpage à la main
const EURO_PAR_HEURE = 20;
const CLIPS_PAR_VIDEO = 30;
const CLIPS_INCLUS = 60;
const PRIX_MOIS = 49;

const FORMATS = [
  { id: "podcast", label: "Un podcast", un: "épisode de podcast", plusieurs: "épisodes de podcast" },
  { id: "live", label: "Des lives", un: "live", plusieurs: "lives" },
  { id: "formation", label: "Des formations", un: "vidéo de formation", plusieurs: "vidéos de formation" },
  { id: "autre", label: "Autre chose", un: "vidéo longue", plusieurs: "vidéos longues" },
];

const VOLUMES = [
  { label: "1", n: 1 },
  { label: "2 à 3", n: 3 },
  { label: "4 à 7", n: 6 },
  { label: "8 ou plus", n: 10 },
];

const USAGES = [
  {
    id: "rien",
    label: "Je ne les découpe pas",
    phrase: "Aujourd'hui, ces vidéos ne produisent aucun clip : ton format court reste vide.",
  },
  {
    id: "moi",
    label: "Je les découpe moi-même",
    phrase: "Aujourd'hui, tu les découpes toi-même, et chaque clip te coûte du temps.",
  },
  {
    id: "autre",
    label: "Quelqu'un les découpe pour moi",
    phrase: "Aujourd'hui, tu dépends de quelqu'un d'autre pour chaque clip.",
  },
];

const TITRES = [
  "Quel type de contenu long publies-tu ?",
  "Combien de vidéos longues publies-tu par mois ?",
  "Que deviennent-elles aujourd'hui ?",
];

function Barre({ etape }: { etape: number }) {
  const pct = Math.round(((etape + 1) / 3) * 100);
  return (
    <div className="mt-2">
      <p className="text-sm font-bold text-sapin">Question {etape + 1} sur 3</p>
      <div
        className="mt-2 h-3 w-full rounded-full border-2 border-encre bg-white"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-vermillon" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Choix({ texte, onClick }: { texte: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="autocollant block min-h-14 w-full rounded-lg bg-white px-5 py-4 text-left text-lg font-bold"
    >
      {texte}
    </button>
  );
}

export default function Tunnel() {
  const [etape, setEtape] = useState(0);
  const [format, setFormat] = useState(FORMATS[0]);
  const [volume, setVolume] = useState(VOLUMES[0]);
  const [usage, setUsage] = useState(USAGES[0]);

  // Écrans de questions
  if (etape <= 2) {
    return (
      <main className="mx-auto max-w-2xl px-5 pt-8 pb-10">
        <Barre etape={etape} />
        <h1 className="mt-6 text-3xl">{TITRES[etape]}</h1>
        <div className="mt-6 space-y-4">
          {etape === 0 &&
            FORMATS.map((f) => (
              <Choix key={f.id} texte={f.label} onClick={() => { setFormat(f); setEtape(1); }} />
            ))}
          {etape === 1 &&
            VOLUMES.map((v) => (
              <Choix key={v.label} texte={v.label} onClick={() => { setVolume(v); setEtape(2); }} />
            ))}
          {etape === 2 &&
            USAGES.map((u) => (
              <Choix key={u.id} texte={u.label} onClick={() => { setUsage(u); setEtape(3); }} />
            ))}
        </div>
        {etape > 0 && (
          <button onClick={() => setEtape(etape - 1)} className="mt-6 text-sm underline">
            Revenir à la question précédente
          </button>
        )}
      </main>
    );
  }

  // Calculs personnalisés
  const n = volume.n;
  const nom = n > 1 ? format.plusieurs : format.un;
  const heures = n * HEURES_PAR_VIDEO;
  const cout = heures * EURO_PAR_HEURE;
  const couvertes = Math.min(n, Math.floor(CLIPS_INCLUS / CLIPS_PAR_VIDEO));
  const heuresGagnees = couvertes * HEURES_PAR_VIDEO;
  const euroGagnes = heuresGagnees * EURO_PAR_HEURE;

  // Écran 4 : résultat personnalisé
  if (etape === 3) {
    return (
      <main className="mx-auto max-w-2xl px-5 pt-8 pb-32">
        <h1 className="text-3xl">Voilà ce que ça te coûte aujourd'hui.</h1>
        <p className="mt-4">
          Tu publies {volume.label} {nom} par mois. {usage.phrase}
        </p>

        <section className="autocollant mt-6 rounded-lg bg-white p-5">
          <p className="font-bold text-sapin">Les découper à la main</p>
          <p className="mt-2">
            Environ <strong>{heures} h</strong> de travail par mois, soit{" "}
            <strong>{cout} €</strong> de ton temps à {EURO_PAR_HEURE} € de l'heure.
          </p>
        </section>

        <section className="autocollant mt-6 rounded-lg bg-white p-5">
          <p className="font-bold text-sapin">Avec Clipperie</p>
          <p className="mt-2">
            {CLIPS_INCLUS} clips verticaux par mois, soit environ {couvertes}{" "}
            {couvertes > 1 ? format.plusieurs : format.un}. Tu récupères{" "}
            <strong>{heuresGagnees} h</strong>, soit <strong>{euroGagnes} €</strong> de
            temps, pour <strong>{PRIX_MOIS} € par mois</strong>.
          </p>
        </section>

        <p className="mt-4 text-sm text-encre/70">
          Calcul basé sur une journée de découpage (8 h) par vidéo longue. Tes chiffres
          peuvent varier.
        </p>

        <div className="fixed inset-x-0 bottom-0 border-t-2 border-encre bg-creme p-3">
          <div className="mx-auto max-w-2xl">
            <button
              onClick={() => setEtape(4)}
              className="autocollant block w-full rounded-lg bg-vermillon px-5 py-4 text-center text-lg font-bold text-white"
            >
              Voir mon plan de publication
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Écran 5 : avant-goût gratuit, la suite est visible mais verrouillée
  const jours = [
    { jour: "Lundi", plateforme: "TikTok", clip: "La phrase qui surprend le plus, en ouverture." },
    { jour: "Mercredi", plateforme: "Instagram Reels", clip: "Un conseil concret, donné en moins de 40 secondes." },
    { jour: "Vendredi", plateforme: "YouTube Shorts", clip: "Le moment le plus drôle ou le plus inattendu." },
  ];
  const verrouilles = ["Semaine 2", "Semaine 3", "Semaine 4"];

  return (
    <main className="mx-auto max-w-2xl px-5 pt-8 pb-32">
      <h1 className="text-3xl">Ton plan de publication, semaine 1.</h1>
      <p className="mt-4">
        Pour tes {nom}, voici comment répartir tes clips. Tu peux l'utiliser dès
        maintenant.
      </p>

      <ul className="mt-6 space-y-4">
        {jours.map((j) => (
          <li key={j.jour} className="autocollant rounded-lg bg-white p-4">
            <p className="font-bold text-sapin">
              {j.jour} · {j.plateforme}
            </p>
            <p className="mt-1">{j.clip}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl">La suite de ton plan</h2>
      <ul className="mt-4 space-y-3">
        {verrouilles.map((s) => (
          <li
            key={s}
            className="rounded-lg border-2 border-dashed border-encre/40 p-4 text-encre/60"
          >
            <p className="font-bold">{s} · verrouillée</p>
            <p className="mt-1 text-sm">Disponible avec ton abonnement Clipperie.</p>
          </li>
        ))}
      </ul>

      <div className="fixed inset-x-0 bottom-0 border-t-2 border-encre bg-creme p-3">
        <div className="mx-auto max-w-2xl">
          <a
            href="/paiement"
            className="autocollant block w-full rounded-lg bg-vermillon px-5 py-4 text-center text-lg font-bold text-white"
          >
            Débloquer la suite
          </a>
          <p className="mt-1 text-center text-xs text-encre/70">
            Sans engagement, résiliable à tout moment.
          </p>
        </div>
      </div>
    </main>
  );
}
