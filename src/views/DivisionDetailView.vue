<script setup></script>
<template>
  <div class="division-focus">
    <div class="division-container">
      <div class="season-division">
        <p class="season">Saison 2</p>
        <p>/</p>
        <p class="division">Division 1</p>
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
        <div class="team">
          <p class="rank">1</p>
          <p class="name">team 1</p>
          <p class="victory">3</p>
          <p class="ties">0</p>
          <p class="defeat">0</p>
          <p class="forfeit">0</p>
          <p class="v-round">12</p>
          <p class="l-round">0</p>
          <p class="difference">12</p>
          <p class="points">9</p>
        </div>
      </div>
    </div>
    <div class="planning">
        <p class="title">Planning</p>
        <div class="week">
            <p class="week-name">Semaine 1</p>
            <div class="match">
                <p class="team-name">team 1</p>
                <p class="score">4</p>
                <p class="vs">VS</p>
                <p class="score">0</p>
                <p class="team-name">team 2</p>
            </div>
            <div class="match">
                <p class="team-name">team 1</p>
                <p class="score">4</p>
                <p class="vs">VS</p>
                <p class="score">0</p>
                <p class="team-name">team 2</p>
            </div>
        </div>
        <div class="week">
            <p class="week-name">Semaine 1</p>
            <div class="match">
                <p class="team-name">team 1</p>
                <p class="score">4</p>
                <p class="vs">VS</p>
                <p class="score">0</p>
                <p class="team-name">team 2</p>
            </div>
        </div>
    </div>
    <div class="team-container">
        <p class="title">équipes</p>
        <div class="teams">
            <div class="team-item">
                <p class="team-title">team 1</p>
                <div class="member-container">
                    <p class="members-title">membres</p>
                    <div class="membres">
                        <p class="member">member 1</p>
                        <p class="member">member 2</p>
                        <p class="member">member 3</p>
                        <p class="member">member 4</p>
                    </div>
                </div>
            </div>
            <div class="team-item">
                <p class="team-title">team 1</p>
                <div class="member-container">
                    <p class="members-title">membres</p>
                    <div class="membres">
                        <p class="member">member 1</p>
                        <p class="member">member 2</p>
                        <p class="member">member 3</p>
                        <p class="member">member 4</p>
                    </div>
                </div>
            </div>
            <div class="team-item">
                <p class="team-title">team 1</p>
                <div class="member-container">
                    <p class="members-title">membres</p>
                    <div class="membres">
                        <p class="member">member 1</p>
                        <p class="member">member 2</p>
                        <p class="member">member 3</p>
                        <p class="member">member 4</p>
                    </div>
                </div>
            </div>
            <div class="team-item">
                <p class="team-title">team 1</p>
                <div class="member-container">
                    <p class="members-title">membres</p>
                    <div class="membres">
                        <p class="member">member 1</p>
                        <p class="member">member 2</p>
                        <p class="member">member 3</p>
                        <p class="member">member 4</p>
                    </div>
                </div>
            </div>
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
gap: 20px;
align-self: stretch;
}
.team-item {
    display: flex;
padding: 38px 31px;
flex-direction: column;
align-items: center;
gap: 25px;
border-radius: 20px;
background: var(--embed-color-2, #190D3F);
}
.teams {
    display: flex;
justify-content: center;
align-items: center;
align-content: center;
gap: 84px;
align-self: stretch;
flex-wrap: wrap;
}
.team-name {
    width: 200px;
}
.match {display: flex;
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
background: var(--embed-color-2, #190D3F);
}
.division-datas {
  display: flex;
  padding: 19px 25px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
  background: var(--embed-color-1, #5c47e0);
}
.titles p, .team p{
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
p {
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.titles, .team {
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
  padding: 20px 50px;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  border-radius: 20px;
  background: var(--embed-color-1, #5c47e0);
}
</style>
