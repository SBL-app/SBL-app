<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <div class="event-focus">
    <div class="event-container">
      <p class="title">Prochains évènements :</p>
      <router-link to="/event/2" class="event-item">
        <p id="season-title">Saison 2</p>
        <p id="team-number">10 équipes</p>
        <div class="dates">
          <p id="start-date">01/01</p>
          <div class="arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="41"
              height="8"
              viewBox="0 0 41 8"
              fill="none"
            >
              <path
                d="M40.5278 4.35355C40.7231 4.15829 40.7231 3.84171 40.5278 3.64645L37.3459 0.464466C37.1506 0.269204 36.834 0.269204 36.6387 0.464466C36.4435 0.659728 36.4435 0.976311 36.6387 1.17157L39.4672 4L36.6387 6.82843C36.4435 7.02369 36.4435 7.34027 36.6387 7.53553C36.834 7.7308 37.1506 7.7308 37.3459 7.53553L40.5278 4.35355ZM0.174278 4.5L40.1743 4.5L40.1743 3.5L0.174278 3.5L0.174278 4.5Z"
                fill="white"
              />
            </svg>
          </div>
          <p id="end-date">20/01</p>
        </div>
        <div class="inscription-status">
          <p id="inscription-title">inscription :</p>
          <p id="inscription-status">terminé</p>
        </div>
      </router-link>
      <router-link to="/event/3" class="event-item">
        <p id="season-title">Saison 3</p>
        <p id="team-number">13 équipes</p>
        <div class="dates">
          <p id="start-date">01/01</p>
          <div class="arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="41"
              height="8"
              viewBox="0 0 41 8"
              fill="none"
            >
              <path
                d="M40.5278 4.35355C40.7231 4.15829 40.7231 3.84171 40.5278 3.64645L37.3459 0.464466C37.1506 0.269204 36.834 0.269204 36.6387 0.464466C36.4435 0.659728 36.4435 0.976311 36.6387 1.17157L39.4672 4L36.6387 6.82843C36.4435 7.02369 36.4435 7.34027 36.6387 7.53553C36.834 7.7308 37.1506 7.7308 37.3459 7.53553L40.5278 4.35355ZM0.174278 4.5L40.1743 4.5L40.1743 3.5L0.174278 3.5L0.174278 4.5Z"
                fill="white"
              />
            </svg>
          </div>
          <p id="end-date">20/01</p>
        </div>
        <div class="inscription-status">
          <p id="inscription-title">inscription :</p>
          <p id="inscription-status">en cours</p>
        </div>
      </router-link>
    </div>
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
  gap: 5px;
}
.event-item {
  display: flex;
  height: 94px;
  justify-content: space-evenly;
  align-items: center;
  gap: 30px;
  align-self: stretch;
  border-radius: 20px;
  background: var(--embed-color-1, #5c47e0);
  padding: 10px;
}
.event-focus {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  background: var(--background, #190d3f);
}
.event-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}
.title {
  display: flex;
  height: 35px;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  text-decoration: underline;
}
p {
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
</style>
