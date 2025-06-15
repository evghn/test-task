<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import TaskTree from '@/components/TaskTree.vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
    authStore.logout()
}
</script>

<template>
    <div class="max-w-4xl mx-auto p-4">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Task Manager</h1>
            <div class="flex space-x-3">
                <RouterLink to="/tasks/new"
                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Task
                    </span>
                </RouterLink>
                <button @click="handleLogout"
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                    Logout
                </button>
            </div>
        </div>

        <TaskTree />
    </div>
</template>
