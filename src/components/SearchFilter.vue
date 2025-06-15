<script setup>
import { ref, onUnmounted } from 'vue'
import SearchIcon from '@/assets/icon/SearchIcon.vue'

const searchQuery = ref('')
const emit = defineEmits(['search'])

let debounceTimer = null

const handleSearchInput = () => {
    // Очищаем предыдущий таймер
    clearTimeout(debounceTimer)

    // Устанавливаем новый таймер
    debounceTimer = setTimeout(() => {
        emit('search', searchQuery.value.trim())
    }, 300)
}

// Очищаем таймер при размонтировании компонента
onUnmounted(() => {
    clearTimeout(debounceTimer)
})
</script>

<template>
    <div class="relative w-full">
        <input type="text" v-model="searchQuery" placeholder="Поиск задач..."
            class="w-full pl-5 p-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="handleSearchInput">
        <div class="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
            <SearchIcon class="h-7 w-7" />
        </div>
    </div>
</template>