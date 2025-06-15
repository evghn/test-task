<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import TaskForm from '@/components/TaskForm.vue'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()

const task = computed(() => {
    return tasksStore.getTaskById(parseInt(route.params.id))
})

const handleSubmit = async (taskData) => {
    try {
        await tasksStore.updateTask(taskData)
        router.push('/tasks')
    } catch (error) {
        console.error('Error updating task:', error)
    }
}

const handleCancel = () => {
    router.push('/tasks')
}
</script>

<template>
    <div class="max-w-md mx-auto p-4">
        <TaskForm :task="task" submit-text="Update" @submit="handleSubmit" @cancel="handleCancel" />
    </div>
</template>