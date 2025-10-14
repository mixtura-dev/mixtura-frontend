<template>
  <div
    class="participant"
    :title="displayName"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :class="{ hover: isHovered, highlight: isHighlighted }"
  >
    <div class="name">
      <span class="font-mono">{{ displayPosition }}</span>
      {{ displayName }}
    </div>
    <div class="result font-mono" :class="{ winner: participant?.result === 'win' }">
      {{ participant?.score ?? '-' }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Id, Participant, ParticipantResult } from '@/types/tournament/tournament'
import { ref, inject, computed, type Ref } from 'vue'
import { HoveredParticipantIdKey, SetHoveredParticipantKey } from './injection-keys'

const props = defineProps<{
  participant: ParticipantResult | null
  participantData: Participant | null
}>()

const displayName = computed(() => {
  if (!props.participant || !props.participant.id) return 'BYE'
  return props.participantData?.name || 'TBD'
})
const displayPosition = computed(() => {
  return props.participant?.position ? `#${props.participant.position}` : '-'
})

const isHovered = ref(false)
const hoveredParticipantId = inject<Ref<Id | null>>(HoveredParticipantIdKey, ref(null))
const setHoveredParticipant = inject<(participantId: Id | null) => void>(
  SetHoveredParticipantKey,
  () => {},
)

const isHighlighted = computed(() => {
  return props.participant?.id && props.participant.id === hoveredParticipantId.value
})

const handleMouseEnter = () => {
  isHovered.value = true
  if (props.participant?.id) {
    setHoveredParticipant(props.participant.id)
  }
}

const handleMouseLeave = () => {
  isHovered.value = false
  setHoveredParticipant(null)
}
</script>

<style lang="scss" scoped>
.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 2px;

  span {
    margin-right: 5px;
    font-size: 0.7rem;
    color: var(--color-muted-foreground);
  }
}

.result {
  font-size: 0.7rem;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--muted);

  &.winner {
    background: var(--primary);
    color: var(--primary-foreground);
  }
}

.participant {
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 0 0 0 5px;
  overflow: hidden;
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &.hover {
    background: var(--accent);
  }

  &.highlight {
    background: var(--accent, rgba(255, 215, 0, 0.2));
  }

  &:nth-of-type(1) {
    border-bottom: none;
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
    border-bottom: 1px solid var(--color-background);
  }

  &:nth-of-type(2) {
    border-bottom: none;
    border-bottom-left-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
  }
}
</style>
