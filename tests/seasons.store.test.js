import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";

// Mock de ky : chaque appel .get() renvoie une réponse dont .json() est contrôlé.
vi.mock("ky", () => {
  const get = vi.fn();
  return { default: { get } };
});

import ky from "ky";
import { useSeasonStore } from "../src/stores/seasons.js";

function mockJson(data) {
  return { json: async () => data };
}

describe("useSeasonStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("fetchAllSeasons remplit la liste des saisons", async () => {
    const seasons = [
      { id: 1, name: "Saison I" },
      { id: 2, name: "Saison II" },
    ];
    ky.get.mockResolvedValueOnce(mockJson(seasons));

    const store = useSeasonStore();
    await store.fetchAllSeasons();

    expect(ky.get).toHaveBeenCalledOnce();
    expect(store.seasons).toEqual(seasons);
  });

  it("fetchSeason remplit la saison courante", async () => {
    const season = { id: 3, name: "Saison III" };
    ky.get.mockResolvedValueOnce(mockJson(season));

    const store = useSeasonStore();
    await store.fetchSeason(3);

    expect(store.season).toEqual(season);
    expect(ky.get).toHaveBeenCalledWith(expect.stringContaining("/seasons/3"));
  });

  it("fetchSeasonPercentage interroge l'endpoint de progression", async () => {
    ky.get.mockResolvedValueOnce(mockJson({ id: 1, percent: 42 }));

    const store = useSeasonStore();
    await store.fetchSeasonPercentage(1);

    expect(ky.get).toHaveBeenCalledWith(expect.stringContaining("/seasons/1/completion"));
    expect(store.season).toEqual({ id: 1, percent: 42 });
  });

  it("fetchTeamsBySeason interroge l'endpoint des équipes", async () => {
    ky.get.mockResolvedValueOnce(mockJson({ id: 2, teams: [] }));

    const store = useSeasonStore();
    await store.fetchTeamsBySeason(2);

    expect(ky.get).toHaveBeenCalledWith(expect.stringContaining("/seasons/2/teams"));
  });
});
