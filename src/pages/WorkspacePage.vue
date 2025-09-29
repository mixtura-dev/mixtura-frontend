<template>
    <div class="w-full mx-auto max-w-[1200px] my-8 px-4">
        <h1 class="text-2xl font-bold">Workspaces</h1>
        <div class="flex justify-between my-8 flex-col gap-2 md:gap-3 md:flex-row">
            <div class="relative group">
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2.5">
                    <Search class="size-4 text-muted-foreground" />
                </span>
                <Input v-model="search" placeholder="Search for a workspace" class="w-full md:w-64 bg-card pl-8" />
            </div>
            <Button @click="goToCreateWorkspace">
                <PlusIcon />
                New workspace
            </Button>
        </div>
        <ul class="mx-auto grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            <template v-if="isLoading">
                <WorkspaceSkeleton v-for="n in 2" :key="n" />
            </template>
            <template v-else>
                <WorkspaceCard v-for="workspace in filteredWorkspaces" :key="workspace.id" :title="workspace.title"
                    :subtitle="workspace.subtitle" />
            </template>
        </ul>

        <Alert v-if="!isLoading && filteredWorkspaces.length === 0">
            <AlertCircleIcon />
            <AlertTitle>{{ $t('error.notFound') }}</AlertTitle>
            <AlertDescription>
                {{ $t('error.noResults') }}
            </AlertDescription>
        </Alert>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WorkspaceCard from "@/components/workspace/WorkspaceCard.vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, PlusIcon, Search } from "lucide-vue-next";
import { useRouter } from "vue-router";
import WorkspaceSkeleton from "@/components/workspace/WorkspaceSkeleton.vue";

const router = useRouter();
const search = ref("");

const fetchWorkspaces = async () => {
    return new Promise<{ id: number; title: string; subtitle: string }[]>((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, title: "Design System", subtitle: "UI Kit & Tokens" },
                { id: 2, title: "Marketing Website", subtitle: "Landing and Blog" },
                { id: 3, title: "Internal Tools", subtitle: "Admin Panel" },
                { id: 4, title: "Mobile App", subtitle: "iOS and Android" },
                { id: 5, title: "Analytics", subtitle: "Charts and Dashboards" },
            ]);
        }, 1500);
    });
};

const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
});

const filteredWorkspaces = computed(() =>
    (workspaces.value ?? []).filter((workspace) =>
        workspace.title.toLowerCase().includes(search.value.toLowerCase())
    )
);

const goToCreateWorkspace = () => {
    router.push("/workspace/new");
};
</script>
