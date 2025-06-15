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
    console.log("task load");
    console.log("Текущий статус авторизации", {
      isGuest: auth.isGuest,
      token: auth.token, // если используется
    });
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
    isLoading.value = true;
    try {
      const response = await http.put(
        `${API_URLS.tasks}/${taskData.id}`,
        taskData
      );
      const index = tasks.value.findIndex((t) => t.id === taskData.id);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      throw err;
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
    if (newParentId && isDescendant(taskId, newParentId)) {
      error.value = "Cannot move task to its own descendant";
      throw new Error(error.value);
    }

    const task = getTaskById(taskId);
    if (!task) {
      error.value = "Task not found";
      throw new Error(error.value);
    }

    return await updateTask({
      ...task,
      parent_id: newParentId,
    });
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
