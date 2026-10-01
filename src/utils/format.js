/**
 * Utilitaires de formatage et de tri (fonctions pures, testables).
 */

/**
 * Convertit une date renvoyée par l'API (format `JJ-MM-AAAA`) en objet Date.
 * `new Date("10-02-2026")` n'étant pas fiable, le format est analysé à la main.
 * Les dates ISO restent acceptées. Renvoie null si la valeur est inexploitable.
 *
 * @param {string|Date|null|undefined} value
 * @returns {Date|null}
 */
export function parseApiDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const str = String(value).trim();
  const parts = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (parts) {
    const [, day, month, year] = parts;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  const date = new Date(str);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Trie les saisons de la plus récente à la plus ancienne, sans muter le tableau
 * d'origine. S'appuie sur `start_date`, et retombe sur l'identifiant lorsque les
 * dates sont absentes, illisibles ou identiques.
 *
 * @param {Array<object>|null|undefined} seasons
 * @returns {Array<object>}
 */
export function sortSeasonsByRecent(seasons) {
  if (!Array.isArray(seasons)) return [];
  return [...seasons].sort((a, b) => {
    const dateA = parseApiDate(a?.start_date);
    const dateB = parseApiDate(b?.start_date);
    if (dateA && dateB && dateA.getTime() !== dateB.getTime()) {
      return dateB.getTime() - dateA.getTime();
    }
    return Number(b?.id ?? 0) - Number(a?.id ?? 0);
  });
}

const SEASON_STATUS_LABELS = {
  upcoming: "à venir",
  active: "en cours",
  done: "terminé",
};

const SEASON_STATUS_CLASSES = {
  upcoming: "scheduled",
  active: "active",
  done: "done",
};

/**
 * Détermine le statut d'une saison à partir de ses dates : « à venir » avant
 * `start_date`, « terminé » après `end_date` (ou si tous les matchs sont joués),
 * « en cours » sinon. Sans dates exploitables, retombe sur le pourcentage.
 *
 * @param {object|null|undefined} season
 * @param {Date} [now]
 * @returns {{ key: 'upcoming'|'active'|'done', label: string, cssClass: string }}
 */
export function getSeasonStatus(season, now = new Date()) {
  const start = parseApiDate(season?.start_date);
  const end = parseApiDate(season?.end_date);
  let key;
  if (Number(season?.percentage) === 100) {
    key = "done";
  } else if (start && now < start) {
    key = "upcoming";
  } else if (end && now >= new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1)) {
    // La saison reste « en cours » pendant toute la journée de fin.
    key = "done";
  } else if (start || end) {
    key = "active";
  } else {
    key = Number(season?.percentage) > 0 ? "active" : "upcoming";
  }
  return { key, label: SEASON_STATUS_LABELS[key], cssClass: SEASON_STATUS_CLASSES[key] };
}
