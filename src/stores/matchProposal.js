import { ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth";

/**
 * Propositions de date de match (planifier / accepter / refuser).
 * Toutes les requêtes passent par l'instance ky authentifiée.
 */
export const useMatchProposalStore = defineStore("matchProposals", () => {
  const received = ref([]);
  const sent = ref([]);

  /** Propositions en attente reçues et envoyées par l'utilisateur connecté. */
  const fetchPending = async () => {
    const auth = useAuthStore();
    const data = await auth.api
      .get("match-proposals", {
        searchParams: { discord_id: auth.user.discord_id, status: "pending" },
      })
      .json();
    received.value = data.received ?? [];
    sent.value = data.sent ?? [];
  };

  /** Matchs (non joués) des équipes dont l'utilisateur est capitaine. */
  const fetchCaptainGames = async () => {
    const auth = useAuthStore();
    const memberships = await auth.api.get("users/me/teams").json();
    const teams = memberships.filter((m) => m.role === "captain").map((m) => m.team);
    const lists = await Promise.all(
      teams.map((t) => auth.api.get("games", { searchParams: { team_id: t.id } }).json())
    );
    const seen = new Map();
    for (const g of lists.flat()) {
      if (g.score1 == null && g.score2 == null) seen.set(g.id, g);
    }
    return [...seen.values()];
  };

  /** Propose une date pour un match. */
  const propose = async (gameId, proposedDate, counterToId = null) => {
    const auth = useAuthStore();
    return await auth.api
      .post("match-proposals", {
        json: {
          game_id: gameId,
          proposer_discord_id: auth.user.discord_id,
          proposed_date: proposedDate,
          counter_to_id: counterToId,
        },
      })
      .json();
  };

  const respond = async (id, status) => {
    const auth = useAuthStore();
    const res = await auth.api
      .patch(`match-proposals/${id}`, {
        json: { status, discord_id: auth.user.discord_id },
      })
      .json();
    received.value = received.value.filter((p) => p.id !== id);
    return res;
  };

  const accept = (id) => respond(id, "accepted");
  const refuse = (id) => respond(id, "rejected");

  return { received, sent, fetchPending, fetchCaptainGames, propose, accept, refuse };
});
