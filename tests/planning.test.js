import { describe, it, expect } from "vitest";
import { filterWeeks } from "../src/utils/planning.js";

const g = (id, date, status) => ({ id, date, status });
const weeks = [
  { week: 1, games: [g(1, "01-03-2026", "joué"), g(2, "02-03-2026", "prévu")] },
  { week: 2, games: [g(3, "09-03-2026", "joué")] },
  { week: 3, games: [g(4, "20-03-2026", "prévu"), g(5, "15-03-2026", "prévu")] },
];

describe("filterWeeks", () => {
  it("« all » ne change rien", () => {
    expect(filterWeeks(weeks, "all")).toBe(weeks);
  });
  it("« played » garde les joués et retire les semaines vides", () => {
    const r = filterWeeks(weeks, "played");
    expect(r.map((w) => w.week)).toEqual([1, 2]);
    expect(r.flatMap((w) => w.games.map((x) => x.id))).toEqual([1, 3]);
  });
  it("« upcoming » ne garde que les non joués, triés par date", () => {
    const ids = filterWeeks(weeks, "upcoming").flatMap((w) => w.games.map((x) => x.id));
    expect(ids).toEqual([2, 5, 4]);
  });
  it("« upcoming » est limité à 10", () => {
    const many = [{ week: 1, games: Array.from({ length: 15 }, (_, i) => g(i, `${String(i + 1).padStart(2, "0")}-04-2026`, "prévu")) }];
    const ids = filterWeeks(many, "upcoming").flatMap((w) => w.games.map((x) => x.id));
    expect(ids).toHaveLength(10);
    expect(ids[0]).toBe(0);
  });
  it("entrée invalide → liste vide", () => {
    expect(filterWeeks(null, "upcoming")).toEqual([]);
  });
});
