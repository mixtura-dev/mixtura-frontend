import type { ValidatedSettings } from '@/schemas/settingsSchema'

export const mapSettingsToApiFormat = (settingsData: ValidatedSettings) => ({
  auto_custom: settingsData.customAuthchoise,
  auto_increment: settingsData.autoIncrement,
  extended_lobby: settingsData.extendedLobby,
  expanded_result: settingsData.extendedResult,
  amount: {
    tank: settingsData.roleAmount.tank,
    damage: settingsData.roleAmount.dps,
    support: settingsData.roleAmount.heal,
  },
  team: {
    first: {
      name: settingsData.teams.teamA.name,
      color: settingsData.teams.teamA.color,
    },
    second: {
      name: settingsData.teams.teamB.name,
      color: settingsData.teams.teamB.color,
    },
  },
  math: {
    balance_limit: settingsData.math.balanceLimit,
    alpha: settingsData.math.linearFairness,
    beta: settingsData.math.linearRolesCoefficient,
    gamma: settingsData.math.offRolesPenalty,
    p: settingsData.math.fairnessPowerApproximation,
    q: settingsData.math.uniformityPowerApproximation,
    tank_weight: settingsData.math.tankMultiplier,
    damage_weight: settingsData.math.dpsMultiplier,
    support_weight: settingsData.math.healMultiplier,
  },
})
