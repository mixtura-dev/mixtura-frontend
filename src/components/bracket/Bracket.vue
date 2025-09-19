<template>
    <section class="bracket">
        <h1 class="bracket__title">{{ stage.name }}</h1>
        <div class="bracket-container">
            <div class="rounds winner-bracket">
                <BracketRound v-for="round in rounds" :key="round.id" :round="round"
                    :matches="getMatchesForRound(round.id)" :participants="participants" :totalRounds="rounds.length"
                    groupType="winner_bracket" />
            </div>

        </div>
    </section>
</template>

<script lang="ts" setup>
import type { GroupType, Id, Match, Participant, Round, Stage } from '@/types/tournament/tournament'
import { onMounted, provide, ref } from 'vue'
import BracketRound from './BracketRound.vue';
import { HoveredParticipantIdKey, SetHoveredParticipantKey } from './injection-keys';

const props = defineProps<{
    stage: Stage
    rounds: Round[]
    matches: Match[]
    participants: Participant[]
}>()


const hoveredParticipantId = ref<Id | null>(null)

const setHoveredParticipant = (participantId: Id | null) => {
    hoveredParticipantId.value = participantId
}

provide(HoveredParticipantIdKey, hoveredParticipantId)
provide(SetHoveredParticipantKey, setHoveredParticipant)



const getMatchesForRound = (roundId: Id, bracket: GroupType = 'winner_bracket') => {
    const matches = bracket === 'winner_bracket' ? props.matches : []
    return matches.filter((match) => match.roundId === roundId)
}

</script>

<style lang="scss">
:root {
    --round-margin: 4.5rem;
    --match-width: 12rem;
    --match-margin: 1rem;
}

.rounds {
    display: flex;
}

.bracket {
    padding: 20px;

    &__title {
        text-align: center;
        margin-bottom: 20px;
        font-weight: 600;
    }
}

.bracket-container {
    display: flex;
    flex-direction: column;
    gap: 4rem;
}
</style>