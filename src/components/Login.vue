<script setup>
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  login: "user",
  password: "123",
});

const rules = {
  login: { required },
  password: { required },
};

const v$ = useVuelidate(rules, form);

const formSubmit = async () => {
  v$.value.$touch();
  if (!v$.value.$invalid) {
    try {
      console.log(form);
      await authStore.login(form);
      router.push("/tasks");
    } catch (error) {
      // Ошибка уже обработана в хранилище
    }
  }
};
</script>
<template>
  <div class="auth-view">
    <h1>Авторизация</h1>
    <form @submit.prevent="formSubmit">
      <div class="form-group">
        <label class="label">
          Логин
          <input v-model="form.login" required @blur="v$.login.$touch" />
        </label>
        <span v-if="v$.login.$error" class="error-message">
          Логин обязателен для заполнения
        </span>
      </div>

      <div class="form-group">
        <label class="label">
          Пароль
          <input
            v-model="form.password"
            type="password"
            required
            @blur="v$.password.$touch"
          />
        </label>
        <span v-if="v$.password.$error" class="error-message">
          Пароль обязателен для заполнения
        </span>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn" :disabled="v$.$invalid">Вход</button>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </form>
  </div>
</template>
<style scoped>
.auth-view {
  width: 654px;
  margin: 5% auto;
  height: 661px;
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
