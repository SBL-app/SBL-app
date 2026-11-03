import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("ky", () => ({ default: { get: vi.fn() } }));
vi.mock("../src/stores/auth.js", () => ({ useAuthStore: () => ({ api }) }));
vi.mock("@/stores/auth", () => ({ useAuthStore: () => ({ api }) }));

import { useTeamStore } from "../src/stores/team.js";

const json = (data) => ({ json: async () => data });

describe("useTeamStore — membres", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("fetchMyTeams appelle users/me/teams", async () => {
    api.get.mockReturnValue(json([{ team: { id: 1 }, role: "captain" }]));
    const res = await useTeamStore().fetchMyTeams();
    expect(api.get).toHaveBeenCalledWith("users/me/teams");
    expect(res[0].role).toBe("captain");
  });

  it("fetchMembers et addMember", async () => {
    api.get.mockReturnValue(json({ members: [] }));
    api.post.mockReturnValue(json({ role: "member" }));
    const s = useTeamStore();
    await s.fetchMembers(3);
    expect(api.get).toHaveBeenCalledWith("teams/3/members");
    await s.addMember(3, "42");
    expect(api.post).toHaveBeenCalledWith("teams/3/members", { json: { discord_id: "42" } });
  });

  it("removeMember cible un membre, leaveTeam non", async () => {
    api.delete.mockResolvedValue({});
    const s = useTeamStore();
    await s.removeMember(3, "42");
    expect(api.delete).toHaveBeenLastCalledWith("teams/3/members", { json: { discord_id: "42" } });
    await s.leaveTeam(3);
    expect(api.delete).toHaveBeenLastCalledWith("teams/3/members", { json: {} });
  });

  it("changeRole envoie le nouveau rôle", async () => {
    api.patch.mockReturnValue(json({ role: "captain" }));
    await useTeamStore().changeRole(3, "42", "captain");
    expect(api.patch).toHaveBeenCalledWith("teams/3/members/role", {
      json: { discord_id: "42", role: "captain" },
    });
  });
});
