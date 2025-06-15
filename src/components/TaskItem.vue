<script setup>
import { ref, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useUIStore } from '@/stores/ui'

const props = defineProps({
    task: Object,
    level: Number,
    searchTerm: String
})

const emit = defineEmits(['task-moved', 'edit-task'])

const tasksStore = useTasksStore()
const uiStore = useUIStore()

// Состояние


const dragState = ref({
    isDragging: false,
    isDragOver: false
})

// Вычисляемые свойства
const children = computed(() => tasksStore.getChildren(props.task.id))
const hasChildren = computed(() => children.value.length > 0)
const isExpanded = computed(() => uiStore.isTaskExpanded(props.task.id))
const isHighlighted = computed(() =>
    props.searchTerm &&
    props.task.title.toLowerCase().includes(props.searchTerm.toLowerCase())
)

// Методы
const toggleExpand = () => {
    uiStore.toggleTaskExpansion(props.task.id)
}

const handleDoubleClick = () => {
    if (hasChildren.value) {
        toggleExpand()
    }
}
const editTask = () => {
    router.push(`/tasks/${props.task.id}/edit`)
}

const deleteTask = async () => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        try {
            await tasksStore.deleteTask(props.task.id)
        } catch (error) {
            console.error('Error deleting task:', error)
        }
    }
}

// Drag-and-drop методы
const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', props.task.id)
    dragState.value.isDragging = true
}

const handleDragEnd = () => {
    dragState.value.isDragging = false
}

const handleDragOver = (e) => {
    e.preventDefault()
    dragState.value.isDragOver = true
}

const handleDragLeave = () => {
    dragState.value.isDragOver = false
}

const handleDrop = async (e) => {
    e.preventDefault()
    dragState.value.isDragOver = false

    const draggedTaskId = e.dataTransfer.getData('text/plain')
    if (draggedTaskId === props.task.id) return

    await tasksStore.moveTask(draggedTaskId, props.task.id)
    emit('task-moved')
}
</script>

<template>
    <div class="relative">
        <!-- Task header -->
        <div :style="{ paddingLeft: `${level * 20 + 12}px` }" draggable="true" @dragstart="handleDragStart"
            @dragend="handleDragEnd" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop"
            @dblclick="handleDoubleClick" class="flex items-center py-2 px-3 cursor-pointer transition-all group"
            :class="{
                'bg-blue-50': dragState.isDragOver,
                'bg-yellow-100': isHighlighted,
                'hover:bg-gray-100': !dragState.isDragOver && !isHighlighted
            }">
            <!-- Toggle icon -->
            <span v-if="hasChildren" @click.stop="toggleExpand"
                class="w-5 h-5 flex items-center justify-center mr-2 text-gray-500 transition-transform"
                :class="{ 'rotate-90': isExpanded }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </span>
            <span v-else class="w-5 h-5 mr-2"></span>


            <!-- Task title (view mode) -->
            <span class="flex-grow">
                {{ task.title }}
            </span>
            <div v-if="dragState.isDragOver" class="absolute inset-x-0 h-0.5 bg-blue-500 z-10"
                :style="{ top: level * 20 + 44 + 'px' }">
            </div>
            <!-- Actions -->
            <div class="flex items-center space-x-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click.stop="editTask" class="text-gray-500 hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button @click.stop="deleteTask" class="text-gray-500 hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Children -->
        <div v-if="hasChildren && isExpanded" class="ml-2">
            <TaskItem v-for="child in children" :key="child.id" :task="child" :level="level + 1"
                :search-term="searchTerm" @task-moved="$emit('task-moved')" @edit-task="$emit('edit-task', $event)" />
        </div>
    </div>
</template>