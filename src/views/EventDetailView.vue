<script setup></script>
<template>
  <div class="event-focus">
    <p class="title">Saison X :</p>
    <div class="registered-teams">
      <p class="registered-title">équipes inscrites :</p>
      <div class="teams">
        <p class="team-name">team 1</p>
        <p class="team-name">team 2</p>
        <p class="team-name">team 3</p>
        <p class="team-name">team 4</p>
        <p class="team-name">team 5</p>
        <p class="team-name">team 6</p>
        <p class="team-name">team 7</p>
        <p class="team-name">team 8</p>
        <p class="team-name">team 9</p>
        <p class="team-name">team 10</p>
      </div>
    </div>
    <div class="register-button">
      <p>S'inscrire</p>
    </div>
  </div>
</template>
<style scoped>
.register-button {
  display: flex;
  width: 268px;
  height: 42px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 20px;
  background: var(--embed-color-1, #5c47e0);
}
.teams p {
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.team-name {
  width: 100px;
}
.teams {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 15px;
  align-self: stretch;
  flex-wrap: wrap;
}
.registered-teams {
  display: flex;
  padding: 20px 33px;
  max-width: 300px;
  flex-direction: column;
  align-items: center;
  gap: 37px;
  border-radius: 20px;
  background: var(--embed-color-1, #5c47e0);
}
.event-focus {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 46px;
}
</style>
