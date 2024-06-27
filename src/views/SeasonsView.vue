<script setup>
</script>
<template>
    <div class="division-focus">
        <p class="title">Saison 2 :</p>
        <div class="event">
            <p class="event-title">Saison 2</p>
            <p class="team-number">13 équipes</p>
            <div class="dates">
                <p class="start-date">01/01</p>
                <div class="arrow_forward">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <mask id="mask0_100_853" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0"
                            width="16" height="16">
                            <rect width="16" height="16" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_100_853)">
                            <path
                                d="M10.7832 8.66675H2.6665V7.33342H10.7832L7.04984 3.60008L7.99984 2.66675L13.3332 8.00008L7.99984 13.3334L7.04984 12.4001L10.7832 8.66675Z"
                                fill="white" />
                        </g>
                    </svg>
                </div>
                <p class="end-date">20/01</p>
            </div>
            <p class="state">étape : terminé</p>
        </div>
        <div class="divisions-container">
            <p class="title">Divisions :</p>
            <div class="divisions">
                <div class="division">
                    <p class="division-title">Division 1</p>
                    <div class="titles">
                        <p class="rank">P</p>
                        <p class="team-names">équipes</p>
                        <p class="victory">V</p>
                        <p class="ties">N</p>
                        <p class="defeat">D</p>
                        <p class="diff">+/-</p>
                        <p class="points">Pts</p>
                    </div>
                    <div class="team-item">
                        <p class="rank">1</p>
                        <p class="team-names">Oro Jackson</p>
                        <p class="victory">3</p>
                        <p class="ties">0</p>
                        <p class="defeat">0</p>
                        <p class="diff">3</p>
                        <p class="points">9</p>
                    </div>
                    <div class="team-item">
                        <p class="rank">2</p>
                        <p class="team-names">UBER BAGARRE !!</p>
                        <p class="victory">2</p>
                        <p class="ties">0</p>
                        <p class="defeat">1</p>
                        <p class="diff">-1</p>
                        <p class="points">6</p>
                    </div>
                    <div class="team-item">
                        <p class="rank">3</p>
                        <p class="team-names">Booyah Gang</p>
                        <p class="victory">1</p>
                        <p class="ties">0</p>
                        <p class="defeat">2</p>
                        <p class="diff">-2</p>
                        <p class="points">3</p>
                    </div>
                    <div class="team-item">
                        <p class="rank">4</p>
                        <p class="team-names">Hazard</p>
                        <p class="victory">0</p>
                        <p class="ties">0</p>
                        <p class="defeat">3</p>
                        <p class="diff">0</p>
                        <p class="points">0</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.rank,
.victory,
.ties,
.defeat {
    width: 20px;
}

.diff,
.points {
    width: 25px;
}

.team-names {
    width: 280px;
}

.titles,
.team-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.division {
    display: flex;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    background: var(--embed-color-1, #5C47E0);
}

.divisions,
.divisions-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 27px;
}

.dates {
    display: flex;
    align-items: center;
    gap: 8px;
}

.arrow_forward {
    width: 16px;
    height: 16px;
}

.event {
    display: flex;
    padding: 12px 24px;
    align-items: center;
    gap: 32px;
    border-radius: 8px;
    background: var(--embed-color-1, #5C47E0);
}

.division-focus {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 27px;
    background: var(--embed-color-2, #190D3F);
}

p {
    color: #FFF;
    text-align: center;
    font-family: Lexend;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.title {
    text-decoration-line: underline;
}
</style>