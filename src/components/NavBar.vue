<script setup>
import router from "@/router";
import { useAuthStore } from "@/stores/auth";



const auth = useAuthStore();
const logout = async () => {
    const response = await auth.logout();
    if (response) {
        router.push("login");
    }
}    
</script>
<template>
    <div class="nav d-flex gap-3 justify-content-beetween ">
        <div>
            Иерархический менеджер задач
        </div>
        <div>
            <a v-if="!auth.isGuest" class="link" @click="logout()">Выход ({{ auth.user.login }})</a>
        </div>
    </div>
</template>
<style scoped>
.nav {
    background-color: var(--color-bg-nav);
    width: 100%;
    border-bottom: 2px solid var(--color-border-nav);
    color: var(--color-main-white);
    padding: 20px 30px;
    font-size: 24px;
}
</style>
