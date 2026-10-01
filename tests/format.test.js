import { describe, it, expect } from "vitest";
import { formatDate, getEventStatus, getSeasonStatus, parseApiDate, sortSeasonsByRecent } from "../src/utils/format.js";

describe("parseApiDate", () => {
  it("analyse le format JJ-MM-AAAA renvoyé par l'API", () => {
    const date = parseApiDate("10-02-2026");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(1); // février
    expect(date.getDate()).toBe(10);
  });

  it("ne confond pas le jour et le mois", () => {
    // 02-10-2026 doit être le 2 octobre, pas le 10 février.
    const date = parseApiDate("02-10-2026");
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(2);
  });

  it("accepte encore une date ISO", () => {
    expect(parseApiDate("2022-03-21").getFullYear()).toBe(2022);
  });

  it("retourne null pour une entrée vide ou invalide", () => {
    expect(parseApiDate(null)).toBeNull();
    expect(parseApiDate("")).toBeNull();
    expect(parseApiDate("pas-une-date")).toBeNull();
  });
});

describe("sortSeasonsByRecent", () => {
  const seasons = [
    { id: 1, start_date: "01-09-2022" },
    { id: 3, start_date: "01-09-2023" },
    { id: 2, start_date: "15-01-2023" },
  ];

  it("trie de la plus récente à la plus ancienne", () => {
    expect(sortSeasonsByRecent(seasons).map((s) => s.id)).toEqual([3, 2, 1]);
  });

  it("ne mute pas le tableau d'origine", () => {
    const copy = [...seasons];
    sortSeasonsByRecent(seasons);
    expect(seasons).toEqual(copy);
  });

  it("retombe sur l'identifiant quand les dates manquent", () => {
    const sansDates = [{ id: 1 }, { id: 3 }, { id: 2 }];
    expect(sortSeasonsByRecent(sansDates).map((s) => s.id)).toEqual([3, 2, 1]);
  });

  it("gère une entrée absente", () => {
    expect(sortSeasonsByRecent(null)).toEqual([]);
    expect(sortSeasonsByRecent(undefined)).toEqual([]);
  });
});

describe("getSeasonStatus", () => {
  // 1er octobre 2026, 15 h.
  const now = new Date(2026, 9, 1, 15);
  const season = (start_date, end_date, percentage = 0) => ({ start_date, end_date, percentage });

  it("indique « à venir » avant la date de début", () => {
    expect(getSeasonStatus(season("10-10-2026", "20-12-2026"), now)).toEqual({
      key: "upcoming",
      label: "à venir",
      cssClass: "scheduled",
    });
  });

  it("indique « en cours » entre les dates, jour de fin inclus", () => {
    expect(getSeasonStatus(season("01-09-2026", "20-12-2026", 40), now).key).toBe("active");
    expect(getSeasonStatus(season("01-09-2026", "01-10-2026", 40), now).key).toBe("active");
  });

  it("indique « terminée » après la date de fin", () => {
    expect(getSeasonStatus(season("01-06-2026", "30-09-2026", 80), now)).toEqual({
      key: "done",
      label: "terminée",
      cssClass: "done",
    });
  });

  it("indique « terminée » quand tous les matchs sont joués, même en chaîne", () => {
    // L'API renvoie le pourcentage formaté en chaîne (« 100.00 »).
    expect(getSeasonStatus(season("01-09-2026", "20-12-2026", "100.00"), now).key).toBe("done");
  });

  it("retombe sur le pourcentage sans dates exploitables", () => {
    expect(getSeasonStatus({ percentage: "0.00" }, now).key).toBe("upcoming");
    expect(getSeasonStatus({ percentage: "30.00" }, now).key).toBe("active");
    expect(getSeasonStatus(null, now).key).toBe("upcoming");
  });
});

describe("getEventStatus", () => {
  const now = new Date(2026, 9, 1, 15);

  it("reprend le statut de la saison avec un libellé au masculin", () => {
    expect(getEventStatus({ start_date: "01-06-2026", end_date: "30-09-2026" }, now)).toEqual({
      key: "done",
      label: "terminé",
      cssClass: "done",
    });
    expect(getEventStatus({ start_date: "10-10-2026", end_date: "20-12-2026" }, now).label).toBe("à venir");
  });
});

describe("formatDate", () => {
  it("formate le format JJ-MM-AAAA de l'API sans inverser jour et mois", () => {
    expect(formatDate("07-11-2022")).toBe(
      new Date(2022, 10, 7).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
    );
  });

  it("accepte le format Doctrine AAAA-MM-JJ HH:MM:SS", () => {
    expect(formatDate("2025-10-13 20:30:00")).toBe(
      new Date(2025, 9, 13).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
    );
  });

  it("renvoie une chaîne vide plutôt que « Invalid Date »", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate("pas une date")).toBe("");
  });
});
