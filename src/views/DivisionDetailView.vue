<script setup>
import { useRoute, RouterLink } from "vue-router";
import { useDivisionStore } from "@/stores/division";
import { useTeamStatStore } from "@/stores/teamStat";
import { useGameStore } from "@/stores/game";
import { useTeamStore } from "@/stores/team";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";

const route = useRoute();
const teamStatStore = useTeamStatStore();
const { fetchTeamStatByDivisionId } = teamStatStore;
const { teamStats } = storeToRefs(teamStatStore);

const divisionStore = useDivisionStore();
const { fetchDivision } = divisionStore;
const { division } = storeToRefs(divisionStore);

const gameStore = useGameStore();
const { fetchGamesByDivisionId } = gameStore;
const { games } = storeToRefs(gameStore);

const teamStore = useTeamStore();
const { fetchTeamsByDivision } = teamStore;
const { teams } = storeToRefs(teamStore);

onBeforeMount(() => {
  const divisionId = route.params.id;
  fetchDivision(divisionId);
  fetchTeamStatByDivisionId(divisionId);
  fetchGamesByDivisionId(divisionId);
  fetchTeamsByDivision(divisionId);
});
</script>
<template>
  <div class="division-focus">
    <div class="division-container">
      <div class="season-division">
        <router-link
          :to="{ name: 'season', params: { id: division.season_id } }"
          class="season"
          >{{ division.season_name }}</router-link
        >
        <p>/</p>
        <p class="division">{{ division.name }}</p>
      </div>
      <div class="division-datas">
        <div class="titles">
          <p class="rank">#</p>
          <p class="name">Nom</p>
          <p class="victory">V</p>
          <p class="ties">N</p>
          <p class="defeat">D</p>
          <p class="forfeit">F</p>
          <p class="v-round">MG</p>
          <p class="l-round">MP</p>
          <p class="difference">+/-</p>
          <p class="points">Pts</p>
        </div>
        <div
          class="team"
          v-for="(teamStat, index) in teamStats"
          :key="teamStat.id"
        >
          <p class="rank">{{ index + 1 }}</p>
          <p class="name">{{ teamStat.team_name }}</p>
          <p class="victory">{{ teamStat.wins }}</p>
          <p class="ties">{{ teamStat.ties }}</p>
          <p class="defeat">{{ teamStat.losses }}</p>
          <p class="forfeit">{{ teamStat.forfeits }}</p>
          <p class="v-round">{{ teamStat.nbWinRound }}</p>
          <p class="l-round">{{ teamStat.nbLooseRound }}</p>
          <p class="difference">
            {{ teamStat.nbWinRound - teamStat.nbLooseRound }}
          </p>
          <p class="points">{{ teamStat.points }}</p>
        </div>
      </div>
    </div>
    <div class="planning" v-if="games.length > 0">
      <p class="title">Planning</p>
      <div class="week" v-for="week in games" :key="week.week">
        <p class="week-name">Semaine {{ week.week }}</p>
        <div class="match" v-for="game in week.games" :key="game.id">
          <p class="team-name">{{ game.team1 }}</p>
          <p class="score">{{ game.score1 }}</p>
          <p class="vs">VS</p>
          <p class="score">{{ game.score2 }}</p>
          <p class="team-name">{{ game.team2 }}</p>
        </div>
      </div>
    </div>
    <div class="planning" v-else>
      <p class="title">Planning</p>
      <p>Aucun match prévu</p>
    </div>
    <div class="team-container">
      <p class="title">équipes</p>
      <div class="teams" v-if="teams.length > 0">
        <div class="team-item" v-for="team in teams" :key="team.id">
          <p class="team-title">{{ team.name }}</p>
          <div class="member-container">
            <p class="members-title">membres</p>
            <div
              class="members"
              v-for="member in team.members"
              :key="member.id"
            >
              <p class="member">{{ member.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="teams" v-else>
        <p>aucune équipe</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.members-title {
  text-decoration: underline;
}
.team-title {
  font-size: 30px;
}
.members {
  display: flex;
  width: 100px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 11px;
}
.member-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
}
.team-item {
  display: flex;
  padding: 30px;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  border-radius: 20px;
  background: var(--embed-color-2, #190d3f);
}
.teams {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 30px;
  align-self: stretch;
  flex-wrap: wrap;
}
.team-name {
  width: 200px;
}
.match {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
.week {
  display: flex;
  padding: 26px 66px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
  background: var(--embed-color-2, #190d3f);
}
.division-datas {
  display: flex;
  padding: 19px 25px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background: var(--embed-color-1, #5c47e0);
}
.titles p,
.team p {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.name {
  width: 200px;
}
.rank,
.victory,
.ties,
.defeat,
.forfeit,
.v-round,
.l-round,
.difference,
.points {
  width: 45px;
}
p,
router-link {
  color: #fff;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.titles,
.team {
  display: inline-flex;
  align-items: center;
  gap: 39px;
}
.season-division {
  display: flex;
  align-items: center;
  gap: 2px;
}
.division-focus {
  display: flex;
  padding-bottom: 50px;
  flex-direction: column;
  align-items: center;
  gap: 54px;
  background: var(--background, #190d3f);
}
.division-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 21px;
}
.planning {
  display: flex;
  padding: 15px 26px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
  background: var(--embed-color-1, #5c47e0);
}
.team-container {
  display: flex;
  padding: 20px 30px;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  border-radius: 20px;
  background: var(--embed-color-1, #5c47e0);
}
</style>
