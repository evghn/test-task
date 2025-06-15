import { createRouter, createWebHistory } from "vue-router";
import MainTasks from "@/views/MainTasksView.vue";
import LoginView from "@/views/LoginView.vue";
import NewTaskView from "@/views/NewTaskView.vue";
import { useAuthStore } from "@/stores/auth";
import TaskTreeSelectView from "@/views/TaskTreeSelectView.vue";
import EditTaskView from "@/views/EditTaskView.vue";

const routes = [
  {
    path: "/tasks",
    name: "tasks",
    component: MainTasks,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/task-tree-select",
    name: "task-tree-select",
    component: TaskTreeSelectView,
    meta: { requiresAuth: true },
  },

  {
    path: "/tasks/new",
    name: "new-task",
    component: NewTaskView,
    meta: { requiresAuth: true },
  },
  {
    path: "/tasks/:id/edit",
    component: EditTaskView,
    name: "edit-task",
  },
  {
    path: "/",
    redirect: "tasks",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  // await auth.checkAuth();
  // console.log(auth.isGuest);

  // Если маршрут требует авторизации, а пользователь не авторизован → на /login
  if (to.meta.requiresAuth && auth.isGuest) {
    return next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }

  if (to.name === "login" && !auth.isGuest) {
    return next({ name: "tasks" });
  }

  // Во всех остальных случаях разрешаем переход
  next();
});

export default router;
