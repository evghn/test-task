<template>
  <div class="tasks-view">

    <RouterLink to="/tasks/new" class="new-task-link">
      Create New Task
    </RouterLink>

    <!-- <TaskTree /> -->

    <div class="container">
      <div class="management_block">
        <div class="btn">Создать задачу</div>
        <input type="search" class="search_input" placeholder="Поиск ....">
      </div>
      <div class="tasks_block">
        <h3 class="tasks_header">Список ваших задач</h3>
        <div class="tasks_container">

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//   import TaskTree from '@/components/TaskTree.vue'
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

.container {
  flex-direction: column;
  align-items: center;

  margin: 0 auto;
  width: clamp(200px, 90%, 1200px);
  justify-content: center;
  display: flex;
}



.management_block {
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  /* flex-wrap: wrap;/ */
}

.a-c {
  align-items: center;
}

.tasks_header {
  color: #2b2b2b;
}
</style>
