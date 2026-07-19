/**
 * Utilitaires de formatage (fonctions pures, testables).
 */

/**
 * Formate une date ISO en date lisible en français (ex: "21 mars 2022").
 * Renvoie une chaîne vide si l'entrée est invalide.
 *
 * @param {string|Date|null|undefined} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Formate un pourcentage borné entre 0 et 100 (ex: 42.5 -> "42 %").
 *
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export function formatPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0 %";
  const clamped = Math.min(100, Math.max(0, Math.round(n)));
  return `${clamped} %`;
}

/**
 * Tronque un texte à une longueur maximale en ajoutant une ellipse.
 *
 * @param {string|null|undefined} text
 * @param {number} [maxLength=80]
 * @returns {string}
 */
export function truncate(text, maxLength = 80) {
  const str = String(text ?? "");
  if (str.length <= maxLength) return str;
  return `${str.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}
