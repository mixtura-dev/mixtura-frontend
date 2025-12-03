<template>
  <div class="min-h-screen bg-background pb-20">
    <div class="relative h-auto min-h-[280px] md:h-60 w-full overflow-hidden bg-muted">
      <div class="absolute inset-0">
        <img
          v-if="server.banner_url"
          :src="server.banner_url"
          alt="Server Banner"
          class="h-full w-full object-cover transition-transform duration-700"
        />
        <div
          v-else
          class="h-full w-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center"
        >
          <ImageIcon class="size-20 text-muted-foreground/20" />
        </div>

        <div
          class="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"
        />
      </div>

      <div class="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 md:p-8">
        <div class="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
          <div class="relative shrink-0 flex md:block">
            <Avatar
              class="size-20 sm:size-24 md:size-32 border-4 bg-background border-background shadow-lg"
            >
              <AvatarImage :src="server.icon_url || ''" class="object-cover" />
              <AvatarFallback class="text-2xl md:text-3xl font-bold bg-muted text-muted-foreground">
                {{ serverInitials }}
              </AvatarFallback>
            </Avatar>
          </div>

          <div class="flex-1 min-w-0 flex flex-col justify-end mb-1 space-y-1">
            <h1
              class="text-2xl leading-normal sm:text-3xl md:text-4xl font-bold tracking-tight text-white truncate"
              :title="server.name"
            >
              {{ server.name }}
            </h1>

            <div
              class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-200/90 font-medium"
            >
              <span class="flex items-center gap-1.5 truncate">
                <User class="size-4 shrink-0 opacity-70" />
                <span class="truncate max-w-[150px]">Owner: {{ server.owner_id }}</span>
              </span>

              <span class="hidden sm:inline text-white/40">•</span>

              <span class="flex items-center gap-1.5 truncate">
                <CalendarDays class="size-4 shrink-0 opacity-70" />
                <span>Created {{ formatDate(server.created_at) }}</span>
              </span>
            </div>
          </div>

          <div
            class="flex shrink-0 flex-col sm:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0 md:mb-2"
          >
            <Button v-if="!isJoined" @click="handleJoin" class="w-full md:w-auto shadow-lg">
              <LogIn class="mr-2 size-4" />
              Join Server
            </Button>

            <Button
              v-else
              variant="secondary"
              class="w-full md:w-auto bg-white/90 hover:bg-white text-black shadow-sm"
            >
              <Check class="mr-2 size-4" />
              Joined
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-8 px-4">
      <Tabs default-value="overview" class="space-y-6">
        <TabsList
          class="bg-muted/50 p-1 h-auto w-full overflow-x-auto justify-start rounded-lg sm:w-auto"
        >
          <TabsTrigger value="overview" class="px-6 py-2">Overview</TabsTrigger>
          <TabsTrigger value="games" class="px-6 py-2"
            >Games ({{ server.games.length }})</TabsTrigger
          >
          <TabsTrigger value="competitive" class="px-6 py-2" :disabled="!server.rating_set"
            >Competitive</TabsTrigger
          >
          <TabsTrigger value="roles" class="px-6 py-2" :disabled="!server.role_set"
            >Roles</TabsTrigger
          >
        </TabsList>

        <TabsContent
          value="overview"
          class="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="grid gap-6 lg:grid-cols-3">
            <!-- LEFT COLUMN: Main Content -->
            <div class="lg:col-span-2 space-y-6">
              <Card class="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>About Workspace</CardTitle>
                </CardHeader>
                <CardContent class="flex-1 space-y-6">
                  <!-- Description -->
                  <p class="leading-relaxed text-muted-foreground whitespace-pre-line">
                    {{ server.description }}
                  </p>

                  <div v-if="server.games.length" class="pt-4">
                    <h3 class="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Gamepad2 class="size-4 text-primary" />
                      Active Games
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        v-for="game in server.games"
                        :key="game.id"
                        class="flex items-center gap-3 p-2 rounded-md border bg-muted/30 transition-colors hover:bg-muted hover:border-primary/50"
                      >
                        <Avatar class="size-8 rounded-md">
                          <AvatarImage :src="game.icon_url" />
                          <AvatarFallback class="rounded-md text-xs">{{
                            game.name[0]
                          }}</AvatarFallback>
                        </Avatar>
                        <span class="font-medium text-sm">{{ game.name }}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- RIGHT COLUMN: Meta Data & Sidebar -->
            <div class="space-y-6">
              <!-- Server Details Card -->
              <Card>
                <CardHeader class="pb-3">
                  <CardTitle class="text-sm text-muted-foreground tracking-wider uppercase"
                    >Server Info</CardTitle
                  >
                </CardHeader>
                <CardContent class="grid gap-4">
                  <!-- Type -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-sm">
                      <Globe2 v-if="server.public" class="size-4 text-muted-foreground" />
                      <Lock v-else class="size-4 text-muted-foreground" />
                      <span>Access</span>
                    </div>
                    <Badge variant="outline">{{ server.public ? 'Public' : 'Private' }}</Badge>
                  </div>

                  <!-- Rating System -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-sm">
                      <Trophy class="size-4 text-muted-foreground" />
                      <span>Rating System</span>
                    </div>
                    <span class="text-sm font-medium">{{
                      server.rating_set ? 'Enabled' : 'Disabled'
                    }}</span>
                  </div>

                  <!-- Rating Name if enabled -->
                  <div
                    v-if="server.rating_set"
                    class="mt-2 p-3 rounded-md bg-secondary/50 text-xs text-muted-foreground border border-border/50"
                  >
                    Using
                    <span class="font-semibold text-foreground">{{ server.rating_set.name }}</span>
                    preset.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="pb-3">
                  <CardTitle class="text-sm text-muted-foreground tracking-wider uppercase"
                    >Administrators</CardTitle
                  >
                </CardHeader>
                <CardContent>
                  <div
                    class="flex items-center gap-3 p-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <Avatar class="size-9 border">
                      <AvatarFallback class="text-xs bg-primary/10 text-primary font-bold"
                        >OP</AvatarFallback
                      >
                    </Avatar>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate">Server Owner</p>
                      <p class="text-xs text-muted-foreground truncate">@{{ server.owner_id }}</p>
                    </div>
                    <Badge variant="secondary" class="text-[10px] h-5">Owner</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="games" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              v-for="game in server.games"
              :key="game.id"
              class="overflow-hidden hover:shadow-lg transition-all hover:border-primary"
            >
              <div class="h-20 relative">
                <div class="w-full h-full flex items-center justify-center">
                  <Gamepad2 class="size-10" />
                </div>
              </div>

              <CardFooter>
                <Button variant="outline" class="w-full text-primary"
                  >Find Teammates <ArrowRight
                /></Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent
          value="competitive"
          v-if="server.rating_set"
          class="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="space-y-6">
            <div class="grid gap-4 grid-cols-1">
              <Card>
                <CardContent>
                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <CardTitle class="text-lg flex items-center gap-2">
                        {{ server.rating_set.name }}
                        <Badge variant="outline" class="font-normal text-xs text-muted-foreground">
                          Global
                        </Badge>
                      </CardTitle>
                      <CardDescription class="flex items-center gap-2 text-xs">
                        <span
                          >Range: {{ server.rating_set.min_rating }} -
                          {{ server.rating_set.max_rating }} MMR</span
                        >
                      </CardDescription>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Tiers Grid -->
            <div>
              <h3 class="text-lg font-semibold mb-4 px-1">Progression Ladder</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                  v-for="(rating, index) in server.rating_set.ratings.sort(
                    (a, b) => a.threshold - b.threshold,
                  )"
                  :key="rating.id"
                  class="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50"
                >
                  <!-- Background Decor -->
                  <div
                    class="absolute -right-6 -top-6 opacity-5 transition-opacity group-hover:opacity-10"
                  >
                    <img v-if="rating.icon_url" :src="rating.icon_url" class="size-24 rotate-12" />
                    <Swords v-else class="size-24 rotate-12" />
                  </div>

                  <div class="relative flex flex-col items-center text-center gap-4">
                    <!-- Icon Circle -->
                    <div
                      class="flex size-16 items-center justify-center rounded-full bg-muted shadow-inner ring-4 ring-background transition-transform group-hover:scale-110 group-hover:bg-primary/10"
                    >
                      <img v-if="rating.icon_url" :src="rating.icon_url" class="size-10" />
                      <Swords
                        v-else
                        class="size-8 text-muted-foreground group-hover:text-primary"
                      />
                    </div>

                    <!-- Info -->
                    <div class="space-y-1">
                      <div
                        class="text-xs font-bold uppercase text-muted-foreground tracking-widest"
                      >
                        Tier {{ index + 1 }}
                      </div>
                      <div class="text-3xl font-black tracking-tighter">
                        {{ rating.threshold }}
                        <span class="text-sm font-normal text-muted-foreground align-top">+</span>
                      </div>
                      <p class="text-xs text-muted-foreground">MMR Required</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="roles"
          v-if="server.role_set"
          class="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <Card>
            <CardHeader>
              <CardTitle>Team Structure: {{ server.role_set.name }}</CardTitle>
              <CardDescription
                >Available roles for team composition within this workspace.</CardDescription
              >
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="role in server.role_set.game_roles"
                  :key="role.id"
                  class="flex items-start space-x-4 rounded-md border p-4"
                >
                  <div class="mt-1 bg-primary/10 p-2 rounded-md">
                    <Shield v-if="!role.icon_url" class="size-5 text-primary" />
                    <img v-else :src="role.icon_url" class="size-5" />
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm font-medium leading-none">{{ role.name }}</p>
                    <p class="text-xs text-muted-foreground">
                      Min: {{ role.min_in_team }} / Max: {{ role.max_in_team }} per team
                    </p>
                    <Badge v-if="role.hidden" variant="secondary" class="text-[10px] mt-1"
                      >Hidden Role</Badge
                    >
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ImageIcon,
  User,
  CalendarDays,
  LogIn,
  Globe2,
  Lock,
  Gamepad2,
  ArrowRight,
  Trophy,
  Shield,
  Check,
  Swords,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Server } from '@/types/user'

const mockServer: Server = {
  id: '123',
  name: 'Cyberpunk Netrunners',
  description:
    'Welcome to the official Netrunners hub. We organize daily scrims, weekly tournaments, and chill lobbies. \n\nRespect the code, respect the players. Join our voice channels for coordination.',
  icon_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=Cyber',
  banner_url:
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  owner_id: 'user_999',
  public: true,
  created_at: '2023-11-15T10:00:00Z',
  games: [
    {
      id: 'g1',
      name: 'Valorant',
      icon_url: 'https://api.dicebear.com/7.x/initials/svg?seed=VL',
      banner_url:
        'https://images.unsplash.com/photo-1624138784181-dc7f5b759e5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'g2',
      name: 'League of Legends',
      icon_url: 'https://api.dicebear.com/7.x/initials/svg?seed=LOL',
      banner_url: '',
    },
  ],
  rating_set: {
    id: 'rs1',
    name: 'Standard ELO System',
    min_rating: 0,
    max_rating: 3000,
    is_global: true,
    ratings: [
      { id: 'r1', icon_url: '', threshold: 500 },
      { id: 'r2', icon_url: '', threshold: 1000 },
      { id: 'r3', icon_url: '', threshold: 1500 },
      { id: 'r4', icon_url: '', threshold: 2000 },
      { id: 'r5', icon_url: '', threshold: 2500 },
    ],
  },
  role_set: {
    id: 'role1',
    name: 'MOBA Structure',
    game_roles: [
      { id: 'gr1', name: 'Top Laner', min_in_team: 1, max_in_team: 1, hidden: false },
      { id: 'gr2', name: 'Jungler', min_in_team: 1, max_in_team: 1, hidden: false },
      { id: 'gr3', name: 'Mid Laner', min_in_team: 1, max_in_team: 1, hidden: false },
      { id: 'gr4', name: 'Carry', min_in_team: 1, max_in_team: 1, hidden: false },
      { id: 'gr5', name: 'Support', min_in_team: 1, max_in_team: 1, hidden: false },
      { id: 'gr6', name: 'Coach', min_in_team: 0, max_in_team: 2, hidden: false },
    ],
  },
}

const server = ref<Server>(mockServer)
const isJoined = ref(false)

const serverInitials = computed(() => {
  return server.value.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const handleJoin = () => {
  isJoined.value = true
}
</script>
