<template>
    <AuthForm formKey="form.signUp" linkTo="/sign-in" :isLoading="isPending" :onSubmit="onSubmit">
        <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty('email')">
            <FormItem>
                <FormLabel>{{ $t('common.forms.email') }}</FormLabel>
                <FormControl>
                    <Input v-bind="componentField" :placeholder="$t('common.forms.email')" type="email"
                        autocomplete="email" class="!bg-card" />
                </FormControl>
                <FormMessage class="text-xs text-destructive" />
            </FormItem>
        </FormField>
    </AuthForm>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AuthForm from '@/components/auth/AuthForm.vue';
import { createSignUpEmailSchema } from '@/schemas/signUpSchema';
import { useSignUpMutation } from '@/composables/useAuthQuery';

const router = useRouter();
const schema = createSignUpEmailSchema();
type FormValues = { email: string };

const { mutate: signUp, isPending } = useSignUpMutation();
const { handleSubmit, isFieldDirty } = useForm<FormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { email: '' },
});

const onSubmit = handleSubmit((values) => {
    signUp(values, {

        onSuccess: () => {
            toast.success('Check your email for a verification code');
            router.push({ path: '/sign-up/verify', query: { email: values.email } });
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        },

    });
});
</script>