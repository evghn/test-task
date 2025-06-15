<script setup>
import { computed, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useUIStore } from '@/stores/ui'
import TaskItem from '@/components/TaskItem.vue'

const props = defineProps({
    searchTerm: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['task-moved', 'edit-task'])

const tasksStore = useTasksStore()
const uiStore = useUIStore()

// Автоматически раскрывать родительские элементы при поиске
watch(() => props.searchTerm, (term) => {
    if (!term) return

    const searchLower = term.toLowerCase()
    tasksStore.tasks.forEach(task => {
        if (task.title.toLowerCase().includes(searchLower)) {
            let parentId = task.parent_id
            while (parentId) {
                uiStore.expandTask(parentId)
                parentId = tasksStore.getTaskById(parentId)?.parent_id
            }
        }
    })
})

const filteredTasks = computed(() => {
    if (!props.searchTerm) return tasksStore.rootTasks

    const searchLower = props.searchTerm.toLowerCase()
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
</script>

<template>
    <div class="space-y-1">
        <div v-if="filteredTasks.length">
            <TaskItem v-for="task in filteredTasks" :key="task.id" :task="task" :level="0" :search-term="searchTerm"
                @task-moved="$emit('task-moved')" @edit-task="$emit('edit-task', $event)" />
        </div>
        <div v-else class="text-center py-10 text-gray-500">
            {{ searchTerm ? 'Задачи не найдены' : 'Нет задач для отображения' }}
        </div>
    </div>
</template>
