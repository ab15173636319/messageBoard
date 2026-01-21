<script setup lang="ts">
import { ref } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import type { LoginParams } from "@/types/user";

const userStore = useUserStore();
const loginFormRef = ref<FormInstance>();
const rules = {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const formData = ref({
    username: "",
    password: "",
});
const remember = ref(false);

const handleLogin = () => {
    loginFormRef.value?.validate((valid) => {
        if (valid) {
            userStore.login(formData.value as LoginParams, remember.value);
        }
    });
};
</script>

<template>
    <div class="login-wrapper">
        <el-card class="login-card" shadow="never">
            <template #header>
                <div class="card-header">
                    <div class="icon-wrapper">
                        <el-icon :size="32" class="header-icon">
                            <User />
                        </el-icon>
                    </div>
                    <h2 class="title">欢迎回来</h2>
                    <p class="subtitle">请登录您的账号</p>
                </div>
            </template>

            <el-form :model="formData" label-position="top" class="login-form" :rules="rules" size="large"
                ref="loginFormRef" v-loading="userStore.loading">
                <el-form-item prop="username">
                    <el-input v-model="formData.username" placeholder="请输入用户名" clearable class="custom-input">
                        <template #prefix>
                            <el-icon class="input-icon">
                                <User />
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
                <el-form-item>
                    <el-checkbox v-model="remember">记住我</el-checkbox>
                </el-form-item>

                <el-form-item class="submit-item">
                    <el-button type="primary" class="submit-button" @click="handleLogin">
                        <el-icon class="button-icon">
                            <Lock />
                        </el-icon>
                        <span>登录</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<style scoped>
@reference "../../App.css";

.login-wrapper {
    @apply w-full;
}

.login-card {
    @apply border-0 shadow-lg rounded-xl md:rounded-2xl overflow-hidden;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
}

.card-header {
    @apply text-center py-3 md:py-6;
}

.icon-wrapper {
    @apply inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full mb-2 md:mb-4;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.login-form {
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    transition: all 0.3s ease;
}

.submit-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
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
    @apply mb-4 md:mb-5;
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
    box-shadow: 0 0 0 1px rgba(102, 126, 234, 0.3);
}

:deep(.el-input.is-focus .el-input__wrapper) {
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

:deep(.el-input__inner) {
    @apply text-gray-700;
}

:deep(.el-input__inner::placeholder) {
    @apply text-gray-400;
}
</style>
