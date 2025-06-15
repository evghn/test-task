<script setup>
import { ref, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useUIStore } from '@/stores/ui'

const props = defineProps({
    task: {
        type: Object,
        required: true
    },
    level: {
        type: Number,
        default: 0
    },
    searchTerm: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['task-moved'])

const tasksStore = useTasksStore()
const uiStore = useUIStore()

// Состояние
const dragState = ref({
    isDragging: false,
    isDragOver: false,
    isChildDragOver: false
})
const isExpanded = ref(false)

// Вычисляемые свойства
const children = computed(() => tasksStore.getChildren(props.task.id))
const hasChildren = computed(() => children.value.length > 0)
const isHighlighted = computed(() =>
    props.searchTerm &&
    props.task.title.toLowerCase().includes(props.searchTerm.toLowerCase())
)

// Drag-and-drop методы
const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', props.task.id)
    dragState.value.isDragging = true
    setTimeout(() => {
        e.target.classList.add('opacity-30')
    }, 0)
}

const handleDragEnd = (e) => {
    dragState.value.isDragging = false
    e.target.classList.remove('opacity-30')
}

const handleDragOver = (e) => {
    e.preventDefault()
    dragState.value.isDragOver = true
    e.dataTransfer.dropEffect = 'move'
}

const handleDragLeave = () => {
    dragState.value.isDragOver = false
    dragState.value.isChildDragOver = false
}

const handleDrop = async (e) => {
    e.preventDefault()
    dragState.value.isDragOver = false

    const draggedTaskId = e.dataTransfer.getData('text/plain')
    if (draggedTaskId === props.task.id) return

    try {
        await tasksStore.moveTask(draggedTaskId, props.task.id)
        emit('task-moved')
    } catch (error) {
        console.error('Error moving task:', error)
    }
}

const handleChildrenDragOver = (e) => {
    e.preventDefault()
    dragState.value.isChildDragOver = true
}

const handleChildrenDrop = async (e) => {
    e.preventDefault()
    dragState.value.isChildDragOver = false

    const draggedTaskId = e.dataTransfer.getData('text/plain')
    if (draggedTaskId === props.task.id) return

    try {
        await tasksStore.moveTask(draggedTaskId, props.task.id)
        emit('task-moved')
    } catch (error) {
        console.error('Error moving task:', error)
    }
}
</script>

<template>
    <div class="relative">
        <!-- Task header -->
        <div :style="{ paddingLeft: `${level * 20 + 12}px` }" draggable="true" @dragstart="handleDragStart"
            @dragend="handleDragEnd" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop"
            @click="isExpanded = !isExpanded" class="flex items-center py-2 px-3 cursor-pointer transition-all" :class="{
                'bg-blue-100': dragState.isDragOver,
                'bg-yellow-100': isHighlighted,
                'hover:bg-gray-100': !dragState.isDragOver && !isHighlighted,
                'opacity-30': dragState.isDragging
            }">
            <!-- Toggle icon -->
            <span v-if="hasChildren"
                class="w-5 h-5 flex items-center justify-center mr-2 text-gray-500 transition-transform"
                :class="{ 'rotate-90': isExpanded }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </span>
            <span v-else class="w-5 h-5 mr-2"></span>

            <!-- Task title -->
            <span class="flex-grow truncate">
                {{ task.title }}
            </span>

            <!-- Drag handle -->
            <span class="w-4 h-4 text-gray-400 hover:text-gray-600 ml-2" @click.stop @mousedown.stop>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                </svg>
            </span>
        </div>

        <!-- Drop zone indicator -->
        <div v-if="dragState.isDragOver" class="absolute left-0 right-0 h-1 bg-blue-400 z-10"
            :style="{ top: `${level * 20 + 40}px` }"></div>

        <!-- Children container -->
        <div v-if="hasChildren && isExpanded" @dragover="handleChildrenDragOver" @dragleave="handleDragLeave"
            @drop="handleChildrenDrop" class="relative transition-all" :class="{
                'min-h-8 bg-blue-50': dragState.isChildDragOver
            }">
            <TaskItem v-for="child in children" :key="child.id" :task="child" :level="level + 1"
                :search-term="searchTerm" @task-moved="emit('task-moved')" />

            <!-- Child drop zone indicator -->
            <div v-if="dragState.isChildDragOver" class="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 z-10"></div>
        </div>
    </div>
</template>