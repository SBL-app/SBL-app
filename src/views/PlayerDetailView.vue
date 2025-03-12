<script setup>
import { useRoute } from "vue-router";
import { onBeforeMount } from "vue";
import { usePlayerStore } from "@/stores/player";
import { storeToRefs } from "pinia";

const route = useRoute();
const playerStore = usePlayerStore();

const { fetchPlayer } = playerStore;
const { player } = storeToRefs(playerStore);

onBeforeMount(() => {
  const playerId = route.params.id;
  fetchPlayer(playerId);
  console.log("player detail view");
});
</script>
<template>
  <div class="player-detail">
    <div class="player-container">
      <div class="player">
        <p class="player-name">{{ player.name }}</p>
        <router-link
          :to="{ name: 'team', params: { id: player.team_id } }"
          class="team"
          >{{ player.team_name }}</router-link
        >
        <p>discord : {{ player.discord }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
p {
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration: none;
}
.player-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
}
.player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 80%;
}
.player {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background: var(--background, #190d3f);
}
</style>
