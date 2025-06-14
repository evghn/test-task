<template>
  <div class="main">
    <div class="nav">Иерархический менеджер задач</div>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
</script>

<style>
.nav {
  background-color: var(--color-bg-nav);
  width: 100%;
  border-bottom: 2px solid var(--color-border-nav);
  color: var(--color-main-white);
  padding: 20px 30px;
  font-size: 32px;
}
</style>
