<script setup>
import { reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const form = ref({
    login: "",
    password: "",
});
const errorForm = ref("");
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
            console.log(response)
            if (response) {

                router.push("/tasks");
            } else {
                console.log(response)
            }
        } catch (err) {
            errorForm.value = auth.error
            console.log(auth.error)
        }
    }
};
</script>
<template>
    <div class="auth-view">
        <h1>Авторизация</h1>
        <form @submit.prevent="formSubmit()">
            <div class="form-group">
                <label class="label">
                    Логин
                    <input v-model="form.login" @blur="v$.login.$touch" :class="v$.login.$error ? 'is-invalid' : ''" />
                </label>
                <span v-if="v$.login.$error" class="error-message">
                    Логин обязателен для заполнения
                </span>
            </div>

            <div class="form-group">
                <label class="label">
                    Пароль
                    <input v-model="form.password" type="password" @blur="v$.password.$touch"
                        :class="v$.password.$error ? 'is-invalid' : ''" />
                </label>
                <span v-if="v$.password.$error" class="error-message">
                    Пароль обязателен для заполнения
                </span>
            </div>
            <div v-if="errorForm" class="error-message">
                {{ errorForm }}
            </div>

            <div class="form-actions">
                <button type="submit" class="btn">Вход</button>
            </div>

        </form>
    </div>
</template>
<style scoped>
.auth-view {
    width: 654px;
    margin: 5% auto;
    /* height: 661px; */
    background-color: var(--color-main-white);
    border-radius: var(--border-radius);
    padding: 50px 70px;
}

h1 {
    color: var(--color-text-h);
    text-align: center;
    margin-bottom: 50px;
    font-weight: 600;
}

.btn {
    display: block;
    margin: 40px auto;
}
</style>
