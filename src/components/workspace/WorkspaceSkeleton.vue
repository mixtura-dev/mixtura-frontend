<script setup lang="ts">
import Skeleton from '../ui/skeleton/Skeleton.vue'
import WorkspaceCardBase from './WorkspaceCardBase.vue'
</script>

<template>
  <WorkspaceCardBase
    class="group relative text-left transition ease-in-out duration-150 min-h-32 md:min-h-44 pt-5 pb-0"
  >
    <div class="flex h-full w-full flex-col space-y-2">
      <Skeleton class="h-6 w-3/4" />
      <Skeleton class="h-6 w-1/2" />
    </div>
  </WorkspaceCardBase>
</template>
