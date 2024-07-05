<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
    <div class="event-container">
        <p class="title">Prochain évènements</p>
        <router-link to="/event/3" class="event">
            <p class="name">Saison 3</p>
            <p class="teams">13 équipes</p>
            <div class="dates">
                <p class="startDate">01/01</p>
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
                <p class="endDate">20/01</p>
            </div>
            <p class="state">étape : inscription</p>
        </router-link>
    </div>
</template>
<style scoped>
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

.event {
    display: flex;
    padding: 12px 24px;
    align-items: center;
    gap: 32px;
    border-radius: 8px;
    background: var(--embed-color-1, #5C47E0);
}

.event-container {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 34px;
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
</style>