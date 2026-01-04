<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Login from '../components/layout/Login.vue'
import Regiest from '../components/layout/Regiest.vue'

const route = useRoute()
const router = useRouter()
const tab = route.params.tab as 'login' | 'register'
const activeTab = ref<'login' | 'register'>(tab || 'login')

const switchTab = (tab: 'login' | 'register') => {
    activeTab.value = tab
    // 更新URL参数
    router.replace({
        name: 'Auth',
        params: { tab }
    })
}

const currentComponent = computed(() => {
    return activeTab.value === 'login' ? Login : Regiest
})

// 监听路由变化
watch(() => route.params.tab, (newTab) => {
    if (newTab === 'login' || newTab === 'register') {
        activeTab.value = newTab as 'login' | 'register'
    }
})
</script>

<template>
    <div class="auth-view">
        <div class="auth-background">
            <div class="background-shape shape-1"></div>
            <div class="background-shape shape-2"></div>
            <div class="background-shape shape-3"></div>
        </div>

        <div class="auth-container">
            <div class="logo-section">
                <div class="logo-wrapper">
                    <div class="logo-icon">💬</div>
                </div>
                <h1 class="app-title">留言板</h1>
                <p class="app-subtitle">连接你我，分享想法</p>
            </div>

            <div class="auth-tabs-container flex bg-white/30 backdrop-blur-sm my-5 rounded-md px-5 py-2 gap-5 ">
                <button class=" text-white" :class="{ active: activeTab === 'login' }"
                    @click="switchTab('login')">登录</button>
                <button class=" text-white" :class="{ active: activeTab === 'register' }"
                    @click="switchTab('register')">注册</button>
            </div>

            <div class="auth-tabs-content">
                <Transition name="move">
                    <component :is="currentComponent" />
                </Transition>
            </div>

        </div>
    </div>
</template>

<style scoped>
@reference "../App.css";

.auth-view {
    @apply min-h-screen flex items-center justify-center relative overflow-hidden;
    @apply py-4 md:py-8;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
}

button.active {
    @apply text-red-700 border-b-2 border-red-700;
}

@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.auth-background {
    @apply absolute inset-0 overflow-hidden pointer-events-none;
}

.background-shape {
    @apply absolute rounded-full opacity-20;
    animation: float 20s ease-in-out infinite;
}

.shape-1 {
    @apply w-96 h-96 -top-48 -left-48;
    @apply hidden md:block;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
    animation-delay: 0s;
}

.shape-2 {
    @apply w-80 h-80 -bottom-40 -right-40;
    @apply hidden md:block;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
    animation-delay: 5s;
}

.shape-3 {
    @apply w-64 h-64 top-1/2 right-1/4;
    @apply hidden md:block;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
    animation-delay: 10s;
}

@keyframes float {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
    }

    33% {
        transform: translate(30px, -30px) rotate(120deg);
    }

    66% {
        transform: translate(-20px, 20px) rotate(240deg);
    }
}

.auth-container {
    @apply w-full max-w-md px-3 md:px-4 relative z-10;
    max-height: calc(100vh - 2rem);
}

@media (min-width: 768px) {
    .auth-container {
        max-height: none;
        overflow-y: visible;
    }
}

.logo-section {
    @apply text-center mb-4 md:mb-8;
}

.logo-wrapper {
    @apply inline-flex items-center justify-center mb-2 md:mb-4;
}

.logo-icon {
    @apply text-4xl md:text-6xl;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
    animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.app-title {
    @apply text-xl md:text-3xl font-bold text-white mb-1 md:mb-2;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.app-subtitle {
    @apply text-white/90 text-xs md:text-sm;
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.auth-tabs {
    @apply w-full;
}

.tab-content {
    @apply mt-2 md:mt-4;
}

:deep(.el-tabs__header) {
    @apply mb-0 bg-white/10 backdrop-blur-sm rounded-t-xl px-2 md:px-4 pt-2 md:pt-4;
    border: none;
}

:deep(.el-tabs__nav-wrap::after) {
    display: none;
}

:deep(.el-tabs__item) {
    @apply text-sm md:text-base font-medium text-white/80 px-3 md:px-6 py-2 md:py-3;
    transition: all 0.3s ease;
    border: none;
}

:deep(.el-tabs__item:hover) {
    @apply text-white;
}

:deep(.el-tabs__item.is-active) {
    @apply text-white font-semibold;
}

:deep(.el-tabs__active-bar) {
    @apply bg-white;
    height: 3px;
    border-radius: 2px;
}

:deep(.el-tab-pane) {
    @apply mt-0;
}

:deep(.el-tabs__content) {
    @apply bg-transparent;
}
</style>