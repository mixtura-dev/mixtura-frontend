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

      <form @submit="onSubmit">
        <CardContent class="space-y-6">
          <div class="space-y-2">
            <Label for="name"> Workspace Name <span class="text-destructive">*</span> </Label>
            <Input
              id="name"
              v-bind="nameAttrs"
              v-model="name"
              placeholder="e.g. The Chill Zone"
              :class="{ 'border-destructive': errors.name }"
              class="bg-input border-input focus-visible:ring-ring"
            />
            <span v-if="errors.name" class="text-xs text-destructive">
              {{ errors.name }}
            </span>
          </div>

          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Textarea
              id="description"
              v-model="description"
              placeholder="Briefly describe your workspace..."
              class="bg-input border-input min-h-[80px] focus-visible:ring-ring"
            />
          </div>

          <div
            class="flex items-center justify-between rounded-lg border border-border p-4 bg-card"
          >
            <div class="space-y-0.5">
              <Label class="text-base">Public Workspace</Label>
              <p class="text-sm text-muted-foreground">
                Allow anyone to see this workspace in the public directory.
              </p>
            </div>
            <Switch v-model="isPublic" />
          </div>

          <Separator class="bg-border" />

          <div class="space-y-3">
            <Label>Supported Games</Label>

            <div
              v-if="isGamesLoading"
              class="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Loader2 class="size-4 animate-spin" />
              Loading games...
            </div>

            <div v-else-if="gamesData?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="game in gamesData"
                :key="game.id"
                class="flex items-center space-x-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/50"
                :class="{ 'border-primary bg-primary/5': gameIds?.includes(game.id) }"
              >
                <Checkbox
                  :id="game.id"
                  :checked="gameIds?.includes(game.id)"
                  @update:checked="(checked: boolean) => handleToggleGame(game.id, checked)"
                />

                <Label :for="game.id" class="flex-1 cursor-pointer font-normal select-none">
                  {{ game.name }}
                </Label>
                <div
                  class="flex size-8 items-center justify-center rounded bg-muted shrink-0 overflow-hidden"
                >
                  <img
                    v-if="game.icon_url"
                    :src="game.icon_url"
                    :alt="game.name"
                    class="size-full object-cover"
                    loading="lazy"
                  />
                  <span v-else class="text-muted-foreground text-xs font-medium select-none">
                    {{ game.name.slice(0, 2).toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>

            <p v-else class="text-sm text-muted-foreground">No games available.</p>
          </div>
          <Separator class="bg-border" />

          <div class="grid gap-6 sm:grid-cols-2">
            <div class="space-y-2">
              <Label>Rating Template <span class="text-destructive">*</span></Label>
              <Select v-model="ratingSetId" :disabled="isRatingTemplatesLoading">
                <SelectTrigger class="bg-input border-input">
                  <SelectValue placeholder="Select a rating system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="tpl in ratingTemplatesData" :key="tpl.id" :value="tpl.id">
                    {{ tpl.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground">Pre-configure ranks based on a template.</p>
              <span v-if="errors.rating_set_id" class="text-xs text-destructive">
                {{ errors.rating_set_id }}
              </span>
            </div>

            <div class="space-y-2">
              <Label>Role Template <span class="text-destructive">*</span></Label>
              <Select v-model="roleSetId" :disabled="isRoleTemplatesLoading">
                <SelectTrigger class="bg-input border-input">
                  <SelectValue placeholder="Select a role structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="tpl in roleTemplatesData" :key="tpl.id" :value="tpl.id">
                    {{ tpl.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground">Pre-configure permissions and hierarchy.</p>
              <span v-if="errors.role_set_id" class="text-xs text-destructive">
                {{ errors.role_set_id }}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex sm:flex-row flex-col justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            class="w-full sm:w-auto border-border hover:bg-muted hover:text-muted-foreground"
            :disabled="isSubmitting"
            @click="router.back()"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            class="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            :disabled="isSubmitting"
          >
            <Loader2 v-if="isSubmitting" class="mr-2 size-4 animate-spin" />
            {{ isSubmitting ? 'Creating...' : 'Create Workspace' }}
          </Button>
        </CardFooter>
      </form>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toast } from 'vue-sonner'

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

import { getErrorMessage } from '@/composables/useApiError'
import {
  useCreateServerMutation,
  useGlobalGamesQuery,
  useGlobalRatingTemplatesQuery,
  useGlobalRoleTemplatesQuery,
  useSetServerGamesMutation,
} from '@/api/queries/server'

const router = useRouter()

// ============================================
// Data Fetching
// ============================================

const { data: gamesData, isLoading: isGamesLoading } = useGlobalGamesQuery()
const { data: ratingTemplatesData, isLoading: isRatingTemplatesLoading } =
  useGlobalRatingTemplatesQuery()
const { data: roleTemplatesData, isLoading: isRoleTemplatesLoading } = useGlobalRoleTemplatesQuery()

const { mutateAsync: createServer } = useCreateServerMutation()
const { mutateAsync: setServerGames } = useSetServerGamesMutation()

// ============================================
// Form Validation & Setup
// ============================================

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(50),
    description: z.string().optional(),
    public: z.boolean().default(false),
    game_ids: z.array(z.string()).default([]),
    rating_set_id: z.string().min(1, 'Rating template is required'),
    role_set_id: z.string().min(1, 'Role template is required'),
  }),
)

const { handleSubmit, errors, defineField, isSubmitting, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    description: '',
    public: false,
    game_ids: [],
    rating_set_id: '',
    role_set_id: '',
  },
})

const [name, nameAttrs] = defineField('name')
const [description] = defineField('description')
const [isPublic] = defineField('public')
const [gameIds] = defineField('game_ids')
const [ratingSetId] = defineField('rating_set_id')
const [roleSetId] = defineField('role_set_id')

// ============================================
// Auto-select Defaults
// ============================================

watch(ratingTemplatesData, (data) => {
  if (data && data.length > 0 && !values.rating_set_id) {
    setFieldValue('rating_set_id', data[0].id)
  }
})

watch(roleTemplatesData, (data) => {
  if (data && data.length > 0 && !values.role_set_id) {
    setFieldValue('role_set_id', data[0].id)
  }
})

// ============================================
// Handlers
// ============================================

const handleToggleGame = (gameId: string, checked: boolean) => {
  const current = values.game_ids || []
  if (checked) {
    setFieldValue('game_ids', [...current, gameId])
  } else {
    setFieldValue(
      'game_ids',
      current.filter((id) => id !== gameId),
    )
  }
}

const onSubmit = handleSubmit(async (formValues) => {
  try {
    const newServer = await createServer({
      name: formValues.name,
      description: formValues.description || '',
      public: formValues.public,
      rating_set_id: formValues.rating_set_id,
      role_set_id: formValues.role_set_id,
    })

    if (formValues.game_ids && formValues.game_ids.length > 0) {
      await setServerGames({
        serverId: newServer.id,
        data: {
          ids: formValues.game_ids,
        },
      })
    }

    toast.success('Workspace created', {
      description: `${newServer.name} is ready!`,
    })

    router.push('/servers')
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error')
    toast.error('Failed to create workspace', {
      description: getErrorMessage(err),
    })
  }
})
</script>
