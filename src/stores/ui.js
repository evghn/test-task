import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUIStore = defineStore("ui", () => {
  // Состояния
  const expandedTasks = ref(new Set());
  const error = ref(null);
  const selectedTaskPath = ref([]);
  const lastSearchResults = ref(new Map());

  // Геттеры
  const isTaskExpanded = computed(() => (taskId) => {
    return expandedTasks.value.has(taskId);
  });

  const getSelectedPath = computed(() => {
    return selectedTaskPath.value;
  });

  // Действия
  const toggleTask = (taskId) => {
    if (expandedTasks.value.has(taskId)) {
      expandedTasks.value.delete(taskId);
    } else {
      expandedTasks.value.add(taskId);
    }
  };

  const expandTask = (taskId) => {
    expandedTasks.value.add(taskId);
  };

  const collapseTask = (taskId) => {
    expandedTasks.value.delete(taskId);
  };

  const expandTaskParents = (taskId, tasksStore) => {
    let parentId = tasksStore.getTaskById(taskId)?.parent_id;
    while (parentId) {
      expandTask(parentId);
      parentId = tasksStore.getTaskById(parentId)?.parent_id;
    }
  };

  const searchInTree = (tasks, searchTerm, tasksStore) => {
    const searchLower = searchTerm.toLowerCase();
    const matchedTasks = new Set();

    const searchRecursive = (taskList) => {
      taskList.forEach((task) => {
        const isMatch = task.title.toLowerCase().includes(searchLower);
        const children = tasksStore.getChildren(task.id);

        if (isMatch) {
          matchedTasks.add(task.id);
          expandTaskParents(task.id, tasksStore);
        }

        if (children.length) {
          searchRecursive(children);
        }
      });
    };

    searchRecursive(tasks);
    lastSearchResults.value.set(searchTerm, matchedTasks);
    return matchedTasks;
  };

  const getCachedSearchResults = (searchTerm) => {
    return lastSearchResults.value.get(searchTerm.toLowerCase()) || new Set();
  };

  const setSelectedPath = (path) => {
    selectedTaskPath.value = path;
  };

  const clearSelectedPath = () => {
    selectedTaskPath.value = [];
  };

  const setError = (message) => {
    error.value = message;
    setTimeout(() => {
      error.value = null;
    }, 5000);
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    expandedTasks,
    error,
    selectedTaskPath,
    lastSearchResults,

    isTaskExpanded,
    getSelectedPath,

    toggleTask,
    expandTask,
    collapseTask,
    expandTaskParents,
    searchInTree,
    getCachedSearchResults,
    setSelectedPath,
    clearSelectedPath,
    setError,
    clearError,
  };
});
