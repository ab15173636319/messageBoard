<template>
    <div class="user-view">
        <div class="sidebar">
            <div v-for="item in menuItems" :key="item.name" :class="['menu-item', { active: isActive(item.routeName) }]"
                @click="handleMenuClick(item)">
                {{ item.name }}
            </div>
            <div class="menu-item logout" @click="handleLogout">退出登录</div>
        </div>
        <div class="content">
            <Transition name="user">
                <RouterView />
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
// ==================== 导入 ====================
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { ElMessageBox } from "element-plus";

// ==================== Store 和 Router 实例 ====================
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// ==================== 菜单配置 ====================
const menuItems = [
    {
        name: "留言管理",
        routeName: "UserMessages",
    },
    {
        name: "回复管理",
        routeName: "UserRemarks",
    },
    {
        name: "头像管理",
        routeName: "UserAvatar",
    },
    {
        name: "个人信息",
        routeName: "UserProfile",
    },
    {
        name: "修改密码",
        routeName: "UserPassword",
    },
];

// ==================== 计算属性 ====================
const userId = computed(() => route.params.id as string);

// ==================== 方法 ====================
const isActive = (routeName: string) => {
    return route.name === routeName;
};

const handleMenuClick = (item: { name: string; routeName: string }) => {
    router.push({
        name: item.routeName,
        params: { id: userId.value },
    });
};

const handleLogout = async () => {
    try {
        await ElMessageBox.confirm("确定要退出登录吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        });
        userStore.logout();
        router.push("/");
    } catch {
        // 用户取消操作
    }
};
</script>

<style scoped>
@reference "../App.css";

.user-view {
    @apply w-full min-h-[calc(100vh-64px)] flex p-5 gap-5;
}

.sidebar {
    @apply w-48 flex flex-col gap-3;
}

.menu-item {
    @apply p-4 bg-gray-50 font-bold rounded-md shadow-md cursor-pointer;
    @apply transition-all duration-200;
    @apply hover:bg-gray-100 hover:shadow-lg;
}

.menu-item.active {
    @apply bg-blue-500 text-white;
    @apply hover:bg-blue-600;
}

.menu-item.logout {
    @apply mt-auto bg-red-50 text-red-600;
    @apply hover:bg-red-100;
}

.content {
    @apply flex-1 overflow-auto;
}

/* 过渡动画 */
.user-enter-active,
.user-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from {
    transform: translateX(-100%);
}

.user-leave-to {
    transform: translateX(100%);
}
</style>
