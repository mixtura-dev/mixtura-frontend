<template>
    <div class="flex flex-col justify-center items-center pt-32">
        <div class=" flex flex-col px-5 max-w-lg w-full ">
            <h1 class="lg:text-3xl text-2xl tracking-tight font-bold mb-2">{{ $t('form.completeRegistration.title') }}
            </h1>
            <p class="text-muted-foreground mb-6">{{ $t('form.completeRegistration.subtitle') }}</p>

            <form @submit="onSubmit" class="w-full space-y-4">
                <FormField v-slot="{ componentField }" name="username">
                    <FormItem>
                        <FormLabel>{{ $t('common.forms.username') }}</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" :placeholder="$t('common.forms.username')"
                                class="!bg-card" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="password">
                    <FormItem>
                        <FormLabel>{{ $t('common.forms.password') }}</FormLabel>
                        <FormControl>
                            <InputPassword class="bg-card" v-bind="componentField"
                                :placeholder="$t('common.forms.password')" autocomplete="current-password" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="repeatPassword">
                    <FormItem>
                        <FormLabel>{{ $t('common.forms.repeatPassword') }}</FormLabel>
                        <FormControl>
                            <InputPassword class="bg-card" v-bind="componentField"
                                :placeholder="$t('common.forms.repeatPassword')" autocomplete="current-password" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <Button type="submit" :disabled="isPending" class="w-full">
                    {{ isPending ? $t('form.completeRegistration.creatingAccount') :
                        $t('form.completeRegistration.submit') }}
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
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { createSignUpSchema } from '@/schemas/signUpSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { InputPassword } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useConfirmSignUpMutation, useSignInMutation } from '@/composables/useAuthQuery';
import { getQueryValue } from '@/lib/utils/router';

const { t } = useI18n();
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
                toast.success(t('form.completeRegistration.title'));
                signIn(
                    { login: email.value, password: values.password },
                    {
                        onSuccess: () => {
                            router.push('/');
                        },
                        onError: () => {
                            toast.error(t('common.errors.loginFailed', { message: t('common.failed') }));
                            router.push('/sign-in');
                        },
                    }
                );
            } else {
                toast.error(t('common.failed'));
            }
        },
        onError: (error) => {
            toast.error(t('common.errors.signupFailed', { message: error.message }));
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