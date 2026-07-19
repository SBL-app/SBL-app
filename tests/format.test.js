import { describe, it, expect } from "vitest";
import { formatDate, formatPercent, truncate } from "../src/utils/format.js";

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
