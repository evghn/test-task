import { createRouter, createWebHistory } from "vue-router";
// import TasksView from "@/views/MainTasks.vue";
// import NewTaskView from "@/views/NewTaskView.vue";
// import EditTaskView from "@/views/EditTaskView.vue";
import { useAuthStore } from "@/stores/auth";
import Tasks  from '@/views/Tasks.vue'
import New  from '@/views/New.vue'
import Change  from '@/views/Change.vue'
import LoginView  from '@/views/LoginView.vue'
const routes = [
  {
    path: "/tasks",
    component: Tasks,
    name: "tasks",
    // meta: { requiresAuth: true },
  },
  {
    path: "/new",
    component: New,
    name: "new-task",
  },
  {
    path: "/change",
    component: Change,
    name: "change",
  },
  {
    path: "/login",
    name: "login",
    'component': LoginView
  },
  // {
  //   path: "/tasks/new",
  //   name: "new-task",
  //   component: NewTask,
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: "/tasks/:id/edit",
  //   name: "edit-task",
  //   component: EditTask,
  //   props: true,
  //   meta: { requiresAuth: true },
  // },

  {
    path: "/",
    redirect: (to) => {
      return {
        path: "/tasks",
        replace: true,
      };
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  console.log(authStore);
  // Проверяем авторизацию только если она требуется для маршрута
  if (to.meta.requiresAuth) {
    const isGuest = authStore.isGuest.value;
    if (!isGuest) {
      return next({
        name: "login",
        query: { redirect: to.fullPath },
        replace: true,
      });
    }
  }

  // Если пользователь авторизован и пытается зайти на страницу для гостей
  if (to.meta.requiresAuth && !authStore.isGuest) {
    return next({ name: "tasks" });
  }

  next();
});

export default router;
