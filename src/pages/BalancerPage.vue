<template>
    <div class="p-4 flex flex-col w-full h-full ">
        <Bracket :stage :matches :rounds :participants />
        <div class="grid w-full max-w-sm gap-6">
            <InputGroup>
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
            </InputGroup>
            <InputGroup>
                <InputGroupInput placeholder="example.com" />
                <InputGroupAddon>
                    <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>

            </InputGroup>


            <InputGroup>
                <InputGroupTextarea placeholder="Ask, Search or Chat..." />
                <InputGroupAddon align="block-end">
                    <InputGroupButton variant="outline" class="rounded-full" size='icon-xs'>
                        <Plus />
                    </InputGroupButton>
                    <DropdownMenu>
                        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <InputGroupText className="ml-auto">52% used</InputGroupText>
                    <Separator orientation="vertical" className="!h-4" />
                    <InputGroupButton variant="default" className="rounded-full" size="icon-xs" disabled>
                        <ArrowUpIcon />
                        <span className="sr-only">Send</span>
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
            <InputGroup>
                <InputGroupInput placeholder="@shadcn" />
                <InputGroupAddon align="inline-end">
                    <div
                        className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full">
                        <Check className="size-3" />
                    </div>
                </InputGroupAddon>
            </InputGroup>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Bracket from '@/components/bracket/Bracket.vue';
import { Status, type Match, type Participant, type Round, type Stage } from '@/types/tournament/tournament';
const stage: Stage = {
    id: 1,
    tournamentId: 1,
    name: 'Main Stage',
    type: 'single_elim',
    number: 1,
}
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
    InputGroupInput,
    InputGroupTextarea
} from '@/components/ui/input-group'

import { ArrowUpIcon, Check, Plus, Search } from 'lucide-vue-next';
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import DropdownMenuLabel from '@/components/ui/dropdown-menu/DropdownMenuLabel.vue';
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue';
const rounds: Round[] = [
    { id: 1, stageId: 1, groupId: 1, number: 1 }, // Round of 16
    { id: 2, stageId: 1, groupId: 1, number: 2 }, // Quarterfinals
    { id: 3, stageId: 1, groupId: 1, number: 3 }, // Semifinals
    { id: 4, stageId: 1, groupId: 1, number: 4 }, // Final
]

const participants: Participant[] = [
    { id: 1, tournamentId: 1, name: 'Игрок A' },
    { id: 2, tournamentId: 1, name: 'Игрок B' },
    { id: 3, tournamentId: 1, name: 'Игрок C' },
    { id: 4, tournamentId: 1, name: 'Игрок D' },
    { id: 5, tournamentId: 1, name: 'Игрок E' },
    { id: 6, tournamentId: 1, name: 'Игрок F' },
    { id: 7, tournamentId: 1, name: 'Игрок G' },
    { id: 8, tournamentId: 1, name: 'Игрок H' },
    { id: 9, tournamentId: 1, name: 'Игрок I' },
    { id: 10, tournamentId: 1, name: 'Игрок J' },
    { id: 11, tournamentId: 1, name: 'Игрок K' },
    { id: 12, tournamentId: 1, name: 'Игрок L' },
    { id: 13, tournamentId: 1, name: 'Игрок M' },
    { id: 14, tournamentId: 1, name: 'Игрок N' },
    { id: 15, tournamentId: 1, name: 'Игрок O' },
    { id: 16, tournamentId: 1, name: 'Игрок P' },
]

const matches: Match[] = [
    // Round of 16 (Round 1)
    {
        id: 1,
        stageId: 1,
        groupId: 1,
        roundId: 1,
        number: 1,
        childCount: 0,
        status: Status.Completed,
        opponent1: { id: 1, position: 1, score: 2, result: 'win' },
        opponent2: { id: 2, position: 2, score: 1, result: 'loss' },
    },
    {
        id: 2,
        stageId: 1,
        groupId: 1,
        roundId: 1,
        number: 2,
        childCount: 0,
        status: Status.Completed,
        opponent1: { id: 3, position: 3, score: 2, result: 'win' },
        opponent2: { id: 4, position: 4, score: 0, result: 'loss' },
    },
    {
        id: 3,
        stageId: 1,
        groupId: 1,
        roundId: 1,
        number: 3,
        childCount: 0,
        status: Status.Completed,
        opponent1: { id: 5, position: 5, score: 3, result: 'win' },
        opponent2: { id: 6, position: 6, score: 0, result: 'loss' },
    },
    {
        id: 4,
        stageId: 1,
        groupId: 1,
        roundId: 1,
        number: 4,
        childCount: 0,
        status: Status.Completed,
        opponent1: { id: 7, position: 7, score: 2, result: 'win' },
        opponent2: { id: 8, position: 8, score: 1, result: 'loss' },
    },
    {
        id: 5,
        stageId: 1,
        groupId: 1,
        roundId: 1,
        number: 5,
        childCount: 0,
        status: Status.Completed,
        opponent1: { id: 9, position: 9, score: 2, result: 'win' },
        opponent2: { id: 10, position: 10, score: 1, result: 'loss' },
    },
    {
        id: 6,
        stageId: 1,
        groupId: 1,
        roundId: 1,
        number: 6,
        childCount: 0,
        status: Status.Completed,
        opponent1: { id: 11, position: 11, score: 2, result: 'win' },
        opponent2: { id: 12, position: 12, score: 0, result: 'loss' },
    },
    {
        id: 7,
        stageId: 1,
        groupId: 1,
        roundId: 1,
        number: 7,
        childCount: 0,
        status: Status.Completed,
        opponent1: { id: 13, position: 13, score: 3, result: 'win' },
        opponent2: { id: 14, position: 14, score: 1, result: 'loss' },
    },
    {
        id: 8,
        stageId: 1,
        groupId: 1,
        roundId: 1,
        number: 8,
        childCount: 0,
        status: Status.Completed,
        opponent1: { id: 15, position: 15, score: 2, result: 'win' },
        opponent2: { id: 16, position: 16, score: 1, result: 'loss' },
    },
    // Quarterfinals (Round 2)
    {
        id: 9,
        stageId: 1,
        groupId: 1,
        roundId: 2,
        number: 1,
        childCount: 0,
        status: Status.Ready,
        opponent1: { id: 1, position: 1, score: undefined, result: undefined }, // Победитель матча 1
        opponent2: { id: 3, position: 3, score: undefined, result: undefined }, // Победитель матча 2
    },
    {
        id: 10,
        stageId: 1,
        groupId: 1,
        roundId: 2,
        number: 2,
        childCount: 0,
        status: Status.Ready,
        opponent1: { id: 5, position: 5, score: undefined, result: undefined }, // Победитель матча 3
        opponent2: { id: 7, position: 7, score: undefined, result: undefined }, // Победитель матча 4
    },
    {
        id: 11,
        stageId: 1,
        groupId: 1,
        roundId: 2,
        number: 3,
        childCount: 0,
        status: Status.Ready,
        opponent1: { id: 9, position: 9, score: undefined, result: undefined }, // Победитель матча 5
        opponent2: { id: 11, position: 11, score: undefined, result: undefined }, // Победитель матча 6
    },
    {
        id: 12,
        stageId: 1,
        groupId: 1,
        roundId: 2,
        number: 4,
        childCount: 0,
        status: Status.Ready,
        opponent1: { id: 13, position: 13, score: undefined, result: undefined }, // Победитель матча 7
        opponent2: { id: 15, position: 15, score: undefined, result: undefined }, // Победитель матча 8
    },
    // Semifinals (Round 3)
    {
        id: 13,
        stageId: 1,
        groupId: 1,
        roundId: 3,
        number: 1,
        childCount: 0,
        status: Status.Ready,
        opponent1: { id: 1, position: 1, score: undefined, result: undefined }, // Победитель матча 9
        opponent2: { id: 5, position: 5, score: undefined, result: undefined }, // Победитель матча 10
    },
    {
        id: 14,
        stageId: 1,
        groupId: 1,
        roundId: 3,
        number: 2,
        childCount: 0,
        status: Status.Ready,
        opponent1: { id: 9, position: 9, score: undefined, result: undefined }, // Победитель матча 11
        opponent2: { id: 13, position: 13, score: undefined, result: undefined }, // Победитель матча 12
    },
    // Final (Round 4)
    {
        id: 15,
        stageId: 1,
        groupId: 1,
        roundId: 4,
        number: 1,
        childCount: 0,
        status: Status.Ready,
        opponent1: { id: 1, position: 1, score: undefined, result: undefined }, // Победитель матча 13
        opponent2: { id: 9, position: 9, score: undefined, result: undefined }, // Победитель матча 14
    },
]
</script>