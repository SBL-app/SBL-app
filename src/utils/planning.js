import { parseApiDate } from "./format.js";

export const UPCOMING_LIMIT = 10;
const PLAYED = "joué";
const SCHEDULED = "prévu";

/**
 * Filtre le planning (liste de semaines { week, games }) selon le mode choisi.
 * - "all"      : tout, inchangé
 * - "played"   : matchs joués
 * - "upcoming" : matchs prévus (non joués), triés par date, limités à 10,
 *                renvoyés dans une seule semaine "à plat" par date
 * Les semaines vides sont retirées.
 */
export function filterWeeks(weeks, mode = "all") {
  if (!Array.isArray(weeks)) return [];
  if (mode === "all") return weeks;

  if (mode === "played") {
    return weeks
      .map((w) => ({ ...w, games: w.games.filter((g) => g.status === PLAYED) }))
      .filter((w) => w.games.length > 0);
  }

  if (mode === "upcoming") {
    const time = (g) => {
      const d = parseApiDate(g.date);
      return d && !isNaN(d) ? d.getTime() : Infinity;
    };
    const upcoming = weeks
      .flatMap((w) => w.games.map((g) => ({ game: g, week: w.week })))
      .filter(({ game }) => game.status === SCHEDULED)
      .sort((a, b) => time(a.game) - time(b.game))
      .slice(0, UPCOMING_LIMIT);
    const byWeek = new Map();
    for (const { game, week } of upcoming) {
      if (!byWeek.has(week)) byWeek.set(week, []);
      byWeek.get(week).push(game);
    }
    return [...byWeek].map(([week, games]) => ({ week, games }));
  }

  return weeks;
}
