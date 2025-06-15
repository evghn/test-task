<script setup>

import { reactive, computed, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useTasksStore } from '@/stores/tasks'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const tasksStore = useTasksStore()

// Реактивные данные
const currentPath = reactive([]) // Хранит выбранный путь в иерархии

const form = reactive({
    title: '',
    parent_id: null // ID родительской задачи
})

const rules = {
    title: { required }
}

const v$ = useVuelidate(rules, form)

// Вычисляемые свойства
const isLoading = computed(() => tasksStore.isLoading)

// Методы
const openTaskTree = () => {
    // Передаем текущий путь как начальное состояние
    router.push({
        name: 'task-tree-select',
        query: {
            returnRoute: route.name,
            selectedPath: JSON.stringify(currentPath.map(item => item.id))
        }
    })
}

const handleSubmit = async () => {
    v$.value.$validate()

    if (!v$.value.$invalid) {
        try {
            await tasksStore.createTask({
                title: form.title,
                parent_id: currentPath.length ? currentPath[currentPath.length - 1].id : null
            })
            await tasksStore.getTasks()
            router.push({ name: 'tasks' }) // Переход после успешного создания
        } catch (error) {
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach(err => {
                    v$.value[err.field].$errors.push({ $message: err.message })
                })
            }
        }
    }
}

const handleCancel = () => {
    router.go(-1)
}

// Хуки
onMounted(async () => {
    if (!tasksStore.tasks.length) {
        await tasksStore.getTasks()
    }

    // Инициализация пути из параметров маршрута
    if (route.query.selectedPath) {
        try {
            const pathIds = JSON.parse(route.query.selectedPath)
            pathIds.forEach(id => {
                const task = tasksStore.getTaskById(id)
                if (task) currentPath.push(task)
            })

            if (currentPath.length) {
                form.parent_id = currentPath[currentPath.length - 1].id
            }
        } catch (e) {
            console.error('Ошибка парсинга пути:', e)
        }
    }
})

</script>


<template>
    <div class="flex justify-center items-center  p-5 ">
        <!-- Основной блок с фоном #F5F6FF -->
        <div class="bg-[color:var(--color-bg-white-block)] rounded-xl p-8 w-full max-w-2xl shadow-md">
            <div class="font-normal text-xl text-[color:var(--color-text)] mb-3">
                Путь:
            </div>
            <!-- 1. Хлебные крошки с кнопкой выбора пути -->
            <div class="mb-6">

                <div class="flex items-center flex-wrap gap-2 mb-2">
                    <span>/</span>
                    <div v-if="currentPath.length">
                        <span v-for="(item, index) in currentPath" :key="index"
                            class="flex items-center text-gray-800 text-xl">
                            {{ item.title || 'Главная' }}
                        </span>
                    </div>
                    <div v-else>
                        <span class="items-center text-gray-800 text-xl">
                            Главная
                        </span>
                    </div>
                    <span>/</span>
                </div>
                <button @click="openTaskTree" class="block text-sm hover:text-[#0F3AA0] btn d-block">
                    {{ currentPath.length ? 'Изменить путь' : 'Выбрать расположение' }}
                </button>
                <div v-if="currentPath.length" class="text-xs text-gray-500">
                    Новая задача будет создана внутри: "{{ currentPath[currentPath.length - 1].title }}"
                </div>
            </div>

            <!-- Форма создания задачи -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Поле ввода названия -->
                <div class="my-16">
                    <label for="title" class="block text-2xl font-medium text-gray-700 mb-1">Название задачи <span
                            class="text-red-400">*</span></label>
                    <input id="title" v-model="form.title" type="text"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[color(var([--color-text)] focus:ring-2 focus:ring-[color(var([--color-text)]/10 transition-all"
                        :class="{ 'border-red-500': v$.title.$error }" @blur="v$.title.$touch"
                        placeholder="Введите название новой задачи">
                    <span v-if="v$.title.$error" class="text-xl text-red-500 mt-1">
                        Название обязательно
                    </span>
                </div>

                <!-- Кнопки действий -->
                <div class="flex justify-between space-x-4 pt-4">
                    <button type="button" @click="handleCancel"
                        class="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors text-2xl font-bold">
                        Отмена
                    </button>
                    <button type="submit" :disabled="v$.$invalid"
                        class="px-6 py-3 bg-[#1349BE] text-white rounded-lg hover:bg-[#0F3AA0] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-2xl font-bold btn">
                        Создать
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>