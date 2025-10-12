<template>
  <div class="w-full mx-auto max-w-[1200px] my-8 px-4">
    <h1 class="text-2xl font-bold">Workspaces</h1>
    <div class="flex justify-between my-8 flex-col gap-2 md:gap-3 md:flex-row">
      <InputGroup class="w-full bg-card md:w-64">
        <InputGroupInput
          type="search"
          v-model="search"
          :aria-describedby="search ? 'clear-search' : undefined"
          placeholder="Search..."
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            v-show="search"
            id="clear-search"
            size="icon-xs"
            @click="search = ''"
            aria-label="Clear search"
          >
            <X aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <Button @click="goToCreateWorkspace">
        <PlusIcon />
        New workspace
      </Button>
    </div>
    <template v-if="isLoading">
      <ul
        role="status"
        aria-live="polite"
        aria-busy="true"
        class="mx-auto grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
      >
        <WorkspaceSkeleton v-for="n in 2" :key="n" />
      </ul>
    </template>

    <template v-else-if="filteredWorkspaces.length === 0 && search">
      <Alert aria-live="assertive">
        <AlertCircleIcon aria-hidden="true" />
        <AlertTitle>{{ $t('error.notFound') }}</AlertTitle>
        <AlertDescription>
          {{ $t('error.noResults') }}
        </AlertDescription>
      </Alert>
    </template>

    <template v-else-if="isEmptyResponse">
      <div
        role="status"
        aria-live="polite"
        class="space-y-4 bg-card rounded-lg border border-dashed p-6 text-center"
      >
        <div class="space-y-1">
          <p>No projects</p>
          <p class="text-sm text-muted-foreground">Get started by creating a new project.</p>
        </div>

        <Button @click="goToCreateWorkspace">
          <PlusIcon />
          New workspace
        </Button>
      </div>
    </template>

    <template v-else>
      <ul
        role="list"
        class="mx-auto grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
      >
        <WorkspaceCard
          v-for="workspace in filteredWorkspaces"
          role="listitem"
          :key="workspace.id"
          :title="workspace.title"
          :subtitle="workspace.subtitle"
        />
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import WorkspaceCard from '@/components/workspace/WorkspaceCard.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon, PlusIcon, Search, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import WorkspaceSkeleton from '@/components/workspace/WorkspaceSkeleton.vue'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import InputGroupButton from '@/components/ui/input-group/InputGroupButton.vue'
const router = useRouter()
const search = ref('')

const fetchWorkspaces = async () => {
  return new Promise<{ id: number; title: string; subtitle: string }[]>((resolve) => {
    setTimeout(() => {
      resolve([])
    }, 1500)
  })
}

const { data: workspaces, isLoading } = useQuery({
  queryKey: ['workspaces'],
  queryFn: fetchWorkspaces,
})

const filteredWorkspaces = computed(() =>
  (workspaces.value ?? []).filter((workspace) =>
    workspace.title.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

const isEmptyResponse = computed(
  () => !isLoading.value && (!workspaces.value || workspaces.value.length === 0),
)

const goToCreateWorkspace = () => {
  router.push('/workspace/new')
}
</script>
