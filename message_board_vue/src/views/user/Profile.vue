<template>
    <div class="profile">
        <div class="header">
            <h2 class="title">个人信息</h2>
            <p class="desc">查看和编辑您的个人信息</p>
        </div>
        <div class="content" v-loading="userStore.loading">
            <el-form ref="formRef" :model="formData" label-width="100px" class="profile-form" :rules="rule">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="formData.username" disabled />
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="formData.nickname" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="formData.phone" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSave" :loading="loading">
                        保存修改
                    </el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import type { UserInfo } from '@/types/user'

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = ref({
    username: '',
    nickname: '',
    email: '',
    phone: ''
})

const originalData = ref({ ...formData.value })

const initData = async () => {
    await userStore.queryUserInfo()
    if (userStore.userInfo) {
        formData.value = {
            username: userStore.userInfo.username || '',
            nickname: userStore.userInfo.nickname || '',
            email: userStore.userInfo.email || '',
            phone: userStore.userInfo.phone || ''
        }
        originalData.value = { ...formData.value }
    }
}

const validateEmail = (rule: any, value: any, callback: any) => {
    const match = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value !== "" && !match.test(value)) {
        callback(new Error('请输入正确的邮箱地址'))
    }
    callback()
}

const validatePhone = (rule: any, value: any, callback: any) => {
    const match = /^1[3-9]\d{9}$/
    if (value !== "" && !match.test(value)) {
        callback(new Error('请输入正确的手机号'))
    }
    callback()
}

const rule = {
    email: [
        { validator: validateEmail, trigger: 'blur' }
    ],
    phone: [
        { validator: validatePhone, trigger: 'blur' }
    ]
}

const handleSave = async () => {
    formRef.value?.validate(async (vaild) => {
        if (vaild) {
            await userStore.updateUserInfo({
                nickname: formData.value.nickname,
                email: formData.value.email,
                phone: formData.value.phone
            })
            initData()
        } else {
            ElMessage.error('请检查输入内容')
        }
    })
}

const handleReset = () => {
    formData.value = { ...originalData.value }
    formRef.value?.resetFields()
}

onMounted(() => {
    initData()
})
</script>

<style scoped>
@reference "../../App.css";

.profile {
    @apply w-full h-full p-6 bg-white rounded-lg shadow-md;
}

.header {
    @apply mb-6 pb-4 border-b border-gray-200;
}

.title {
    @apply text-2xl font-bold text-gray-800 mb-2;
}

.desc {
    @apply text-gray-500;
}

.content {
    @apply max-w-2xl;
}

.profile-form {
    @apply pt-4;
}
</style>
