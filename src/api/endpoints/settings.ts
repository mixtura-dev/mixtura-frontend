import type { ValidatedSettings } from '@/schemas/settingsSchema'
import { baseApi } from '../axios'
import { mapSettingsToApiFormat } from '@/lib/utils/mappers'

export const getDefaultSettings = () => {}
export const getProfileSettings = () => {}
export const setProfileSettings = async (settingsData: ValidatedSettings) => {
  const { data } = await baseApi.post('/settings', mapSettingsToApiFormat(settingsData))
  return data
}
