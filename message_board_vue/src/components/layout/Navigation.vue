<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { navigation } from '@/config/navigation'
import { useUserStore } from '@/stores/modules/user'
import { storeToRefs } from 'pinia'
import type { UserInfo } from '@/types/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 用户登录状态（后续可以从store获取）
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const isLoggedIn = computed(() => userStore.token !== "")
const currentPath = ref('')

// 用户信息（后续可以从store获取）
const { userInfo } = storeToRefs(userStore)

// 初始化用户数据
onMounted(async () => {
    await userStore.initUserStore()


})

watch(() => route.path, (newPath) => {
    currentPath.value = newPath
})

// 导航到指定路径
const navigateTo = (path: string) => {
    router.push(path)
    showMobileMenu.value = false
}

// 跳转到登录页面
const goToLogin = () => {
    router.push({
        name: "Auth",
        params: {
            tab: "login"
        }
    })
    showUserMenu.value = false
    showMobileMenu.value = false
}

// 跳转到注册页面
const goToRegister = () => {
    router.push({
        name: "Auth",
        params: {
            tab: "register"
        }
    })
    showUserMenu.value = false
    showMobileMenu.value = false
}

// 切换用户菜单
const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
}

// 切换移动端菜单
const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.user-menu-container') && !target.closest('.mobile-menu-button')) {
        showUserMenu.value = false
    }
    if (!target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        showMobileMenu.value = false
    }
}

// 检查当前路由是否激活
const isActive = (path: string) => {
    return route.path === path
}

// 跳转到用户中心
const toUserCenter = () => {
    router.push({
        name: "User",
        params: {
            id: userInfo?.value?.uid
        }
    })
}

const isUserCenter = computed(() => {
    return currentPath.value.includes('/user')
})

// 退出登录
const handleLogout = () => {
    userStore.logout()
    showUserMenu.value = false
    showMobileMenu.value = false
    router.push('/')
}

const filterNavigation = computed(() => {
    const userRole = userStore.userInfo?.role || 'user'
    return navigation.filter(item => {
        return !(item.role === 'admin' && userRole !== 'admin')
    })
})
</script>

<template>
    <nav class="navigation" @click="handleClickOutside">
        <div class="nav-container">
            <!-- 左侧 Logo -->
            <div class="nav-logo flex items-center gap-2" @click="navigateTo('/')">
                <img class="lazy-image w-10 h-10" src="/logo.svg" alt="" srcset="">
                <span class="logo-text">留言板</span>
            </div>

            <!-- 中间导航链接 -->
            <div class="nav-links" ref="nav-links">
                <a v-for="item in filterNavigation" :key="item.path"
                    :class="['nav-link flex items-center gap-2', { active: isActive(item.path) }]"
                    @click.prevent="navigateTo(item.path)">
                    <el-icon :size="20" :color="isActive(item.path) ? 'blue' : 'gray'">
                        <component :is="item.icon" />
                    </el-icon>
                    {{ item.name }}
                </a>
            </div>

            <!-- 右侧用户信息 -->
            <div class="nav-user">
                <!-- 桌面端用户菜单 -->
                <div class="user-menu-container">
                    <div v-if="isLoggedIn" class="user-info" @click="toggleUserMenu">
                        <span class="user-avatar">
                            <el-avatar :size="32" :src="userInfo?.avatar || '/avatar.png'" />
                        </span>
                        <span class="user-name">{{ userInfo?.username }}</span>
                        <span class="dropdown-arrow" :class="{ open: showUserMenu }">▼</span>
                    </div>
                    <div v-else class="auth-buttons">
                        <button class="btn-login" @click="goToLogin">登录</button>
                        <button class="btn-register" @click="goToRegister">注册</button>
                    </div>

                    <!-- 用户下拉菜单 -->
                    <div v-if="isLoggedIn && showUserMenu" class="user-dropdown">
                        <div v-if="!isUserCenter" class="dropdown-item" @click="toUserCenter">个人中心
                        </div>
                        <!-- <div class="dropdown-item">设置</div> -->
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-item" @click="handleLogout">退出登录</div>
                    </div>
                </div>

                <!-- 移动端：未登录时显示登录/注册按钮 -->
                <div v-if="!isLoggedIn" class="mobile-auth-buttons">
                    <button class="mobile-btn-login-small" @click="goToLogin">登录</button>
                    <button class="mobile-btn-register-small" @click="goToRegister">注册</button>
                </div>

                <!-- 移动端菜单按钮 -->
                <button class="mobile-menu-button" @click="toggleMobileMenu">
                    <span class="menu-icon">☰</span>
                </button>
            </div>
        </div>

        <!-- 移动端下拉菜单 -->
        <div v-if="showMobileMenu" class="mobile-menu">
            <div class="mobile-menu-content">
                <a v-for="item in filterNavigation" :key="item.path"
                    :class="['mobile-nav-link', { active: isActive(item.path) }]" @click="navigateTo(item.path)">
                    {{ item.name }}
                </a>
                <div v-if="!isLoggedIn" class="mobile-auth">
                    <button class="mobile-btn-login" @click="goToLogin">登录</button>
                    <button class="mobile-btn-register" @click="goToRegister">注册</button>
                </div>
                <div v-else class="mobile-user-info">
                    <div class="mobile-user-item" v-if="!isUserCenter" @click="toUserCenter">个人中心</div>
                    <!-- <div class="mobile-user-item">设置</div> -->
                    <div class="mobile-user-item" @click="handleLogout">退出登录</div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
@reference "../../App.css";

.navigation {
    @apply bg-white shadow-md sticky top-0 z-50;
}

.nav-container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
    @apply flex items-center justify-between h-16;
}

/* Logo 样式 */
.nav-logo {
    @apply flex-shrink-0 cursor-pointer;
}

.logo-text {
    @apply text-xl font-bold text-blue-600;
}

/* 中间导航链接 */
.nav-links {
    @apply hidden md:flex items-center space-x-6 flex-1 justify-center;
}

.nav-link {
    @apply px-3 py-2 text-gray-700 font-medium transition-colors duration-200 cursor-pointer;
    @apply hover:text-blue-600;
}

.nav-link.active {
    @apply text-blue-600 border-b-2 border-blue-600;
}

/* 右侧用户信息 */
.nav-user {
    @apply flex items-center;
}

.user-menu-container {
    @apply relative hidden md:block;
}

.user-info {
    @apply flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg;
    @apply hover:bg-gray-100 transition-colors duration-200;
}

.user-avatar {
    @apply w-8 h-8 rounded-full bg-blue-500 text-white;
    @apply flex items-center justify-center text-sm font-medium;
}

.user-name {
    @apply text-gray-700 font-medium;
}

.dropdown-arrow {
    @apply text-xs text-gray-500 transition-transform duration-200;
}

.dropdown-arrow.open {
    @apply transform rotate-180;
}

/* 未登录按钮 */
.auth-buttons {
    @apply flex items-center space-x-2;
}

.btn-login,
.btn-register {
    @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

.btn-login {
    @apply text-gray-700 hover:bg-gray-100;
}

.btn-register {
    @apply bg-blue-600 text-white hover:bg-blue-700;
}

/* 用户下拉菜单 */
.user-dropdown {
    @apply absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg;
    @apply border border-gray-200 py-1 z-50;
}

.dropdown-item {
    @apply px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100;
    @apply transition-colors duration-200;
}

.dropdown-divider {
    @apply border-t border-gray-200 my-1;
}

/* 移动端登录/注册按钮（导航栏右侧） */
.mobile-auth-buttons {
    @apply md:hidden flex items-center space-x-2 mr-2;
}

.mobile-btn-login-small,
.mobile-btn-register-small {
    @apply px-3 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200;
}

.mobile-btn-login-small {
    @apply text-gray-700 hover:bg-gray-100;
}

.mobile-btn-register-small {
    @apply bg-blue-600 text-white hover:bg-blue-700;
}

/* 移动端菜单按钮 */
.mobile-menu-button {
    @apply md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg;
    @apply transition-colors duration-200;
}

.menu-icon {
    @apply text-xl;
}

/* 移动端下拉菜单 */
.mobile-menu {
    @apply md:hidden bg-white border-t border-gray-200;
    @apply shadow-lg;
}

.mobile-menu-content {
    @apply px-4 py-2;
}

.mobile-nav-link {
    @apply block px-4 py-3 text-gray-700 font-medium;
    @apply hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer;
}

.mobile-nav-link.active {
    @apply text-blue-600 bg-blue-50;
}

.mobile-auth {
    @apply flex flex-col space-y-2 mt-2 pt-2 border-t border-gray-200;
}

.mobile-btn-login,
.mobile-btn-register {
    @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

.mobile-btn-login {
    @apply text-gray-700 bg-gray-100 hover:bg-gray-200;
}

.mobile-btn-register {
    @apply bg-blue-600 text-white hover:bg-blue-700;
}

.mobile-user-info {
    @apply mt-2 pt-2 border-t border-gray-200;
}

.mobile-user-item {
    @apply px-4 py-3 text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg;
    @apply transition-colors duration-200;
}
</style>
