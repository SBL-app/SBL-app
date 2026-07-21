import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatPercent,
  truncate,
  parseApiDate,
  sortSeasonsByRecent,
} from "../src/utils/format.js";

describe("formatDate", () => {
  it("formate une date ISO en français", () => {
    expect(formatDate("2022-03-21")).toBe("21 mars 2022");
  });

  it("accepte un objet Date", () => {
    expect(formatDate(new Date("2022-05-02"))).toBe("2 mai 2022");
  });

  it("retourne une chaîne vide pour une entrée vide ou invalide", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
    expect(formatDate("pas-une-date")).toBe("");
  });
});

describe("formatPercent", () => {
  it("arrondit et ajoute l'unité", () => {
    expect(formatPercent(42.5)).toBe("43 %");
    expect(formatPercent("10")).toBe("10 %");
  });

  it("borne entre 0 et 100", () => {
    expect(formatPercent(150)).toBe("100 %");
    expect(formatPercent(-5)).toBe("0 %");
  });

  it("gère les valeurs non numériques", () => {
    expect(formatPercent("abc")).toBe("0 %");
    expect(formatPercent(null)).toBe("0 %");
  });
});

describe("truncate", () => {
  it("laisse le texte court intact", () => {
    expect(truncate("court", 10)).toBe("court");
  });

  it("tronque et ajoute une ellipse", () => {
    expect(truncate("abcdefghij", 5)).toBe("abcd…");
  });

  it("gère null/undefined", () => {
    expect(truncate(null)).toBe("");
    expect(truncate(undefined)).toBe("");
  });
});

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
