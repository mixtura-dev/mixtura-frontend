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
              class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white truncate drop-shadow-md"
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
            <div class="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Workspace</CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="leading-relaxed text-muted-foreground whitespace-pre-line">
                    {{ server.description }}
                  </p>
                </CardContent>
              </Card>

              <!-- Features Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card class="bg-primary/5 border-primary/20">
                  <CardHeader class="pb-2">
                    <CardTitle class="text-sm font-medium text-primary">Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold flex items-center gap-2">
                      <Globe2 v-if="server.public" class="size-6" />
                      <Lock v-else class="size-6" />
                      {{ server.public ? 'Public Community' : 'Private Team' }}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader class="pb-2">
                    <CardTitle class="text-sm font-medium text-muted-foreground"
                      >Rating System</CardTitle
                    >
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold">
                      {{ server.rating_set ? server.rating_set.name : 'Casual / None' }}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div class="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle class="text-sm text-muted-foreground uppercase tracking-wider"
                    >Supported Games</CardTitle
                  >
                </CardHeader>
                <CardContent class="flex flex-wrap gap-2">
                  <Badge v-for="game in server.games" :key="game.id" variant="secondary">
                    {{ game.name }}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle class="text-sm text-muted-foreground uppercase tracking-wider"
                    >Administrators</CardTitle
                  >
                </CardHeader>
                <CardContent>
                  <div class="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p class="text-sm font-medium">Server Admin</p>
                      <p class="text-xs text-muted-foreground">@{{ server.owner_id }}</p>
                    </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Rating System: {{ server.rating_set.name }}</CardTitle>
              <CardDescription>
                This server uses a custom MMR range from {{ server.rating_set.min_rating }} to
                {{ server.rating_set.max_rating }}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div
                  v-for="rating in server.rating_set.ratings"
                  :key="rating.id"
                  class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="size-12 rounded-full bg-accent flex items-center justify-center shrink-0"
                    >
                      <img v-if="rating.icon_url" :src="rating.icon_url" class="size-8" />
                      <Trophy v-else class="size-6 text-primary" />
                    </div>
                    <div>
                      <h4 class="font-bold">Tier {{ rating.threshold }}</h4>
                      <p class="text-sm text-muted-foreground">
                        Requires {{ rating.threshold }} rating points
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" class="font-mono">{{ rating.threshold }}+</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
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

// --- MOCK DATA (Fully populated based on your types) ---
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

// State
const server = ref<Server>(mockServer)
const isJoined = ref(false)

// Computeds
const serverInitials = computed(() => {
  return server.value.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const handleJoin = () => {
  // Simulate API call
  isJoined.value = true
  // Could show a toast here: "Welcome to the server!"
}
</script>
