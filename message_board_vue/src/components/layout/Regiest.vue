<script setup lang="ts">
import { ref } from 'vue'
import { User, Message, Lock } from '@element-plus/icons-vue'
import type { RegisterParams } from '@/types/user'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const formData = ref<RegisterParams>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
})

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
    if (value !== formData.value.password) {
        callback(new Error('两次密码不一致'))
    }
    callback()
}

const validateUsername = (rule: any, value: any, callback: any) => {
    const match = /^[0-6a-zA-Z]{6,}$/
    if (!match.test(value)) {
        callback(new Error('用户名至少6位，只能包含数字、字母'))
    }
    callback()
}

const validateEmail = (rule: any, value: any, callback: any) => {
    const match = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !match.test(value)) {
        callback(new Error('请输入正确的邮箱地址'))
    }
    callback()
}

const validatePassword = (rule: any, value: any, callback: any) => {
    const match = /^(?=.*[0-6])(?=.*[a-zA-Z])[0-6a-zA-Z]{6,}$/
    if (!match.test(value)) {
        callback(new Error('密码至少6位，必须包含数字和字母，至少包含 1 个数字 + 1 个字母'))
    }
    callback()
}

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { validator: validateUsername, trigger: 'blur' },
    ],
    email: [
        { validator: validateEmail, trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { validator: validatePassword, trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
    ],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
}


const handleRegister = () => {
    userStore.register(formData.value as RegisterParams)
}
</script>

<template>
    <div class="register-wrapper">
        <el-card class="register-card" shadow="never">
            <template #header>
                <div class="card-header">
                    <div class="icon-wrapper">
                        <el-icon :size="32" class="header-icon">
                            <User />
                        </el-icon>
                    </div>
                    <h2 class="title">创建账号</h2>
                    <p class="subtitle">加入我们，开始您的旅程</p>
                </div>
            </template>

            <el-form :model="formData" label-position="top" class="register-form" size="large">
                <el-form-item prop="username">
                    <el-input v-model="formData.username" placeholder="请输入用户名" clearable class="custom-input">
                        <template #prefix>
                            <el-icon class="input-icon">
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="nickname">
                    <el-input v-model="formData.nickname" placeholder="请输入昵称" clearable class="custom-input">
                        <template #prefix>
                            <el-icon class="input-icon">
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="email">
                    <el-input v-model="formData.email" type="email" placeholder="请输入邮箱地址" clearable
                        class="custom-input">
                        <template #prefix>
                            <el-icon class="input-icon">
                                <Message />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password clearable
                        class="custom-input">
                        <template #prefix>
                            <el-icon class="input-icon">
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="confirmPassword">
                    <el-input v-model="formData.confirmPassword" type="password" placeholder="请再次输入密码" show-password
                        clearable class="custom-input">
                        <template #prefix>
                            <el-icon class="input-icon">
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item class="submit-item">
                    <el-button type="primary" class="submit-button" @click="handleRegister">
                        <el-icon class="button-icon">
                            <User />
                        </el-icon>
                        <span>注册</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<style scoped>
@reference "../../App.css";

.register-wrapper {
    @apply w-full mb-4 md:mb-10;
}

.register-card {
    @apply border-0 shadow-lg rounded-xl md:rounded-2xl overflow-hidden;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
}

.card-header {
    @apply text-center py-3 md:py-6;
}

.icon-wrapper {
    @apply inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full mb-2 md:mb-4;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.header-icon {
    @apply text-white;
    font-size: 20px;
}

@media (min-width: 768px) {
    .header-icon {
        font-size: 32px;
    }
}

.title {
    @apply text-lg md:text-2xl font-bold text-gray-800 mb-1 md:mb-2;
}

.subtitle {
    @apply text-xs md:text-sm text-gray-500;
}

.register-form {
    @apply px-2 md:px-2;
}

.form-label {
    @apply flex items-center gap-2 text-gray-700 font-medium;
}

.label-icon {
    @apply text-gray-500;
}

.custom-input {
    @apply w-full;
}

.input-icon {
    @apply text-gray-400;
}

.submit-item {
    @apply mt-4 md:mt-6 mb-2;
}

.submit-button {
    @apply w-full h-11 md:h-12 rounded-lg font-medium text-sm md:text-base;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border: none;
    transition: all 0.3s ease;
}

.submit-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(245, 87, 108, 0.3);
}

.button-icon {
    @apply mr-2;
}

:deep(.el-card__header) {
    @apply border-b border-gray-100 pb-0;
    background: transparent;
}

:deep(.el-form-item__label) {
    @apply pb-1 md:pb-2;
}

:deep(.el-form-item) {
    @apply mb-3 md:mb-5;
}

:deep(.el-input__wrapper) {
    @apply rounded-lg shadow-sm;
    transition: all 0.3s ease;
}

:deep(.el-input--large) {
    --el-input-height: 40px;
}

@media (min-width: 768px) {
    :deep(.el-input--large) {
        --el-input-height: 40px;
    }
}

:deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px rgba(245, 87, 108, 0.3);
}

:deep(.el-input.is-focus .el-input__wrapper) {
    box-shadow: 0 0 0 2px rgba(245, 87, 108, 0.2);
}

:deep(.el-input__inner) {
    @apply text-gray-700;
}

:deep(.el-input__inner::placeholder) {
    @apply text-gray-400;
}
</style>