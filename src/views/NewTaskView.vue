<script setup>
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import TaskForm from '@/components/TaskForm.vue'

const router = useRouter()
const tasksStore = useTasksStore()

const handleSubmit = async (taskData) => {
    try {
        await tasksStore.addTask(taskData)
        router.push('/tasks')
    } catch (error) {
        console.error('Error creating task:', error)
    }
}

const handleCancel = () => {
    router.push('/tasks')
}
</script>

<template>
    <div class="w-2/5 mx-auto p-4">
        <div class="mt-10 mb-5 pl-8 font-normal text-4xl text-[color:var(--color-text)]">
            Создание задачи
        </div>
        <TaskForm submit-text="Create" @submit="handleSubmit" @cancel="handleCancel" />
    </div>
</template>
