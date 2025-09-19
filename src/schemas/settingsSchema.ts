import { z } from 'zod'

const RoleAmountSchema = z.object({
  tank: z.number().min(0, { message: "Tank amount can't be negative" }),
  dps: z.number().min(0, { message: "DPS amount can't be negative" }),
  heal: z.number().min(0, { message: "Heal amount can't be negative" }),
})

const TeamSchema = z.object({
  name: z.string().min(1, { message: "Team name can't be empty" }),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, { message: 'Invalid hex color format (e.g., #1e90ff)' }),
})

const MathSchema = z.object({
  balanceLimit: z.number().min(1, { message: 'Balance limit must be at least 1' }),
  linearFairness: z.number().min(0, { message: 'Linear fairness must be non-negative' }),
  linearRolesCoefficient: z
    .number()
    .min(0, { message: 'Linear roles coefficient must be non-negative' }),
  offRolesPenalty: z.number().min(0, { message: 'Off-roles penalty must be non-negative' }),
  tankMultiplier: z.number().positive({ message: 'Tank multiplier must be positive' }),
  dpsMultiplier: z.number().positive({ message: 'DPS multiplier must be positive' }),
  healMultiplier: z.number().positive({ message: 'Heal multiplier must be positive' }),
  fairnessPowerApproximation: z.number().min(1, { message: 'Fairness power must be at least 1' }),
  uniformityPowerApproximation: z
    .number()
    .min(1, { message: 'Uniformity power must be at least 1' }),
})

export const SettingsSchema = z.object({
  customAuthchoise: z.boolean(),
  extendedLobby: z.boolean(),
  extendedResult: z.boolean(),
  autoIncrement: z.boolean(),
  roleAmount: RoleAmountSchema,
  teams: z.record(z.string(), TeamSchema),
  math: MathSchema,
})

export type ValidatedSettings = z.infer<typeof SettingsSchema>
