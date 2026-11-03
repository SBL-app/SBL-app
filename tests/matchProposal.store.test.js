import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";

const get = vi.fn();
const post = vi.fn();
const patch = vi.fn();
vi.mock("ky", () => ({ default: { create: () => ({ get, post, patch }) } }));

import { useMatchProposalStore } from "../src/stores/matchProposal.js";
import { useAuthStore } from "../src/stores/auth.js";

describe("useMatchProposalStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    useAuthStore().user = { id: 1, discord_id: "42" };
    useAuthStore().token = "t";
  });

  it("fetchPending charge reçues et envoyées", async () => {
    get.mockReturnValue({ json: async () => ({ received: [{ id: 1 }], sent: [{ id: 2 }] }) });
    const s = useMatchProposalStore();
    await s.fetchPending();
    expect(get).toHaveBeenCalledWith("match-proposals", {
      searchParams: { discord_id: "42", status: "pending" },
    });
    expect(s.received).toEqual([{ id: 1 }]);
    expect(s.sent).toEqual([{ id: 2 }]);
  });

  it("fetchCaptainGames ne garde que les matchs non joués des équipes capitaines, dédupliqués", async () => {
    get.mockImplementation((url) => ({
      json: async () =>
        url === "users/me/teams"
          ? [
              { team: { id: 1 }, role: "captain" },
              { team: { id: 2 }, role: "member" },
            ]
          : [
              { id: 10, score1: null, score2: null },
              { id: 11, score1: 3, score2: 1 },
              { id: 10, score1: null, score2: null },
            ],
    }));
    const games = await useMatchProposalStore().fetchCaptainGames();
    expect(games.map((g) => g.id)).toEqual([10]);
  });

  it("propose poste la proposition", async () => {
    post.mockReturnValue({ json: async () => ({ proposal: { id: 5 } }) });
    await useMatchProposalStore().propose(3, "2026-12-01T20:00");
    expect(post).toHaveBeenCalledWith("match-proposals", {
      json: {
        game_id: 3,
        proposer_discord_id: "42",
        proposed_date: "2026-12-01T20:00",
        counter_to_id: null,
      },
    });
  });

  it("accept / refuse patchent le statut et retirent la proposition reçue", async () => {
    patch.mockReturnValue({ json: async () => ({}) });
    const s = useMatchProposalStore();
    s.received = [{ id: 1 }, { id: 2 }];
    await s.accept(1);
    expect(patch).toHaveBeenCalledWith("match-proposals/1", {
      json: { status: "accepted", discord_id: "42" },
    });
    await s.refuse(2);
    expect(patch).toHaveBeenLastCalledWith("match-proposals/2", {
      json: { status: "rejected", discord_id: "42" },
    });
    expect(s.received).toEqual([]);
  });

  it("propage l'erreur API", async () => {
    const err = { response: { status: 403 } };
    post.mockReturnValue({ json: async () => { throw err; } });
    await expect(useMatchProposalStore().propose(3, "x")).rejects.toBe(err);
  });
});
