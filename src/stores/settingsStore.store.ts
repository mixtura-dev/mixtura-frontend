import { SettingsSchema, type ValidatedSettings } from '@/schemas/settingsSchema'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { z } from 'zod'

const DEFAULT_SETTINGS: ValidatedSettings = {
  customAuthchoise: false,
  extendedLobby: true,
  extendedResult: true,
  autoIncrement: false,
  roleAmount: {
    tank: 2,
    dps: 2,
    heal: 2,
  },
  teams: {
    teamA: {
      name: 'Team A',
      color: '#1e90ff',
    },
    teamB: {
      name: 'Team B',
      color: '#ff6347',
    },
  },
  math: {
    balanceLimit: 10_000,
    linearFairness: 3,
    linearRolesCoefficient: 2,
    offRolesPenalty: 80,
    tankMultiplier: 1.1,
    dpsMultiplier: 1,
    healMultiplier: 0.9,
    fairnessPowerApproximation: 2,
    uniformityPowerApproximation: 2,
  },
}

export const useSettingsStore = defineStore('settings', () => {
  const state = ref<ValidatedSettings>(structuredClone(DEFAULT_SETTINGS))

  const updateSettings = <K extends keyof ValidatedSettings>(
    key: K,
    value: ValidatedSettings[K],
  ) => {
    const partialSchema = z.object({ [key]: SettingsSchema.shape[key] })
    const validationResult = partialSchema.safeParse({ [key]: value })
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join('; ')
      throw new Error(`Validation failed for ${key}: ${errors}`)
    }
    state.value[key] = value
  }

  const resetSettings = () => {
    state.value = structuredClone(DEFAULT_SETTINGS)
  }
  return {
    state,
    updateSettings,
    resetSettings,
  }
})
