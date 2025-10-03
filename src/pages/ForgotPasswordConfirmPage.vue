<template>
    <div class="flex flex-col justify-center items-center pt-32">
        <div class="flex flex-col px-5 max-w-lg w-full">
            <h1 class="text-2xl font-bold mb-2">{{ $t('common.forms.password') }}</h1>
            <p class="text-muted-foreground mb-6">{{ $t('common.messages.setCredentials') }}</p>

            <form @submit="onSubmit" class="w-full space-y-4">
                <FormField v-slot="{ componentField }" name="newPassword">
                    <FormItem>
                        <FormLabel>{{ $t('common.forms.password') }}</FormLabel>
                        <FormControl>
                            <Input type="password" v-bind="componentField" :placeholder="$t('common.forms.password')"
                                class="!bg-card" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="confirmNewPassword">
                    <FormItem>
                        <FormLabel>{{ $t('common.forms.repeatPassword') }}</FormLabel>
                        <FormControl>
                            <Input type="password" v-bind="componentField"
                                :placeholder="$t('common.forms.repeatPassword')" class="!bg-card" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <Button type="submit" :disabled="isPending" class="w-full">
                    {{ isPending ? $t('common.creating') : $t('form.forgotPassword.submit') }}
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { createForgotPasswordConfirmSchema } from '@/schemas/forgotPasswordSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useConfirmResetPasswordMutation } from '@/composables/useAuthQuery';
import { getQueryValue } from '@/lib/utils/router';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const email = ref('');
const token = ref('');

onMounted(() => {
    const emailParam = getQueryValue(route.query.email);
    const tokenParam = getQueryValue(route.query.token);
    if (!emailParam || !tokenParam) {
        router.push('/forgot-password');
        return;
    }
    email.value = emailParam;
    token.value = tokenParam;
});

const schema = createForgotPasswordConfirmSchema();
type FormValues = {
    newPassword: string;
    confirmNewPassword: string;
};

const { mutate: confirmReset, isPending } = useConfirmResetPasswordMutation();
const { handleSubmit } = useForm<FormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { newPassword: '', confirmNewPassword: '' },
});

const onSubmit = handleSubmit((values) => {
    confirmReset({
        email: email.value,
        token: token.value,
        password: values.newPassword,
        repeat_password: values.confirmNewPassword,
    }, {
        onSuccess: (data) => {
            if (data.verified) {
                toast.success(t('common.messages.checkEmail'));
                router.push('/sign-in');
            } else {
                toast.error(t('common.failed'));
            }
        },
        onError: (error) => {
            toast.error(t('common.errors.resetFailed', { message: error.message }));
        },
    });
});
</script>