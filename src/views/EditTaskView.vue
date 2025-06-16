<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import TaskForm from '@/components/TaskForm.vue'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()
const task = computed(() => tasksStore.getTaskById(parseInt(route.params.id)))

onMounted(async () => {
    await tasksStore.getTasks()
    task.value = tasksStore.getTaskById(Number(route.params.id))
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
    <div class="w-2/5 mx-auto p-4">
        <div class="mt-10 mb-5 pl-8 font-normal text-4xl text-[color:var(--color-text)]">
            Редактироване задачи
        </div>
        <TaskForm v-bind="task" submit-text="Update" @submit="handleSubmit" @cancel="handleCancel" />
    </div>

</template>