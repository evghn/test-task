<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import { useUIStore } from '@/stores/ui'
import TaskTree from '@/components/TaskTree.vue'

const router = useRouter()
const route = useRoute()
const tasksStore = useTasksStore()
const uiStore = useUIStore()

const selectedTask = ref(null)
const searchTerm = ref('')

onMounted(async () => {
    await tasksStore.getTasks()
    if (route.query.taskId) {
        selectedTask.value = tasksStore.getTaskById(Number(route.query.taskId))
    }
})

const filteredTasks = computed(() => {
    if (!searchTerm.value) return tasksStore.rootTasks

    const searchLower = searchTerm.value.toLowerCase()
    const matchedTasks = new Set()

    const searchInTree = (tasks) => {
        tasks.forEach(task => {
            if (task.title.toLowerCase().includes(searchLower)) {
                matchedTasks.add(task.id)
                let parentId = task.parent_id
                while (parentId) {
                    const parent = tasksStore.getTaskById(parentId)
                    if (parent) {
                        matchedTasks.add(parent.id)
                        uiStore.expandTask(parent.id)
                        parentId = parent.parent_id
                    } else {
                        parentId = null
                    }
                }
            }
            searchInTree(tasksStore.getChildren(task.id))
        })
    }

    searchInTree(tasksStore.rootTasks)
    return tasksStore.rootTasks.filter(task => matchedTasks.has(task.id))
})

const handleTaskSelect = (task) => {
    selectedTask.value = task
}

const confirmSelection = () => {
    if (!selectedTask.value) return

    const query = {
        parentId: selectedTask.value.id,
        ...Object.fromEntries(
            Object.entries(route.query)
                .filter(([key]) => !['taskId', 'parentId'].includes(key))
        )
    }

    router.push({
        name: route.query.redirect || 'task-create',
        query
    })
}
</script>

<template>
    <div class="p-4 max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Выберите родительскую задачу</h2>
            <div class="flex space-x-2">
                <button @click="router.go(-1)"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    Отмена
                </button>
                <button @click="confirmSelection" :disabled="!selectedTask"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                    Подтвердить
                </button>
            </div>
        </div>

        <!-- Selected task info -->
        <div v-if="selectedTask" class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p class="text-sm font-medium text-gray-700">
                Выбрано: <span class="text-blue-600 font-semibold">{{ selectedTask.title }}</span>
            </p>
        </div>

        <!-- Search -->
        <input v-model="searchTerm" placeholder="Поиск задач..."
            class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition">

        <!-- Task tree -->
        <TaskTree :tasks="filteredTasks" :selected-task-id="selectedTask?.id" :search-term="searchTerm" selectable
            @select="handleTaskSelect" />
    </div>
</template>