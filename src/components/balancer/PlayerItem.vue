<template>
    <div class="player-card" draggable="false">
        <div class="player-card__content" tabindex="0">
            <div :style="{ '--team-color': teamColor }" class="player-card__team-color">
                <TankIcon class="player-card__bg-icon" />
                <div class="player-card__rank ">
                    <img class="player-card__rank-icon" draggable="false" :src="`/img/ranks/${rankIconSrc}`"
                        alt="Rank" />
                    <span class="player-card__rank-points">
                        {{ props.rankPoints }}
                    </span>
                </div>
            </div>
            <div class="player-card__name">
                <p class="player-card__name-text ">
                    {{ props.name }}
                </p>
            </div>

            <div class="player-card__roles" role="list" :aria-label="`Roles for ${props.name}`">
                <component v-for="role in sortedRoles" :key="role.role" :is="getRoleIcon(role.role)" :class="[
                    role.isPrimary
                        ? 'player-card__role--primary'
                        : 'player-card__role--secondary'
                ]" />
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import type { GameRole, PlayerRole } from '@/types/balancer';
import { computed, defineAsyncComponent } from 'vue';
import { RANK_THRESHOLDS } from '@/constants/rank';

const TankIcon = defineAsyncComponent(() => import('@/components/icons/TankIcon.vue'));
const DpsIcon = defineAsyncComponent(() => import('@/components/icons/DpsIcon.vue'));
const SupportIcon = defineAsyncComponent(() => import('@/components/icons/SupportIcon.vue'));
const FlexIcon = defineAsyncComponent(() => import('@/components/icons/FlexIcon.vue'));


interface Props {
    name: string;
    warn?: boolean;
    roles: PlayerRole[];
    rankPoints: number
    teamColor: string;
}

const props = withDefaults(defineProps<Props>(), {
    warn: false,
});

const sortedRoles = computed(() => {
    return [...props.roles].sort((a, b) => {
        if (a.isPrimary === b.isPrimary) return 0;
        return a.isPrimary ? 1 : -1;
    });
});

const rankIconSrc = computed(() => getRankIcon(props.rankPoints));

const getRankIcon = (points: number): string => {
    const rank = RANK_THRESHOLDS.find(r => points < r.max);
    return rank?.icon ?? 'gm.png';
};

const getRoleIcon = (role: GameRole) => {
    switch (role) {
        case 'T':
            return TankIcon;
        case 'D':
            return DpsIcon;
        case 'H':
            return SupportIcon;
        default:
            return FlexIcon;
    }
};
</script>

<style scoped>
.player-card {
    background-color: var(--color-background);
    display: flex;
    align-items: center;
    user-select: none;
}

.player-card__content {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.75rem;
    position: relative;
}

.player-card__team-color {

    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.25rem;
    height: 3.6rem;
    background-color: var(--team-color, #868686);
}

.player-card__bg-icon {
    position: absolute;
    top: 0.25rem;
    opacity: 0.7;
    width: 2.3rem;
    height: 2.3rem;
}

.player-card__rank {
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.player-card__rank-icon {
    display: block;
    width: 2.3rem;
    height: 2.3rem;
}

.player-card__rank-points {
    color: #FFFFFF;
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: -0.26rem;
}

.player-card__name {
    flex: 1;
    min-width: 0px;
    overflow: hidden;
}

.player-card__name-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.25rem;
    font-weight: 600;
}

.player-card__roles {
    display: flex;
    gap: 0.25rem;
    margin-right: 0.5rem;
    align-items: end;
}

.player-card__role--primary {

    height: 1.5rem;
    width: 1.5rem;
}

.player-card__role--secondary {
    height: 1rem;
    width: 1rem;
    opacity: 0.7;
}
</style>