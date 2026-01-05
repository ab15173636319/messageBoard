import { ElMessage } from "element-plus";
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/modules/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/auth/:tab",
      name: "Auth",
      component: () => import("@/views/AuthView.vue"),
    },
    {
      path: "/message/:id/:reply?",
      name: "Message",
      component: () => import("@/views/MessageView.vue"),
    },
    {
      path: "/plan",
      name: "Plan",
      component: () => import("@/views/PlanView.vue"),
    },
    {
      path: "/user/:id",
      name: "User",
      component: () => import("@/views/UserView.vue"),
      redirect: (to) => ({ path: `/user/${to.params.id}/messages` }),
      children: [
        {
          path: "remarks",
          name: "UserRemarks",
          component: () => import("@/views/user/RemarkView.vue"),
        },
        {
          path: "messages",
          name: "UserMessages",
          component: () => import("@/views/user/MessageManage.vue"),
        },
        {
          path: "avatar",
          name: "UserAvatar",
          component: () => import("@/views/user/AvatarManage.vue"),
        },
        {
          path: "profile",
          name: "UserProfile",
          component: () => import("@/views/user/Profile.vue"),
        },
        {
          path: "password",
          name: "UserPassword",
          component: () => import("@/views/user/ChangePassword.vue"),
        },
      ],
    },
    {
      path: "/manage",
      name: "Manage",
      component: () => import("@/views/ManageView.vue"),
      redirect: { name: "ManageMessages" },
      children: [
        {
          path: "messages",
          name: "ManageMessages",
          component: () => import("@/views/manage/MessageManage.vue"),
        },
        {
          path: "remarks",
          name: "ManageRemarks",
          component: () => import("@/views/manage/RemarkManage.vue"),
        },
        {
          path: "users",
          name: "ManageUsers",
          component: () => import("@/views/manage/UserManage.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
    },
  ],
});

// 路由切换前
router.beforeEach(() => {
  document.body.style.overflow = "hidden";
});

// 路由切换后
router.afterEach(() => {
  setTimeout(() => {
    document.body.style.overflow = "";
  }, 550);
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.path.startsWith("/manage")) {
    if (userStore.userInfo?.role !== "admin") {
      ElMessage.error("您没有权限访问该页面！");
      next({
        name: "Home",
      });
      return;
    }
    next();
    return;
  }
  next();
});

export default router;
