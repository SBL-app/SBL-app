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
