import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

const get = vi.fn();
const post = vi.fn();
vi.mock("ky", () => ({ default: { create: () => ({ get, post }) } }));

import AdminDashboardView from "../src/views/AdminDashboardView.vue";
import { useAuthStore } from "../src/stores/auth.js";

const full = {
  pending_results: { total: 1, by_division: [] },
  contested_results: { total: 1, by_division: [] },
  reported_games: { total: 1, by_division: [] },
  pending_registrations: { total: 1, by_season: [] },
  division_progress: [{ division_id: 1, division_name: "Division 1", played: 2, total: 4 }],
  items: {
    pending_results: [{ id: 5, division_name: "Division 1", team1: { name: "Alpha" }, team2: { name: "Beta" } }],
    contested_results: [{ id: 8, game_id: 6, division_name: "Division 1", team: { name: "Alpha" }, score1: 2, score2: 1, contest_reason: "faux" }],
    reported_games: [{ id: 9, division_name: "Division 1", team1: { name: "Gamma" }, team2: { name: "Delta" } }],
    pending_registrations: [{ id: 3, season_name: "Saison 1", team: { name: "Echo" } }],
  },
};
const empty = {
  pending_results: { total: 0, by_division: [] },
  contested_results: { total: 0, by_division: [] },
  reported_games: { total: 0, by_division: [] },
  pending_registrations: { total: 0, by_season: [] },
  division_progress: [],
  items: { pending_results: [], contested_results: [], reported_games: [], pending_registrations: [] },
};

function setup(data, roles = ["ROLE_ADMIN"]) {
  const pinia = createPinia();
  setActivePinia(pinia);
  useAuthStore().user = { id: 1, roles };
  get.mockReturnValue({ json: async () => data });
  post.mockReturnValue({ json: async () => ({}) });
  return mount(AdminDashboardView, { global: { plugins: [pinia] } });
}

describe("AdminDashboardView", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche l'état de chargement puis les 4 alertes et l'avancement", async () => {
    const w = setup(full);
    await w.vm.$nextTick();
    expect(w.text()).toContain("Chargement");
    await flushPromises();
    for (const label of ["Matchs en attente de résultat", "Résultats contestés", "Matchs à reprogrammer", "Inscriptions en attente"]) {
      expect(w.text()).toContain(label);
    }
    expect(w.text()).toContain("Alpha");
    expect(w.text()).toContain("Division 1");
    expect(w.text()).toContain("2 / 4");
  });

  it("affiche des états vides", async () => {
    const w = setup(empty);
    await flushPromises();
    expect(w.findAll('[data-test="empty"]').length).toBe(5);
  });

  it("affiche une erreur si l'API échoue", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    useAuthStore().user = { id: 1, roles: ["ROLE_ADMIN"] };
    get.mockReturnValue({ json: async () => { throw new Error("x"); } });
    const w = mount(AdminDashboardView, { global: { plugins: [pinia] } });
    await flushPromises();
    expect(w.find('[role="alert"]').exists()).toBe(true);
  });

  it("montre les boutons d'action aux admins et déclenche l'action", async () => {
    const w = setup(full);
    await flushPromises();
    expect(w.findAll('[data-test="action"]').length).toBeGreaterThan(0);
    await w.find('[data-action="remind-5"]').trigger("click");
    expect(post).toHaveBeenCalledWith("admin/games/5/remind");
    await w.find('[data-action="validate-6"]').trigger("click");
    expect(post).toHaveBeenCalledWith("admin/games/6/validate-result");
    await w.find('[data-action="close-1"]').trigger("click");
    expect(post).toHaveBeenCalledWith("admin/divisions/1/close");
  });

  it("masque les boutons d'action pour un non-admin", async () => {
    const w = setup(full, ["ROLE_USER"]);
    await flushPromises();
    expect(w.findAll('[data-test="action"]').length).toBe(0);
    expect(w.text()).toContain("Alpha");
  });
});
