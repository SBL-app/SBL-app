import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";

const get = vi.fn();
const post = vi.fn();
vi.mock("ky", () => ({ default: { create: () => ({ get, post }) } }));

import { useAdminDashboardStore } from "../src/stores/adminDashboard.js";
import { useAuthStore } from "../src/stores/auth.js";

const payload = {
  pending_results: { total: 1, by_division: [] },
  contested_results: { total: 0, by_division: [] },
  reported_games: { total: 0, by_division: [] },
  pending_registrations: { total: 0, by_season: [] },
  division_progress: [{ division_id: 1, division_name: "D1", played: 2, total: 4 }],
  items: { pending_results: [{ id: 5 }], pending_registrations: [], contested_results: [], reported_games: [] },
};

describe("useAdminDashboardStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    get.mockReturnValue({ json: async () => payload });
    post.mockReturnValue({ json: async () => ({}) });
  });

  it("fetchDashboard charge admin/dashboard et gère loading", async () => {
    const store = useAdminDashboardStore();
    const p = store.fetchDashboard();
    expect(store.loading).toBe(true);
    await p;
    expect(get).toHaveBeenCalledWith("admin/dashboard");
    expect(store.data).toEqual(payload);
    expect(store.loading).toBe(false);
    expect(store.error).toBe("");
  });

  it("fetchDashboard expose une erreur si l'API échoue", async () => {
    get.mockReturnValue({ json: async () => { throw new Error("boom"); } });
    const store = useAdminDashboardStore();
    await store.fetchDashboard();
    expect(store.data).toBeNull();
    expect(store.error).not.toBe("");
    expect(store.loading).toBe(false);
  });

  it.each([
    ["validateResult", 7, "admin/games/7/validate-result"],
    ["remind", 7, "admin/games/7/remind"],
    ["closeDivision", 3, "admin/divisions/3/close"],
  ])("%s poste sur la bonne route puis recharge", async (action, id, url) => {
    const store = useAdminDashboardStore();
    await store[action](id);
    expect(post).toHaveBeenCalledWith(url);
    expect(get).toHaveBeenCalledWith("admin/dashboard");
  });

  it("une action en échec renvoie l'erreur sans recharger", async () => {
    post.mockReturnValue({ json: async () => { throw new Error("403"); } });
    const store = useAdminDashboardStore();
    await expect(store.remind(1)).rejects.toThrow("403");
    expect(get).not.toHaveBeenCalled();
  });

  it("isAdmin dans le store auth vient de user.roles", () => {
    const auth = useAuthStore();
    expect(auth.isAdmin).toBe(false);
    auth.user = { id: 1, roles: ["ROLE_USER", "ROLE_ADMIN"] };
    expect(auth.isAdmin).toBe(true);
    auth.user = { id: 1, roles: ["ROLE_USER"] };
    expect(auth.isAdmin).toBe(false);
  });
});
