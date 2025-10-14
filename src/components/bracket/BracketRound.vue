<template>
  <article class="round">
    <header class="round-title">
      <h2>{{ roundTitle }}</h2>
    </header>
    <BracketMatch
      v-for="match in matches"
      :key="match.id"
      :match="match"
      :participants="participants"
      :isOdd="match.number % 2 !== 0"
      :connectedNext="hasNextConnection(match)"
      :connectedPrev="hasPrevConnection()"
    />
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import BracketMatch from './BracketMatch.vue'
import type { GroupType, Match, Participant, Round } from '@/types/tournament/tournament'
import { getBracketConnection } from '@/lib/utils/bracketConnections'

const props = defineProps<{
  round: Round
  matches: Match[]
  participants: Participant[]
  totalRounds: number
  groupType?: GroupType
}>()

const roundTitle = computed(() => {
  return `Round ${props.round.number}`
})

const hasNextConnection = (match: Match) => {
  const connection = getBracketConnection(
    true,
    props.round.number,
    props.totalRounds,
    match,
    props.groupType,
  )
  return connection.connectNext
}

const hasPrevConnection = () => {
  const connection = getBracketConnection(
    true,
    props.round.number,
    props.totalRounds,
    props.matches[0],
  )
  console.log(connection)
  return !!connection.connectPrevious
}
</script>

<style lang="scss" scoped>
.round-title {
  display: flex;
  justify-content: center;
  padding: 6px 12px;
  margin: 0 0 20px 0;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--color-muted-foreground);
  border-radius: var(--radius);
  font-weight: 500;
  text-transform: capitalize;
}

.round {
  display: flex;
  flex-direction: column;

  &:not(:last-of-type) {
    margin-right: var(--round-margin);
  }
}
</style>
