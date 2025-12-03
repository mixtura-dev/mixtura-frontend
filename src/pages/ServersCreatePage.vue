<template>
  <section class="max-w-2xl w-full mx-auto py-6 p-4 sm:p-4">
    <Card class="bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle class="text-xl">Create New Workspace</CardTitle>
        <CardDescription class="text-muted-foreground">
          Create a new space for your community. Configure basic settings, choose games, and apply
          initial templates.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <div class="space-y-2">
          <Label for="name">Workspace Name <span class="text-destructive">*</span></Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="e.g. The Chill Zone"
            class="bg-input border-input focus-visible:ring-ring"
          />
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="form.description"
            placeholder="Briefly describe your workspace..."
            class="bg-input border-input min-h-[80px] focus-visible:ring-ring"
          />
        </div>
        <div class="flex items-center justify-between rounded-lg border border-border p-4 bg-card">
          <div class="space-y-0.5">
            <Label class="text-base">Public Workspace</Label>
            <p class="text-sm text-muted-foreground">
              Allow anyone to see this workspace in the public directory.
            </p>
          </div>
          <Switch :checked="form.public" @update:checked="(v) => (form.public = v)" />
        </div>

        <Separator class="bg-border" />

        <div class="space-y-3">
          <Label>Supported Games</Label>
          <div v-if="isGamesLoading" class="text-sm text-muted-foreground">Loading games...</div>
          <div v-else-if="gamesData?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="game in gamesData"
              :key="game.id"
              class="flex items-center space-x-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/50"
              :class="{ 'border-primary bg-primary/5': form.game_ids.includes(game.id) }"
            >
              <Checkbox
                :id="game.id"
                :checked="form.game_ids.includes(game.id)"
                @update:checked="(checked) => toggleGame(game.id, checked)"
              />
              <Label :for="game.id" class="flex-1 cursor-pointer font-normal">
                {{ game.name }}
              </Label>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">No games available.</p>
        </div>

        <Separator class="bg-border" />

        <div class="grid gap-6 sm:grid-cols-2">
          <div class="space-y-2">
            <Label>Rating Template (Optional)</Label>
            <Select v-model="form.rating_set_id">
              <SelectTrigger class="bg-input border-input">
                <SelectValue placeholder="Select a rating system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" @click="form.rating_set_id = undefined">
                  <span class="text-muted-foreground">None</span>
                </SelectItem>
                <SelectItem v-for="tpl in ratingTemplatesData" :key="tpl.id" :value="tpl.id">
                  {{ tpl.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p class="text-xs text-muted-foreground">Pre-configure ranks based on a template.</p>
          </div>

          <!-- Role Template -->
          <div class="space-y-2">
            <Label>Role Template (Optional)</Label>
            <Select v-model="form.role_set_id">
              <SelectTrigger class="bg-input border-input">
                <SelectValue placeholder="Select a role structure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" @click="form.role_set_id = undefined">
                  <span class="text-muted-foreground">None</span>
                </SelectItem>
                <SelectItem v-for="tpl in roleTemplatesData" :key="tpl.id" :value="tpl.id">
                  {{ tpl.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p class="text-xs text-muted-foreground">Pre-configure permissions and hierarchy.</p>
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex sm:flex-row flex-col justify-end gap-3 pt-2">
        <Button
          variant="outline"
          class="w-full sm:w-auto border-border hover:bg-muted hover:text-muted-foreground"
          :disabled="isPending"
          @click="router.back()"
        >
          Cancel
        </Button>
        <Button
          class="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          :disabled="isPending || !form.name"
          @click="handleSubmit"
        >
          <Loader2 v-if="isPending" class="mr-2 size-4 animate-spin" />
          Create Workspace
        </Button>
      </CardFooter>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCreateServerMutation,
  useGlobalGamesQuery,
  useGlobalRatingTemplatesQuery,
  useGlobalRoleTemplatesQuery,
} from '@/api/queries/server'

const router = useRouter()

const { data: gamesData, isLoading: isGamesLoading } = useGlobalGamesQuery()
const { data: ratingTemplatesData } = useGlobalRatingTemplatesQuery()
const { data: roleTemplatesData } = useGlobalRoleTemplatesQuery()

const { mutate, isPending } = useCreateServerMutation()

const form = reactive({
  name: '',
  description: '',
  public: false,
  game_ids: [] as string[],
  rating_set_id: undefined as string | undefined,
  role_set_id: undefined as string | undefined,
})

const toggleGame = (gameId: string, checked: boolean) => {
  if (checked) {
    form.game_ids.push(gameId)
  } else {
    form.game_ids = form.game_ids.filter((id) => id !== gameId)
  }
}

function handleSubmit() {
  if (!form.name.trim()) return

  mutate(
    {
      name: form.name,
      description: form.description,
      public: form.public,
      game_ids: form.game_ids,
      rating_set_id: form.rating_set_id === 'none' ? null : form.rating_set_id,
      role_set_id: form.role_set_id === 'none' ? null : form.role_set_id,
    },
    {
      onSuccess: () => {
        router.push('/servers')
      },
      onError: (error) => {
        console.error('Failed to create server', error)
        // Здесь можно добавить Toast уведомление об ошибке
      },
    },
  )
}
</script>
