    <script setup>
    import { RouterView } from "vue-router";
    import NavBar from "./components/NavBar.vue";
</script>
<template>
  <div class="main">
    <NavBar />
    <RouterView />
  </div>
</template>
