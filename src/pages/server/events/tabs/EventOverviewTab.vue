<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { Loader2, Swords, Users, Shuffle, Globe, FileText, Repeat } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { useEventQuery } from '@/api/queries/event'
import type { ServerID } from '@/types/user'
import type { components } from '@/types/api'

type EventDetail = components['schemas']['EventDetailResponse']

const route = useRoute()
const { t } = useI18n()

const serverId = computed<ServerID>(() => route.params.serverId as ServerID)
const eventId = computed(() => route.params.eventId as string)

const { data: eventRaw, isLoading } = useEventQuery(serverId, eventId)
const event = computed(() => eventRaw.value as EventDetail | undefined)
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center py-8">
    <Loader2 class="size-6 animate-spin text-muted-foreground" />
  </div>
  <Card v-else-if="event">
    <CardContent>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="flex items-center gap-3">
          <Swords class="size-5 text-muted-foreground shrink-0" />
          <div>
            <p class="text-sm text-muted-foreground">{{ t('server.events.detail.matchType') }}</p>
            <p class="font-medium">
              {{
                event.match_type === 'SINGLE'
                  ? t('server.events.createEvent.single')
                  : t('server.events.createEvent.tournament')
              }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Users class="size-5 text-muted-foreground shrink-0" />
          <div>
            <p class="text-sm text-muted-foreground">{{ t('server.events.detail.teamSize') }}</p>
            <p class="font-medium">{{ event.team_size }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Shuffle class="size-5 text-muted-foreground shrink-0" />
          <div>
            <p class="text-sm text-muted-foreground">
              {{ t('server.events.detail.teamFormation') }}
            </p>
            <p class="font-medium">
              {{
                event.team_formation === 'DRAFT'
                  ? t('server.events.createEvent.draft')
                  : event.team_formation === 'BALANCE'
                    ? t('server.events.createEvent.balance')
                    : t('server.events.createEvent.manual')
              }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Globe class="size-5 text-muted-foreground shrink-0" />
          <div>
            <p class="text-sm text-muted-foreground">{{ t('server.events.detail.visibility') }}</p>
            <p class="font-medium">
              {{
                event.is_public
                  ? t('server.events.detail.public')
                  : t('server.events.detail.private')
              }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <FileText class="size-5 text-muted-foreground shrink-0" />
          <div>
            <p class="text-sm text-muted-foreground">
              {{ t('server.events.detail.useApplication') }}
            </p>
            <p class="font-medium">
              {{
                event.use_application
                  ? t('server.events.detail.enabled')
                  : t('server.events.detail.disabled')
              }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Repeat class="size-5 text-muted-foreground shrink-0" />
          <div>
            <p class="text-sm text-muted-foreground">
              {{ t('server.events.detail.allowMultipleDrafts') }}
            </p>
            <p class="font-medium">
              {{ event.allow_multiple_drafts ? t('common.yes') : t('common.no') }}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
