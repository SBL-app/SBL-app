import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";

const get = vi.fn();
const post = vi.fn();
vi.mock("ky", () => ({ default: { create: () => ({ get, post }) } }));

import { useRegistrationStore } from "../src/stores/registration.js";

describe("useRegistrationStore – inscription à une saison", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("fetchCaptainTeams ne garde que les équipes où l'utilisateur est capitaine", async () => {
    get.mockReturnValue({
      json: async () => [
        { team: { id: 1, name: "A" }, role: "captain" },
        { team: { id: 2, name: "B" }, role: "member" },
      ],
    });
    const teams = await useRegistrationStore().fetchCaptainTeams();
    expect(get).toHaveBeenCalledWith("users/me/teams");
    expect(teams).toEqual([{ id: 1, name: "A" }]);
  });

  it("registerTeamToSeason poste team_id sur /seasons/:id/register", async () => {
    post.mockReturnValue({ json: async () => ({ id: 9, status: "pending" }) });
    const res = await useRegistrationStore().registerTeamToSeason(3, 1);
    expect(post).toHaveBeenCalledWith("seasons/3/register", { json: { team_id: 1 } });
    expect(res.status).toBe("pending");
  });

  it("propage l'erreur API (ex. 409 doublon)", async () => {
    const err = { response: { status: 409 } };
    post.mockReturnValue({ json: async () => { throw err; } });
    await expect(useRegistrationStore().registerTeamToSeason(3, 1)).rejects.toBe(err);
  });
});
