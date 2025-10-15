<template>
  <section class="w-full mx-auto max-w-[1200px] p-4 md:p-8">
    <div class="flex justify-between mb-6">
      <h1 class="text-2xl font-bold">Workspace Settings</h1>
    </div>

    <div class="space-y-6">
      <Card class="rid grid-cols-12 gap-6">
        <h3 class="col-span-12 lg:col-span-5 font-semibold pl-4">General Settings</h3>
        <CardContent class="col-span-12 lg:col-span-7 space-y-4">
          <div class="flex flex-wrap items-center justify-between">
            <Label class="flex items-start flex-col gap-1.5">
              <span>Custom Auto Choice</span>
              <span class="text-sm text-muted-foreground">Enable</span>
            </Label>
            <Switch v-model="settings.state.customAuthchoise"
              @update:model-value="(value) => settings.updateSettings('customAuthchoise', value)" />
          </div>

          <div class="flex items-center justify-between">
            <Label class="flex items-start flex-col gap-1.5">
              <span>Extended Lobby</span>
              <span class="text-sm text-muted-foreground">Show extended lobby information</span>
            </Label>
            <Switch v-model="settings.state.extendedLobby"
              @update:model-value="(value) => settings.updateSettings('extendedLobby', value)" />
          </div>

          <div class="flex items-center justify-between">
            <Label class="flex items-start flex-col gap-1.5">
              <span>Extended Result</span>
              <span class="text-sm text-muted-foreground">Show extended result information</span>
            </Label>
            <Switch v-model="settings.state.extendedResult"
              @update:model-value="(value) => settings.updateSettings('extendedResult', value)" />
          </div>

          <div class="flex items-center justify-between">
            <Label class="flex items-start flex-col gap-1.5">
              <span>Auto Increment</span>
              <span class="text-sm text-muted-foreground">Enable automatic increment</span>
            </Label>
            <Switch v-model="settings.state.autoIncrement"
              @update:model-value="(value) => settings.updateSettings('autoIncrement', value)" />
          </div>
        </CardContent>
      </Card>
      <SettingsReset />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore.store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import SettingsReset from '@/components/settings/SettingsReset.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
const settings = useSettingsStore()
</script>
