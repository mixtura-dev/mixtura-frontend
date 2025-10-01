<template>
    <div class="flex flex-row min-h-full">
        <div class="max-w-[1200px] w-full ml-auto p-4">
            <div ref="screenshotRef"
                class="grid bg-background w-full h-fit grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5">
                <div class="team-container flex flex-col gap-2 p-4 border-2 border-dashed rounded-lg min-w-3xs">
                    <h2 class="text-xl font-semibold md:text-right">
                        {{ settings.state.teams.teamA.name }}
                    </h2>
                    <draggable v-model="teamAPlayers" group="teams" :swap="true" item-key="id">
                        <template #item="{ element, index }">
                            <PlayerItem :name="element.name" :roles="element.roles" :rankPoints="element.rankPoints"
                                :teamColor="settings.state.teams.teamA.color" :slotIndex="index" />
                        </template>
                    </draggable>
                </div>

                <span class="italic font-black text-2xl self-center justify-self-center">VS</span>

                <div class="team-container flex flex-col gap-2 p-4 border-2 border-dashed rounded-lg min-w-3xs">
                    <h2 class="text-xl font-semibold">
                        {{ settings.state.teams.teamB.name }}
                    </h2>
                    <draggable v-model="teamBPlayers" group="teams" item-key="id">
                        <template #item="{ element, index }">
                            <PlayerItem :name="element.name" :roles="element.roles" :rankPoints="element.rankPoints"
                                :teamColor="settings.state.teams.teamB.color" :slotIndex="index" />
                        </template>
                    </draggable>
                </div>
            </div>

            <Sheet>
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent class="w-full">
                    <SheetHeader>
                        <SheetTitle>Match History</SheetTitle>

                    </SheetHeader>
                    <div class="p-4 pt-0 flex flex-col gap-4 overflow-y-scroll">
                        <WorkspaceCardBase class="border p-4 rounded bg-accent " v-for="i in 100" :key="i">
                            Match {{ i }}
                        </WorkspaceCardBase>
                    </div>
                </SheetContent>
            </Sheet>
            <div class="flex gap-3 flex-row py-4">
                <Button variant="secondary">
                    Balance teams
                </Button>
                <Button @click="makeScreenshot" size="icon" variant="outline">
                    <ClipboardIcon />
                </Button>
                <Button @click="currentLocale === 'en' ? currentLocale = 'ru' : currentLocale = 'en'"
                    variant="secondary">
                    Change language
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSettingsStore } from '@/stores/settingsStore.store';
import { Button } from '@/components/ui/button';
import { ClipboardIcon } from 'lucide-vue-next';
import { useLanguage } from '@/composables/useLanguage';
import PlayerItem from '@/components/balancer/PlayerItem.vue';
import type { PlayerRole, GameRole } from '@/types/balancer';
import draggable from 'vuedraggable'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import WorkspaceCardBase from '@/components/workspace/WorkspaceCardBase.vue';
const { currentLocale } = useLanguage();

const screenshotRef = ref<HTMLElement | null>(null);


const makeScreenshot = async () => {
    if (!screenshotRef.value) return;
    try {
        const { toBlob } = await import('html-to-image');
        const blob = await toBlob(screenshotRef.value, { quality: 0.9 });

        if (!blob) {
            console.error("Не удалось создать скриншот (blob пустой)");
            return;
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('ru-RU').replace(/\./g, '-');
        const timeStr = now.toLocaleTimeString('ru-RU', {
            hour12: false,
            timeStyle: "short"
        }).replace(/:/g, '-');
        const filename = `teams-${dateStr}-(${timeStr}).png`;

        const link = document.createElement('a');
        link.download = filename;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    } catch (err) {
        console.error('Ошибка при создании скриншота:', err);
    }
};

const settings = useSettingsStore();

// Тестовые данные для игроков (массивы для команд)
interface Player {
    id: number;
    name: string;
    roles: PlayerRole[];
    rankPoints: number;
}

const teamAPlayers = ref<Player[]>([
    {
        id: 1,
        name: 'PlayerOne',
        roles: [{ role: 'T' as GameRole, isPrimary: true }],
        rankPoints: 3200,
    },
    {
        id: 2,
        name: 'PlayerTwo',
        roles: [{ role: 'D' as GameRole, isPrimary: true }, { role: 'H' as GameRole, isPrimary: false }],
        rankPoints: 3100,
    },
    {
        id: 3,
        name: 'PlayerThree',
        roles: [{ role: 'H' as GameRole, isPrimary: true }],
        rankPoints: 3300,
    },
    {
        id: 4,
        name: 'PlayerFour',
        roles: [{ role: 'D' as GameRole, isPrimary: true }],
        rankPoints: 3000,
    },
    {
        id: 5,
        name: 'PlayerFive',
        roles: [{ role: 'T' as GameRole, isPrimary: true }, { role: 'D' as GameRole, isPrimary: false }],
        rankPoints: 3200,
    },
]);

const teamBPlayers = ref<Player[]>([
    {
        id: 6,
        name: 'PlayerSix',
        roles: [{ role: 'T' as GameRole, isPrimary: true }, { role: 'D' as GameRole, isPrimary: false }],
        rankPoints: 3200,
    },
]);
</script>