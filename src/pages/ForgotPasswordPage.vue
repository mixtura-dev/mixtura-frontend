<template>
    <div class="flex flex-col justify-center items-center pt-32">
        <div class=" flex flex-col px-5 max-w-lg w-full ">
            <div class="mb-6">
                <h1 class="text-2xl font-bold mb-2">{{ $t('form.forgotPassword.title') }}</h1>
                <p class="text-sm text-muted-foreground mb-4 ">
                    {{ $t('form.forgotPassword.subtitle') }}
                </p>
            </div>
            <form v-if="step === 1" @submit="onSubmitEmail">
                <FormField v-slot="{ componentField }" name="email">
                    <FormItem>
                        <FormLabel>{{ $t('form.email') }}</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" type="email" :placeholder="$t('form.email')"
                                autocomplete="email" class="!bg-card" />
                        </FormControl>
                    </FormItem>
                    <FormMessage class="text-xs text-destructive" />
                </FormField>

                <Button class="w-full mt-4" :disabled="emailMutation.isPending.value">
                    <span v-if="emailMutation.isPending.value">
                        {{ $t('common.loading') }}
                    </span>
                    <span v-else>
                        {{ $t('form.forgotPassword.submit') }}
                    </span>
                </Button>
            </form>
            <form v-if="step === 2">
                <PinInput class="flex items-center justify-center" v-model="value" placeholder="○"
                    @complete="handleComplete">
                    <template v-for="(id, index) in 6" :key="id">
                        <PinInputSlot class="rounded-md border" :index="index" />
                        <template v-if="index !== 5">
                            <PinInputSeparator />
                        </template>
                    </template>
                </PinInput>


                <Button class="w-full mt-8" :disabled="emailMutation.isPending.value">
                    <span v-if="emailMutation.isPending.value">
                        {{ $t('common.loading') }}
                    </span>
                    <span v-else>
                        {{ $t('form.forgotPassword.submit') }}
                    </span>
                </Button>
            </form>
            <div class="text-center text-sm mt-8">
                {{ $t('form.forgotPassword.linkText') }}
                <RouterLink to="/sign-in" class="text-primary hover:underline ml-1">
                    {{ $t('form.forgotPassword.linkLabel') }}
                </RouterLink>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { ForgotPasswordSchema } from '@/schemas/forgotPasswordSchema';
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query';
import { Button } from '@/components/ui/button';
import { ref } from "vue"
import {
    PinInput,
    PinInputSeparator,
    PinInputSlot,
} from "@/components/ui/pin-input"

const value = ref<string[]>([])
const handleComplete = (e: string[]) => alert(e.join(""))
const step = ref<1 | 2>(1)

const validationSchema = toTypedSchema(ForgotPasswordSchema)



const { handleSubmit: handleSubmitEmail } = useForm({
    validationSchema,
    initialValues: {
        email: '',
    },
})

const resetPassword = async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (email === 'fail@test.com') {
        throw new Error('Email not found')
    }
    return { success: true }
}


const emailMutation = useMutation({
    mutationFn: (email: string) => resetPassword(email),
    onSuccess: () => {
        step.value = 2
    },
})


const onSubmitEmail = handleSubmitEmail((values) => {
    emailMutation.mutate(values.email)
})



</script>