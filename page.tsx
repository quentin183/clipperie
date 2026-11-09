const benefices = [
  {
    titre: "Les bons moments, trouvés pour toi",
    texte:
      "Clipperie lit ta vidéo et repère les passages qui donnent envie de regarder la suite.",
  },
  {
    titre: "Des clips verticaux de 30 à 60 secondes",
    texte:
      "Format TikTok, Reels et Shorts, sous-titres incrustés, avec un titre proposé pour chaque clip.",
  },
  {
    titre: "Un export par lot, prêt à publier",
    texte:
      "Tu récupères tous tes clips d'un coup. Il ne reste qu'à poster.",
  },
];

export default function Accueil() {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-10">
      <p className="text-sm font-bold uppercase tracking-widest text-sapin">
        Clipperie
      </p>

      <h1 className="mt-4 text-5xl text-encre sm:text-6xl">
        Ton live de 2 heures devient{" "}
        <span className="text-vermillon">30 clips verticaux.</span>
      </h1>

      <p className="mt-5 text-xl">
        Dépose ta vidéo, récupère des clips sous-titrés, prêts à publier.
      </p>

      <section className="autocollant mt-8 rounded-lg bg-white p-5">
        <p className="font-bold text-sapin">Le problème</p>
        <p className="mt-2">
          Découper une seule vidéo longue à la main prend{" "}
          <strong>une journée entière</strong>. Alors tu ne le fais pas, et ton
          contenu dort. Pourtant, ce sont les clips courts qui t'amènent de
          nouveaux spectateurs.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl">Ce que tu obtiens</h2>
        <ul className="mt-5 space-y-4">
          {benefices.map((b) => (
            <li key={b.titre} className="border-l-4 border-sapin pl-4">
              <h3 className="text-xl">{b.titre}</h3>
              <p className="mt-1">{b.texte}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <p>
          Pour les podcasteurs, streamers et formateurs qui publient déjà du
          format long.
        </p>
      </section>

      <div className="fixed inset-x-0 bottom-0 border-t-2 border-encre bg-creme p-3">
        <div className="mx-auto max-w-2xl">
          <a
            href="/commencer"
            className="autocollant block rounded-lg bg-vermillon px-5 py-4 text-center text-lg font-bold text-white"
          >
            Commencer, c'est gratuit
          </a>
          <p className="mt-1 text-center text-xs text-encre/70">
            Un essai sur une vidéo, sans carte bancaire.
          </p>
        </div>
      </div>
    </main>
  );
}
