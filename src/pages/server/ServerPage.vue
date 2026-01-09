<template>
  <section class="flex h-full">
    <ServerListSidebar />

    <main class="flex min-h-0 min-w-0 flex-1 flex-col">
      <!-- Loading current member -->
      <div v-if="isLoadingCurrentMember" class="flex h-full items-center justify-center">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>

      <template v-else>
        <header class="flex h-12 shrink-0 items-center justify-between border-b px-4">
          <h1 class="font-semibold">{{ server?.name ?? 'Server' }}</h1>

          <!-- Header actions -->
          <div class="flex items-center gap-2">
            <!-- Create virtual member -->
            <PermissionGuard action="CREATE_VIRTUAL">
              <Button variant="ghost" size="icon" @click="handleCreateVirtual">
                <UserPlus class="size-4" />
              </Button>
            </PermissionGuard>

            <!-- Toggle member list -->
            <Button variant="ghost" size="icon" @click="toggleMemberList">
              <Users class="size-4" />
            </Button>
          </div>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto p-4">
          <p class="text-muted-foreground">Welcome to {{ server?.name }}</p>
        </div>
      </template>
    </main>

    <MemberListSidebar
      v-if="showMemberList && serverId"
      :server-id="serverId"
      @select-member="handleSelectMember"
    />

    <!-- Dialogs -->
    <MemberProfileDialog
      v-model:open="showProfileDialog"
      :server-id="serverId"
      :member-id="selectedMemberId"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Loader2, UserPlus, Users } from 'lucide-vue-next'
import { useCurrentMemberQuery, useServerQuery } from '@/api/queries/server'
import PermissionGuard from '@/components/common/PermissionGuard.vue'
import ServerListSidebar from '@/components/server/sidebars/ServerListSidebar.vue'
import MemberListSidebar from '@/components/server/sidebars/MemberListSidebar.vue'
import MemberProfileDialog from '@/components/server/member/MemberProfileDialog.vue'

const route = useRoute()

const serverId = computed(() => route.params.serverId as string)
const showMemberList = ref(true)
const showProfileDialog = ref(false)
const selectedMemberId = ref<string | null>(null)

const { data: server } = useServerQuery(serverId)

const { isLoading: isLoadingCurrentMember } = useCurrentMemberQuery(serverId)

function toggleMemberList() {
  showMemberList.value = !showMemberList.value
}

function handleSelectMember(memberId: string) {
  selectedMemberId.value = memberId
  showProfileDialog.value = true
}

function handleCreateVirtual() {
  // TODO: Open create virtual member dialog
}
</script>
