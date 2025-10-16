<template>
    <section class="flex pt-16 px-4 flex-col h-full w-full items-center">

        <Card class="max-w-sm w-full">
            <CardHeader>
                <CardTitle class="flex flex-col items-center gap-4">
                    <Avatar class=" size-28">
                        <AvatarImage draggable="false" src="https://github.com/unovue.png" alt="@unovue" />
                        <AvatarFallback class="text-sm">
                            <Loader2 class="animate-spin" />
                        </AvatarFallback>
                    </Avatar>

                </CardTitle>
                <span
                    class="block w-full truncate scroll-m-20 text-center text-1xl font-extrabold tracking-tight lg:text-3xl">
                    NAME OF GROUPфывфывфывфы
                </span>
            </CardHeader>
            <CardContent class="space-y-4 text-muted-foreground">
                <p class="text-sm text-center">
                    Присоединяйтесь к нашей группе и станьте частью нашего сообщества!
                </p>
                <ul class="space-y-2 text-sm">
                    <li class="flex items-center gap-2">
                        <CircleCheck class="h-5 w-5 text-green-500" />
                        Уникальные возможности для участников
                    </li>
                    <li class="flex items-center gap-2">
                        <CircleCheck class="h-5 w-5 text-green-500" />
                        Еженедельные обновления
                    </li>
                    <li class="flex items-center gap-2">
                        <CircleCheck class="h-5 w-5 text-green-500" />
                        Поддержка 24/7
                    </li>
                </ul>
            </CardContent>

            <CardFooter>
                <Button class="w-full">
                    JOIN
                </Button>
            </CardFooter>
        </Card>

    </section>
</template>

<script lang="ts" setup>
import Avatar from '@/components/ui/avatar/Avatar.vue';
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue';
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import { CircleCheck, Loader2 } from 'lucide-vue-next';


</script>
