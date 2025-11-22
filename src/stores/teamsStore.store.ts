import { defineStore } from 'pinia'

export const useTeamsStore = defineStore('teams', () => {
  const move = () => {}
  const swap = () => {}
  const clear = () => {}
  const isTeamFull = () => {}

  return {
    move,
    swap,
    clear,
    isTeamFull,
  }
})
