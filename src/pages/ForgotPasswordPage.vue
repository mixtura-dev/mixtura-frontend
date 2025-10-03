<template>
    <div class="flex flex-col justify-center items-center pt-32">
        <div class="flex flex-col px-5 max-w-lg w-full">
            <h1 class="text-2xl font-bold mb-2">Forgot your password?</h1>
            <p class="text-muted-foreground mb-6">Enter your email and we'll send you a reset code</p>

            <form @submit="onSubmit" class="w-full space-y-4">
                <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty('email')">
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" :placeholder="$t('form.email')" type="email"
                                autocomplete="email" class="!bg-card" />
                        </FormControl>
                        <FormMessage class="text-xs text-destructive" />
                    </FormItem>
                </FormField>

                <Button type="submit" :disabled="isPending" class="w-full">
                    {{ isPending ? 'Sending...' : 'Send Reset Code' }}
                </Button>
            </form>

            <div class="text-center text-sm mt-8">
                {{ $t('form.signIn.linkText') }}
                <RouterLink to="/sign-in" class="text-primary hover:underline ml-1">
                    {{ $t('form.signIn.linkLabel') }}
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { createForgotPasswordEmailSchema } from '@/schemas/forgotPasswordSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useResetPasswordMutation } from '@/composables/useAuthQuery';

const router = useRouter();
const schema = createForgotPasswordEmailSchema();
type FormValues = { email: string };

const { mutate: resetPassword, isPending } = useResetPasswordMutation();
const { handleSubmit, isFieldDirty } = useForm<FormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { email: '' },
});

const onSubmit = handleSubmit((values) => {
    resetPassword(values, {
        onSuccess: () => {
            toast.success('Check your email for a reset code');
            router.push({ path: '/forgot-password/verify', query: { email: values.email } });
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        },
    });
});
</script>