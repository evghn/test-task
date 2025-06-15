<script setup>
import { ref, onMounted } from 'vue'
import SearchFilter from '@/components/SearchFilter.vue'
import TaskTree from '@/components/TaskTree.vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'

const router = useRouter()
const tasksStore = useTasksStore()
const searchQuery = ref('')
const isLoading = ref(true)

onMounted(async () => {
  try {
    await tasksStore.getTasks()
  } catch (error) {
    console.error('Error loading tasks:', error)
  } finally {
    isLoading.value = false
  }
})

const handleSearch = (value) => {
  searchQuery.value = value
}
</script>

<template>
  <div class="mx-auto max-w-[1200px] p-4">
    <div class="bg-white rounded-lg shadow-md p-4 w-full flex items-center gap-4">
      <button @click="router.push({ name: 'new-task' })"
        class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center gap-2 whitespace-nowrap btn">
        Создать задачу
      </button>
      <SearchFilter @search="handleSearch" />
    </div>

    <div class="bg-white rounded-lg shadow-md mt-5 p-4 w-full min-h-[300px]">
      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      <TaskTree v-else :search-term="searchQuery" />
    </div>
  </div>
</template>