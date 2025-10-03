<template>
    <div class="flex flex-col justify-center items-center pt-32">
        <div class=" flex flex-col px-5 max-w-lg w-full ">
            <h1 class="text-2xl font-bold mb-2">{{ $t('form.verifyEmail.title') }}</h1>
            <p class="text-muted-foreground mb-6">{{ $t('form.verifyEmail.subtitle', { email }) }}</p>

            <form @submit="onSubmit" class="w-full space-y-4">
                <FormField v-slot="{ componentField, value }" name="token" :validate-on-blur="!isFieldDirty('token')">
                    <FormItem>
                        <FormControl>
                            <PinInput id="pin-input" :model-value="value" placeholder="○"
                                class="flex items-center justify-center mb-1" otp type="number"
                                :name="componentField.name" @update:model-value="(arrStr) => {
                                    setFieldValue('token', arrStr as unknown as string)
                                }">
                                <PinInputGroup>
                                    <template v-for="(id, index) in 6" :key="id">
                                        <PinInputSlot class="rounded-md border  bg-background" :index="index" />
                                        <template v-if="index !== 5">
                                            <PinInputSeparator />
                                        </template>
                                    </template>
                                </PinInputGroup>
                            </PinInput>
                        </FormControl>
                        <FormMessage class="text-xs text-destructive" />
                    </FormItem>
                </FormField>

                <Button type="submit" :disabled="isPending" class="w-full">
                    {{ isPending ? $t('common.verifying') : $t('form.verifyEmail.submit') }}
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
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { createSignUpVerifySchema } from '@/schemas/signUpSchema';
import { useVerifySignUpMutation } from '@/composables/useAuthQuery';
import { getQueryValue } from '@/lib/utils/router';
import {
    PinInput,
    PinInputGroup,
    PinInputSeparator,
    PinInputSlot,
} from "@/components/ui/pin-input"

const { t } = useI18n();
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
const { handleSubmit, setFieldValue, isFieldDirty } = useForm<FormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { token: '' },
});

const onSubmit = handleSubmit((values) => {
    if (!Array.isArray(values.token)) {
        console.error('Invalid token format:', values.token);
        toast.error(t('validation.token.invalid'));
        return;
    }

    const tokenString = (values.token as string[]).join('');
    verifySignUp({ email: email.value, token: tokenString }, {
        onSuccess: (data) => {
            if (data.verified) {
                toast.success(t('common.messages.setCredentials'));
                router.push({
                    path: '/sign-up/confirm',
                    query: { email: email.value, token: tokenString }
                });
            } else {
                toast.error(t('common.invalidCode'));
            }
        },
        onError: (error) => {
            toast.error(t('common.errors.signupFailed', { message: error.message }));
        },
    });
});
</script>