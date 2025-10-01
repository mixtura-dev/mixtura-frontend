<template>
    <div class="flex flex-col justify-center items-center pt-32">
        <div class=" flex flex-col px-5 max-w-lg w-full ">
            <h1 class="text-2xl font-bold mb-2">Verify your email</h1>
            <p class="text-muted-foreground mb-6">Enter the code we sent to {{ email }}</p>

            <form @submit="onSubmit" class="w-full space-y-4">
                <FormField v-slot="{ componentField }" name="token">
                    <FormItem>
                        <FormControl>
                            <Input v-bind="componentField" placeholder="6-digit code" class="!bg-card" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <Button type="submit" :disabled="isPending" class="w-full">
                    {{ isPending ? 'Verifying...' : 'Continue' }}
                </Button>
            </form>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createSignUpVerifySchema } from '@/schemas/signUpSchema';
import { useVerifySignUpMutation } from '@/composables/useAuthQuery';
import { getQueryValue } from '@/lib/utils/router';

const route = useRoute();
const router = useRouter();
const email = ref('');

onMounted(() => {
    const emailParam = getQueryValue(route.query.email);
    if (!emailParam) {
        router.push('/sign-up');
        return;
    }
    email.value = emailParam;
});
const schema = createSignUpVerifySchema();
type FormValues = { token: string };

const { mutate: verifySignUp, isPending } = useVerifySignUpMutation();
const { handleSubmit } = useForm<FormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { token: '' },
});

const onSubmit = handleSubmit((values) => {
    verifySignUp({ email: email.value, token: values.token }, {
        onSuccess: (data) => {
            if (data.verified) {
                toast.success({ title: 'Verified!', description: 'Now set your username and password' });
                router.push({
                    path: '/sign-up/confirm',
                    query: { email: email.value, token: values.token }
                });
            } else {
                toast({ title: 'Invalid code', variant: 'destructive' });
            }
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        },
    });
});
</script>