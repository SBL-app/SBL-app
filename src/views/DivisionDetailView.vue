<script setup>
import { useRoute, RouterLink } from "vue-router";
import { useDivisionStore } from "@/stores/division";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const route = useRoute();
const divisionStore = useDivisionStore();
const { fetchDivisionDetails } = divisionStore;

// Variables réactives pour stocker les données
const divisionData = ref(null);
const ranking = ref([]);
const teams = ref([]);
const games = ref([]);

onBeforeMount(async () => {
  const divisionId = route.params.id;
  try {
    const data = await fetchDivisionDetails(divisionId);
    divisionData.value = data.division;
    ranking.value = data.ranking;
    teams.value = data.teams;
    games.value = data.games;
  } catch (error) {
    console.error('Erreur lors du chargement des détails de la division:', error);
  }
});
</script>
<template>
  <div class="division-focus" v-if="divisionData">
    <div class="division-container">
      <div class="season-division">
        <router-link
          :to="{ name: 'season', params: { id: divisionData.season_id } }"
          class="season"
          >{{ divisionData.season_name }}</router-link
        >
        <p>/</p>
        <p class="division">{{ divisionData.name }}</p>
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
          v-for="teamRanking in ranking"
          :key="teamRanking.team_id"
        >
          <p class="rank">{{ teamRanking.position }}</p>
          <p class="name">{{ teamRanking.team_name }}</p>
          <p class="victory">{{ teamRanking.stats.wins }}</p>
          <p class="ties">{{ teamRanking.stats.ties }}</p>
          <p class="defeat">{{ teamRanking.stats.losses }}</p>
          <p class="forfeit">0</p>
          <p class="v-round">{{ teamRanking.stats.winRounds }}</p>
          <p class="l-round">{{ teamRanking.stats.looseRounds }}</p>
          <p class="difference">
            {{ teamRanking.stats.winRounds - teamRanking.stats.looseRounds }}
          </p>
          <p class="points">{{ teamRanking.stats.points }}</p>
        </div>
      </div>
    </div>
    <div class="planning" v-if="games.length > 0">
      <p class="title">Planning</p>
      <div class="week" v-for="week in games" :key="week.week">
        <p class="week-name">Semaine {{ week.week }}</p>
        <div class="match" v-for="game in week.games" :key="game.id">
          <div class="match-info">
            <p class="match-date">{{ game.date }}</p>
            <div class="match-teams">
              <p class="team-name">{{ game.team1 }}</p>
              <div class="match-score">
                <p class="score">{{ game.score1 }}</p>
                <p class="vs">VS</p>
                <p class="score">{{ game.score2 }}</p>
              </div>
              <p class="team-name">{{ game.team2 }}</p>
            </div>
            <p class="match-status" :class="game.status">{{ game.status }}</p>
          </div>
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
          <p class="captain" v-if="team.captain">Capitaine: {{ team.captain }}</p>
          <div class="member-container">
            <p class="members-title">membres</p>
            <div
              class="members"
              v-for="member in team.members"
              :key="member.id"
            >
              <p class="member">{{ member.name }}</p>
              <p class="discord" v-if="member.discord">{{ member.discord }}</p>
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
.captain {
  font-size: 18px;
  color: #ffd700;
  font-weight: bold;
}
.discord {
  font-size: 14px;
  color: #99aab5;
  font-style: italic;
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
.match-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  width: 100%;
}
.match-date {
  font-size: 16px;
  color: #cccccc;
  margin: 0;
}
.match-teams {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  justify-content: center;
}
.match-score {
  display: flex;
  align-items: center;
  gap: 10px;
}
.match-status {
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
  text-transform: uppercase;
}
.match-status.joué {
  background-color: #4CAF50;
  color: white;
}
.match-status.prévu {
  background-color: #FF9800;
  color: white;
}
.match-status.annulé {
  background-color: #f44336;
  color: white;
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
