import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { http, API_URLS } from "@/api/http";
import { useAuthStore } from "./auth";

export const useTasksStore = defineStore("tasks", () => {
  const auth = useAuthStore();
  const tasks = ref([]);
  const error = ref(null);
  const isLoading = ref(false); // Добавлено состояние загрузки

  // Состояние для выбора родителя
  const parentSelection = ref({
    active: false,
    childId: null,
  });

  // Геттеры
  const rootTasks = computed(() => getChildren(null));

  const getTaskById = (id) => tasks.value.find((task) => task.id === id);

  const getChildren = (parentId) =>
    tasks.value.filter((task) => task.parent_id === parentId);

  // Оптимизированная проверка потомков
  const isDescendant = (parentId, childId) => {
    if (parentId === childId) return true;

    const children = getChildren(parentId);
    return children.some(
      (child) => child.id === childId || isDescendant(child.id, childId)
    );
  };

  // Основные действия
  const getTasks = async () => {
    if (auth.isGuest) return;
    isLoading.value = true;
    error.value = null;
    try {
      const response = await http.get(API_URLS.tasks);
      tasks.value = response.data.tasks || [];
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createTask = async (taskData) => {
    isLoading.value = true;
    try {
      const response = await http.post(API_URLS["task-add"], taskData);
      tasks.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateTask = async (taskData) => {
    console.log(taskData);
    try {
      isLoading.value = true;
      await http.patch(`${API_URLS.edit}`, taskData);
      await getTasks(); // Обновляем список
    } catch (error) {
      error.value = error.message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteTask = async (taskId) => {
    isLoading.value = true;
    try {
      await http.delete(`${API_URLS.tasks}/${taskId}`);
      tasks.value = tasks.value.filter(
        (task) => task.id !== taskId && task.parent_id !== taskId
      );
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const moveTask = async (taskId, newParentId) => {
    try {
      isLoading.value = true;
      await api.moveTask(taskId, newParentId);
      await getTasks(); // Обновляем список
    } catch (error) {
      error.value = error.message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Методы для работы с выбором родителя
  const startParentSelection = (taskId) => {
    parentSelection.value = {
      active: true,
      childId: taskId,
    };
  };

  const cancelParentSelection = () => {
    parentSelection.value = {
      active: false,
      childId: null,
    };
  };

  return {
    // Состояние
    tasks,
    error,
    isLoading,
    parentSelection,

    // Геттеры
    rootTasks,
    getTaskById,
    getChildren,
    isDescendant,

    // Действия
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    startParentSelection,
    cancelParentSelection,
  };
});
