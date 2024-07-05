<script setup></script>
<template>
  <div class="presentation-container">
    <p class="title">Qui sommes-nous ?</p>
    <p class="text">
      Créer en 2022, la Splatoon Baguette League se charge d’organiser des
      ligues sur Splatoon le plus souvent possible afin de soutenir la scène
      compétitive française présente sur le jeu. Depuis sa création la SBL à
      assurer 2 saisons ainsi que différents tournois gravitant autour de ces
      saisons et prépare actuellement sa 3ème saison.
    </p>
  </div>
</template>
<style scoped>
.presentation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
}

.title {
  text-decoration-line: underline;
}

.text {
  display: flex;
  flex-wrap: wrap;
  max-width: 1000px;
  text-align: center;
}

p {
  color: #fff;
  text-align: justify;
  font-family: Lexend;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
</style>
