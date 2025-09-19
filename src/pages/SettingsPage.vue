<template>
    <div class="w-full mx-auto max-w-[1200px] p-4 md:p-8">
        <div class="flex  justify-between  mb-6">
            <h1 class="text-2xl  font-bold">Workspace Settings</h1>
        </div>

        <div class="space-y-6">
            <div class=" px-6 py-4  grid grid-cols-12 gap-6 bg-card  border rounded  ">
                <h3 class="col-span-12 lg:col-span-5  font-semibold ">General Settings</h3>
                <div class="col-span-12 lg:col-span-7 space-y-4">
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
                            <span class="text-sm text-muted-foreground ">Show extended lobby information</span>
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
                </div>
            </div>

            <h2 class="col-span-12 lg:col-span-5  text-2xl font-bold mb-4">Role Distribution</h2>
            <div class=" px-6 py-4  grid grid-cols-12 gap-6 bg-card  border rounded  ">
                <h3 class="col-span-12 lg:col-span-5  font-semibold ">Roles amount</h3>
                <div class="col-span-12 lg:col-span-7 space-y-4">
                    <NumberField :min="0" :max="10" v-model="settings.state.roleAmount.tank"
                        @update:model-value="(value) => settings.updateSettings('roleAmount', { ...settings.state.roleAmount, tank: Number(value) })">
                        <Label>Tank amount</Label>
                        <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput />
                            <NumberFieldIncrement />
                        </NumberFieldContent>
                    </NumberField>
                    <NumberField :min="0" :max="10" v-model="settings.state.roleAmount.dps"
                        @update:model-value="(value) => settings.updateSettings('roleAmount', { ...settings.state.roleAmount, dps: Number(value) })">
                        <Label>DPS amount</Label>
                        <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput />
                            <NumberFieldIncrement />
                        </NumberFieldContent>
                    </NumberField>
                    <NumberField :min="0" :max="10" v-model="settings.state.roleAmount.heal"
                        @update:model-value="(value) => settings.updateSettings('roleAmount', { ...settings.state.roleAmount, heal: Number(value) })">
                        <Label>Heal amount</Label>
                        <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput />
                            <NumberFieldIncrement />
                        </NumberFieldContent>
                    </NumberField>
                </div>
            </div>
            <SettingsReset />

        </div>
    </div>
</template>


<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore.store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'
import SettingsReset from '@/components/settings/SettingsReset.vue'
const settings = useSettingsStore()



</script>
