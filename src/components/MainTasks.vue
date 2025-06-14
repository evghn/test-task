<template>
  <div class="tasks-view">
    <RouterLink to="/tasks/new" class="new-task-link">
      Create New Task
    </RouterLink>
    <!-- <TaskTree /> -->
  </div>
</template>

<script setup>
// import TaskTree from '@/components/TaskTree.vue'
</script>

<style scoped>
.tasks-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.new-task-link {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>
