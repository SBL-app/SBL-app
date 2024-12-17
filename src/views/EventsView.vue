<script setup>
import IncomingEvents from "../components/IncomingEvents.vue";
import { useSeasonStore } from "@/stores/seasons";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { computed } from "vue";
import { RouterLink } from "vue-router";

const seasonStore = useSeasonStore();
const { fetchAllSeasons } = seasonStore;
const { seasons } = storeToRefs(seasonStore);

const oldSeasons = computed(() => {
  return seasons.value.slice(0, -1);
});

onBeforeMount(() => {
  fetchAllSeasons();
  console.log("events view");
});
</script>
<template>
  <IncomingEvents />
  <div class="event-container" v-if="oldSeasons">
      <p class="title">anciens évènements</p>
      <RouterLink
        v-for="season in oldSeasons"
        :key="season.id"
        :to="{ name: 'season', params: { id: season.id } }"
        class="event-item"
      >
        <p class="name">
          {{ season.name }}
        </p>
        <p class="teams">{{ seasons.length }} équipes</p>
        <div class="dates">
          <p class="startDate">
            {{ season.start_date }}
          </p>
          <div class="arrow_forward">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <mask
                id="mask0_100_853"
                style="mask-type: alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="16"
                height="16"
              >
                <rect width="16" height="16" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_100_853)">
                <path
                  d="M10.7832 8.66675H2.6665V7.33342H10.7832L7.04984 3.60008L7.99984 2.66675L13.3332 8.00008L7.99984 13.3334L7.04984 12.4001L10.7832 8.66675Z"
                  fill="white"
                />
              </g>
            </svg>
          </div>
          <p class="endDate">
            {{ season.end_date }}
          </p>
        </div>
        <p class="state">terminé</p>
      </RouterLink>
    </div>
</template>
<style scoped>
.inscription-status {
  display: flex;
  align-items: center;
  gap: 5px;
}
.arrow {
  width: 40px;
  flex-shrink: 0;
  stroke-width: 1px;
  stroke: #fff;
}
.dates {
  display: flex;
  align-items: center;
  gap: 8px;
}
.event-item {
  display: flex;
  padding: 12px 24px;
  align-items: center;
  gap: 32px;
  border-radius: 8px;
  background: var(--embed-color-1, #5c47e0);
}
.event-focus {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  background: var(--background, #190d3f);
}
.event-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 34px;
}
.title {
  text-decoration: underline;
}
p {
  color: #fff;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
</style>
