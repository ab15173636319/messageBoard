<template>
    <div class="manage-view">
        <div class="sidebar">
            <div v-for="item in manageList" :key="item.name"
                :class="['menu-item', { active: isActive(item.routeName) }]" @click="handleMenuClick(item)">
                <el-icon class="menu-icon">
                    <component :is="getIconComponent(item.icon)" />
                </el-icon>
                <span class="menu-text">{{ item.name }}</span>
            </div>
            <div class="menu-item logout" @click="handleBack">
                <el-icon class="menu-icon">
                    <ArrowLeft />
                </el-icon>
                <span class="menu-text">返回首页</span>
            </div>
        </div>
        <div class="content">
            <Transition name="manage">
                <RouterView />
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChatLineRound, UserFilled, ArrowLeft } from '@element-plus/icons-vue'
import { manageList } from '@/config/manage'

const router = useRouter()
const route = useRoute()

// 图标映射
const iconMap: Record<string, any> = {
    ChatLineRound,
    UserFilled,
}

// 获取图标组件
const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || ChatLineRound
}

// 判断当前路由是否激活
const isActive = (routeName: string) => {
    return route.name === routeName
}

// 处理菜单点击
const handleMenuClick = (item: { routeName: string }) => {
    router.push({ name: item.routeName })
}

// 返回首页
const handleBack = () => {
    router.push({ name: 'Home' })
}
</script>

<style scoped>
@reference "../App.css";

.manage-view {
    @apply w-full h-[calc(100vh-64px)] flex p-5 gap-5;
}

.sidebar {
    @apply w-48 flex flex-col gap-3;
}

.menu-item {
    @apply flex items-center gap-3 p-4 bg-gray-50 font-bold rounded-md shadow-md cursor-pointer;
    @apply transition-all duration-200;
    @apply hover:bg-gray-100 hover:shadow-lg;
}

.menu-item.active {
    @apply bg-blue-500 text-white;
    @apply hover:bg-blue-600;
}

.menu-item.logout {
    @apply mt-auto bg-gray-100 text-gray-700;
    @apply hover:bg-gray-200;
}

.menu-icon {
    @apply text-lg;
}

.menu-text {
    @apply flex-1;
}

.content {
    @apply flex-1 overflow-auto;
}

/* 过渡动画 */
.manage-enter-active,
.manage-leave-active {
    transition: all 0.3s ease;
}

.manage-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.manage-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

/* 移动端适配 */
@media (max-width: 768px) {
    .manage-view {
        @apply flex-col p-3 gap-3;
    }

    .sidebar {
        @apply w-full flex-row overflow-x-auto;
    }

    .menu-item {
        @apply shrink-0 min-w-[120px];
    }

    .menu-item.logout {
        @apply mt-0;
    }
}
</style>