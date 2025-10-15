<template>
  <div>
    <div v-if="isLoading" class="flex items-center gap-2">
      <Skeleton class="h-4 w-32" />
    </div>

    <div class="flex items-center gap-2" v-else>
      <router-link to="/" class="flex text-sm flex-shrink-0 items-center gap-2">
        <Box class="size-3.5 text-muted-foreground" />
        <div class="flex items-center gap-2">
          <span class="truncate max-w-32">
            {{ selectedStatus?.label }}
          </span>
        </div>
      </router-link>

      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <Button variant="ghost" size="sm" class="!px-1.5">
            <ChevronsUpDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search workspace..." />
            <CommandList>
              <CommandEmpty>{{ $t('error.notFound') }}</CommandEmpty>
              <CommandGroup>
                <CommandItem v-for="status in statuses" :key="status.value" :value="status.value" @select="
                  () => {
                    selectedStatus = status
                    open = false
                  }
                " class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground truncate">
                    {{ status.label }}
                  </span>
                  <Check v-show="selectedStatus?.value === status.value" class="size-4 text-primary" />
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem value="" asChild>
                  <Link to="/workspace" class="text-sm text-muted-foreground" @click="open = false">
                  All workspaces
                  </Link>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem value="new-workspace" asChild>
                  <Link to="/workspace/new" class="flex items-center gap-2 text-sm text-muted-foreground"
                    @click="open = false">
                  <PlusIcon />
                  New workspace
                  </Link>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Box, Check, ChevronsUpDown, PlusIcon } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '../ui/button'
import { Link } from '@/components/ui/link'

import {
  CommandEmpty,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command'
import { Skeleton } from '@/components/ui/skeleton'

interface Status {
  value: string
  label: string
}

const statuses: Status[] = [
  {
    value: 'backlog',
    label: 'asdasdsadadssdasdssdasdasdsadasdasasdasdasdasdasdasdadsadsadsasdadsadsads',
  },
  { value: 'todo', label: 'Todo' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' },
]

const isLoading = ref(true)
const open = ref(false)
const selectedStatus = ref<Status>(statuses[2])

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})
</script>
