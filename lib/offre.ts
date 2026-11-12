// Chiffres et textes de l'offre, modifiables en un seul endroit

export const HEURES_PAR_VIDEO = 8; // une journée de découpage à la main
export const EURO_PAR_HEURE = 20;
export const CLIPS_PAR_VIDEO = 30;
export const CLIPS_INCLUS = 60;

export const PRIX_MENSUEL = 49;
export const PRIX_ANNUEL = 490;

export const GARANTIE_JOURS = 14;
export const DELAI_REMBOURSEMENT = "5 jours ouvrés";

// À REMPLIR avant la mise en vente : l'adresse où les clients t'écrivent
export const EMAIL_CONTACT = "[EMAIL DE CONTACT À REMPLIR]";

export const FORMATS: Record<string, { un: string; plusieurs: string }> = {
  podcast: { un: "épisode de podcast", plusieurs: "épisodes de podcast" },
  live: { un: "live", plusieurs: "lives" },
  formation: { un: "vidéo de formation", plusieurs: "vidéos de formation" },
  autre: { un: "vidéo longue", plusieurs: "vidéos longues" },
};

export const VOLUMES: Record<string, string> = {
  "1": "1",
  "3": "2 à 3",
  "6": "4 à 7",
  "10": "8 ou plus",
};

export function calculer(n: number) {
  const couvertes = Math.min(n, Math.floor(CLIPS_INCLUS / CLIPS_PAR_VIDEO));
  const heuresGagnees = couvertes * HEURES_PAR_VIDEO;
  return {
    couvertes,
    heuresGagnees,
    euroGagnes: heuresGagnees * EURO_PAR_HEURE,
  };
}

export function euros(montant: number) {
  return montant.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
