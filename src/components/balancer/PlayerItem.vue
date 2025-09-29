<template>
    <div class="player-card" draggable="false">
        <div class="player-card__content" tabindex="0">
            <div :style="{ '--team-color': teamColor }" class="player-card__team-color">
                <component :is="bgIconComponent" class="player-card__bg-icon" />
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
import { useSettingsStore } from '@/stores/settingsStore.store';

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
    slotIndex: number;
}

const props = withDefaults(defineProps<Props>(), {
    warn: false,
});

const sortedRoles = computed(() =>
    [...props.roles].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
);
const settings = useSettingsStore();

const bgRole = computed(() => {
    const { tank, dps } = settings.state.roleAmount;
    if (props.slotIndex < tank) return 'T';
    if (props.slotIndex < tank + dps) return 'D';
    return 'H';
});
const bgIconComponent = computed(() => getRoleIcon(bgRole.value));

const rankIconSrc = computed(() =>
    RANK_THRESHOLDS.find(r => props.rankPoints < r.max)?.icon ?? 'gm.png'
);

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
    opacity: 0.7;

    top: 0.25rem;
    width: 2.3em;
    height: 2.3em;
}

.player-card__rank {
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
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

    height: 1.5em;
    width: 1.5em;
}

.player-card__role--secondary {
    height: 1em;
    width: 1em;
    opacity: 0.7;

}
</style>