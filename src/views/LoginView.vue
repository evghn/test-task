<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const form = ref({
    login: "user",
    password: "123",
});

const errorForm = computed(() => {
    if (v$.value.$invalid) {
        auth.error = "";
    }
    return auth.error;
});
const rules = {
    login: { required },
    password: { required },
};

const v$ = useVuelidate(rules, form.value);

const formSubmit = async () => {
    v$.value.$touch();
    if (!v$.value.$invalid) {
        try {
            const response = await auth.login(form.value);
            if (response.status == 200) {
                router.push("/tasks");
            }
        } catch (err) { }
    }
};
</script>
<template>
    <div class="max-w-[654px] mx-auto mt-20 bg-white rounded-lg p-12">
        <h1 class="text-3xl font-semibold text-gray-800 text-center mb-12">Авторизация</h1>

        <form @submit.prevent="formSubmit()" class="space-y-6">
            <div>
                <label class="block text-xl text-sm font-medium text-gray-700 mb-1">
                    Логин
                    <input v-model="form.login" @blur="v$.login.$touch" :class="[
                        'w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors',
                        v$.login.$error ? 'is-invalid' : 'border-gray-300 '
                    ]" />
                </label>
                <span v-if="v$.login.$error" class="text-red-500 text-sm-2 mt-1 block">
                    Логин обязателен для заполнения
                </span>
            </div>

            <div>
                <label class="block text-xl font-medium text-gray-700 mb-1">
                    Пароль

                    <input v-model="form.password" type="password" @blur="v$.password.$touch" :class="[
                        'w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
                        v$.password.$error ? 'is-invalid' : 'border-gray-300'
                    ]" /></label>
                <span v-if="v$.password.$error" class="text-red-500 text-sm-2 mt-1 block">
                    Пароль обязателен для заполнения
                </span>
            </div>

            <div v-if="errorForm" class="text-red-500 text-lx ">
                {{ errorForm }}
            </div>
            <div class="flex justify-center">
                <button type="submit"
                    class="text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 btn">
                    Вход
                </button>
            </div>
        </form>
    </div>
</template>