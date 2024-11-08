<script setup>
import IncomingEvents from "../components/IncomingEvents.vue";
</script>
<template>
  <div class="event-focus">
    <IncomingEvents />
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
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
</style>
