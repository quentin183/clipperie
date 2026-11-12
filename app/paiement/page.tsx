import Paiement from "./paiement";
import {
  CLIPS_INCLUS,
  CLIPS_PAR_VIDEO,
  DELAI_REMBOURSEMENT,
  EMAIL_CONTACT,
  EURO_PAR_HEURE,
  FORMATS,
  GARANTIE_JOURS,
  HEURES_PAR_VIDEO,
  PRIX_MENSUEL,
  VOLUMES,
  calculer,
} from "../../lib/offre";

export const metadata = {
  title: "Ton plan est prêt — Clipperie",
  description: "Choisis ta formule. Satisfait ou remboursé 14 jours, sans engagement.",
};

export default async function PagePaiement({
  searchParams,
}: {
  searchParams: Promise<{ f?: string; n?: string }>;
}) {
  const { f, n } = await searchParams;

  // Reprise des réponses du tunnel, validées contre une liste fixe
  const format = f && f in FORMATS ? FORMATS[f] : null;
  const volumeValide = n && n in VOLUMES ? Number(n) : null;
  const perso = format && volumeValide ? { format, n: volumeValide } : null;
  const { couvertes, heuresGagnees, euroGagnes } = calculer(perso ? perso.n : 2);
  const nomCouvert = perso
    ? couvertes > 1
      ? perso.format.plusieurs
      : perso.format.un
    : "vidéos longues";

  const contactValide = !EMAIL_CONTACT.startsWith("[");

  const questions = [
    {
      q: "Est-ce que ça marche pour mon cas ?",
      r: "Clipperie est faite pour les podcasteurs, les streamers et les formateurs qui publient déjà des vidéos longues. Elle repère les passages forts à partir de ce qui est dit dans ta vidéo, donc elle convient surtout aux contenus parlés.",
    },
    {
      q: "Combien de temps ça me prend ?",
      r: "Tu déposes ton fichier ou ton lien, puis Clipperie transcrit, repère les moments forts et découpe. Tu n'as plus qu'à relire et à publier. La durée du traitement dépend de la longueur de ta vidéo.",
    },
    {
      q: "Et si je veux arrêter ?",
      r: `Tu résilies quand tu veux, sans frais ni durée minimale. Dans les ${GARANTIE_JOURS} premiers jours, tu es en plus remboursé sur simple demande. Pour résilier, écris-nous${contactValide ? ` à ${EMAIL_CONTACT}` : ""} : ta demande est prise en compte tout de suite.`,
    },
    {
      q: "À quoi sert exactement ce que je paie ?",
      r: `À ${CLIPS_INCLUS} clips verticaux par mois, soit environ ${Math.floor(CLIPS_INCLUS / CLIPS_PAR_VIDEO)} vidéos de 2 heures. Chaque clip est sous-titré, avec un titre proposé, et tu les exportes tous d'un coup, prêts à publier.`,
    },
  ];

  return (
    <main className="mx-auto max-w-2xl px-5 pt-8 pb-10">
      <h1 className="text-4xl">Voilà ton plan, prêt.</h1>
      <p className="mt-4">
        Ta semaine 1 est à toi. Pour débloquer la suite et tes {CLIPS_INCLUS} clips par
        mois, choisis ta formule.
      </p>

      <section className="autocollant mt-6 rounded-lg bg-white p-5">
        <p className="font-bold text-sapin">Satisfait ou remboursé, {GARANTIE_JOURS} jours</p>
        <p className="mt-2">
          Tu n'es pas convaincu ? Écris-nous{contactValide ? ` à ${EMAIL_CONTACT}` : ""} dans
          les {GARANTIE_JOURS} jours qui suivent ton paiement, sans avoir à te justifier. Tu es
          remboursé en {DELAI_REMBOURSEMENT}.
        </p>
      </section>

      <section className="autocollant mt-6 rounded-lg bg-white p-5">
        <p className="font-bold text-sapin">Ce que ça t'économise</p>
        <p className="mt-2">
          {perso ? `Pour tes ${VOLUMES[String(perso.n)]} ${perso.format.plusieurs} par mois, ` : ""}
          Clipperie traite environ {couvertes} {nomCouvert} par mois. À la main, ce serait{" "}
          <strong>{heuresGagnees} h</strong> de travail, soit <strong>{euroGagnes} €</strong> de
          ton temps à {EURO_PAR_HEURE} € de l'heure. Ici : <strong>{PRIX_MENSUEL} € par mois</strong>.
        </p>
        <p className="mt-2 text-sm text-encre/70">
          Calcul basé sur {HEURES_PAR_VIDEO} h de découpage par vidéo longue.
        </p>
      </section>

      <Paiement />

      <section className="mt-12">
        <h2 className="text-3xl">Questions fréquentes</h2>
        <div className="mt-4 space-y-3">
          {questions.map((x) => (
            <details key={x.q} className="autocollant rounded-lg bg-white p-4">
              <summary className="cursor-pointer font-bold">{x.q}</summary>
              <p className="mt-3">{x.r}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
