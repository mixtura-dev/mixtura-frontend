<template>
    <div class="flex flex-col justify-center items-center pt-32">
        <div class=" flex flex-col px-5 max-w-lg w-full ">
            <h1 class="text-2xl font-bold mb-2">Complete registration</h1>
            <p class="text-muted-foreground mb-6">Set your username and password</p>

            <form @submit="onSubmit" class="w-full space-y-4">
                <FormField v-slot="{ componentField }" name="username">
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" placeholder="Your username" class="!bg-card" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="password">
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" v-bind="componentField" placeholder="Password" class="!bg-card" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="repeatPassword">
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input type="password" v-bind="componentField" placeholder="Confirm password"
                                class="!bg-card" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <Button type="submit" :disabled="isPending" class="w-full">
                    {{ isPending ? 'Creating account...' : 'Sign Up' }}
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { createSignUpSchema } from '@/schemas/signUpSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useConfirmSignUpMutation, useSignInMutation } from '@/composables/useAuthQuery';
import { getQueryValue } from '@/lib/utils/router';

const route = useRoute();
const router = useRouter();
const email = ref('');
const token = ref('');
const { mutate: signIn } = useSignInMutation();


const schema = createSignUpSchema();
type FormValues = {
    username: string;
    password: string;
    repeatPassword: string;
};

const { mutate: confirmSignUp, isPending } = useConfirmSignUpMutation();
const { handleSubmit } = useForm<FormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { username: '', password: '', repeatPassword: '' },
});

const onSubmit = handleSubmit((values) => {
    confirmSignUp({
        email: email.value,
        token: token.value,
        username: values.username,
        password: values.password,
        repeat_password: values.repeatPassword,
    }, {
        onSuccess: (data) => {
            if (data.verified) {
                toast.success('Account created! Logging you in...');
                signIn(
                    { login: email.value, password: values.password },
                    {
                        onSuccess: () => {
                            router.push('/');
                        },
                        onError: () => {
                            toast.error('Login failed. Please sign in manually.');
                            router.push('/sign-in');
                        },
                    }
                );
            } else {
                toast.error('Verification failed');
            }
        },
        onError: (error) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        },
    });
});

onMounted(() => {
    const emailParam = getQueryValue(route.query.email);
    const tokenParam = getQueryValue(route.query.token);
    if (!emailParam || !tokenParam) {
        router.push('/sign-up');
        return;
    }
    email.value = emailParam;
    token.value = tokenParam;
});


</script>