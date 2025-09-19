<template>
    <div :class="['match', connectionClass]">

        <div class="opponents">
            <BracketPlayer :participant="match.opponent1" :participant-data="getParticipantData(match.opponent1)" />
            <BracketPlayer :participant="match.opponent2" :participant-data="getParticipantData(match.opponent2)" />
            <!-- <div class="status" v-if="groupType">
                {{ groupType === 'winner_bracket' ? 'W.B.' : 'L.B.' }} {{ match.number }}
            </div> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import BracketPlayer from './BracketPlayer.vue'
import type { Match, Participant, ParticipantResult } from '@/types/tournament/tournament';

const props = defineProps<{
    match: Match
    participants: Participant[]
    isOdd?: boolean
    connectedNext?: 'straight' | 'square' | false
    connectedPrev?: boolean
}>()

const connectionClass = computed(() => ({
    'connected-prev': props.connectedPrev,
    'connected-next': props.connectedNext === 'square',
    'connected-next-straight': props.connectedNext === 'straight'
}))

const getParticipantData = (participantResult: ParticipantResult | null) => {
    if (!participantResult?.id) {
        console.warn('ParticipantResult has null id:', participantResult)
        return null
    }
    const participant = props.participants.find((p) => p.id === participantResult.id)
    if (!participant) {
        console.warn(`Cant find id ${participantResult.id} in participants`)
    }
    return participant || null
}



</script>

<style lang="scss" scoped>
.opponents {
    position: relative;
    width: 100%;
    border-radius: 0.3rem;
    background: var(--card);
    outline: 1px solid var(--border);

}

.match {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    justify-content: center;
    width: var(--match-width);
    margin: var(--match-margin) 0;
}

.connected-prev::before {
    content: "";
    position: absolute;
    width: calc(var(--round-margin) / 2);
    left: calc(-1 * var(--round-margin) / 2);
    border-top: 2px solid var(--color-border);
}

.status {
    position: absolute;
    left: 6px;
    top: -13px;
    font-size: 0.7rem;
    padding: 0 0.625rem;
    border-radius: 3px;
    background: var(--card);
}

.connected-next {
    &::after {
        content: "";
        position: absolute;
        right: calc(-1 * var(--round-margin) / 2);
        width: calc(var(--round-margin) / 2);
        height: 50%;
    }

    &:nth-of-type(even)::after {
        top: 0;
        border-radius: 0 0 8px 0;
        border-bottom: 2px solid var(--color-border);
        border-right: 2px solid var(--color-border);
    }

    &:nth-of-type(odd)::after {
        top: 50%;
        border-radius: 0 8px 0 0;
        border-top: 2px solid var(--color-border);
        border-right: 2px solid var(--color-border);
    }
}

.connected-next-straight::after {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: calc(-1 * var(--round-margin));
    width: var(--round-margin);
    border-top: 2px solid var(--color-border);
}
</style>