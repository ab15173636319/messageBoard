<template>
    <div class="change-password">
        <div class="header">
            <h2 class="title">修改密码</h2>
            <p class="desc">定期更改密码可以保护您的账户安全</p>
        </div>
        <div class="content" v-loading="userStore.loading">
            <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" class="password-form">
                <el-form-item label="当前密码" prop="oldPassword">
                    <el-input v-model="formData.oldPassword" type="password" show-password placeholder="请输入当前密码" />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="formData.newPassword" type="password" show-password placeholder="请输入新密码" />
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                    <el-input v-model="formData.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSave" :loading="loading">
                        确认修改
                    </el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
    if (value !== formData.value.newPassword) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}

const rules = {
    oldPassword: [
        { required: true, message: '请输入当前密码', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
    ]
}

const handleSave = async () => {
    if (!formRef.value) return
    formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                await userStore.updatePassword(formData.value)
                handleReset()
            } catch (error) {
                console.error("更新密码失败:", error)
            }
        }
    })
}

const handleReset = () => {
    formData.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
    formRef.value?.resetFields()
}
</script>

<style scoped>
@reference "../../App.css";

.change-password {
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

.password-form {
    @apply pt-4;
}
</style>
