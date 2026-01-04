<template>
    <div class="user-manage">
        <div class="header">
            <h2 class="title">用户管理</h2>
            <p class="desc">管理所有用户信息</p>
        </div>
        <div class="content" v-loading="loading">
            <!-- 搜索框 -->
            <div class="search-box">
                <el-input v-model="searchKeyword" placeholder="搜索用户名、昵称或邮箱" clearable @input="handleSearch">
                    <template #prefix>
                        <el-icon>
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
            </div>

            <!-- 用户列表 -->
            <div v-if="filteredUsers.length > 0" class="users-list">
                <div v-for="user in paginatedUsers" :key="user.uid" class="user-card">
                    <div class="user-header">
                        <div class="user-info">
                            <img class="user-avatar" :src="user.avatar || '/bg.png'"
                                :alt="user.nickname || user.username" />
                            <div class="user-details">
                                <div class="user-name-row">
                                    <span class="user-name">{{ user.nickname || user.username }}</span>
                                    <el-tag v-if="user.role === 'admin'" type="danger" size="small">管理员</el-tag>
                                    <el-tag v-else type="info" size="small">普通用户</el-tag>
                                </div>
                                <div class="user-meta">
                                    <span class="user-username">用户名：{{ user.username }}</span>
                                    <span v-if="user.email" class="user-email">邮箱：{{ user.email }}</span>
                                    <span class="user-time">注册时间：{{ formatTime(new Date(user.create_time ||
                                        user.create_time ||
                                        Date.now())) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="user-actions">
                            <el-button text type="primary" size="small" :icon="Edit" @click="handleEditUser(user)">
                                编辑
                            </el-button>
                            <el-button text type="danger" size="small" :icon="Delete" @click="handleDeleteUser(user)">
                                删除
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="empty-state">
                <el-icon class="empty-icon">
                    <UserFilled />
                </el-icon>
                <p class="empty-text">{{ searchKeyword ? '未找到相关用户' : '暂无用户' }}</p>
            </div>

            <!-- 分页 -->
            <div v-if="totalPages > 1" class="pagination">
                <el-button type="primary" plain @click="currentPage--" :disabled="currentPage === 1">
                    上一页
                </el-button>
                <span class="page-info">第{{ currentPage }}页，共{{ totalPages }}页</span>
                <el-button type="primary" plain @click="currentPage++" :disabled="currentPage === totalPages">
                    下一页
                </el-button>
            </div>
        </div>

        <!-- 编辑用户对话框 -->
        <el-dialog v-model="editDialogVisible" title="编辑用户" width="500px">
            <el-form :model="editingUser" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="editingUser.username" disabled />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="editingUser.nickname" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="editingUser.email" />
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="editingUser.phone" />
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="editingUser.role" style="width: 100%">
                        <el-option label="普通用户" value="user" />
                        <el-option label="管理员" value="admin" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSaveUser" :loading="saving">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Search, UserFilled } from '@element-plus/icons-vue'
import { get } from '@/utils/request'
import type { UserInfo } from '@/types/user'
import { formatTime } from '@/utils/dayJs'

const loading = ref(false)
const saving = ref(false)
const users = ref<UserInfo[]>([])
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const editDialogVisible = ref(false)
const editingUser = ref<Partial<UserInfo>>({})

// 加载所有用户
const loadUsers = async () => {
    loading.value = true
    try {
        const res = await get('/user/queryUser')
        // @ts-ignore
        if (res.code === 200) {
            users.value = res.data || []
        } else {
            // @ts-ignore
            ElMessage.error(res.message || '加载用户失败')
        }
    } catch (error) {
        console.error('加载用户失败:', error)
        ElMessage.error('加载用户失败')
    } finally {
        loading.value = false
    }
}

// 过滤后的用户列表
const filteredUsers = computed(() => {
    if (!searchKeyword.value.trim()) {
        return users.value
    }
    const keyword = searchKeyword.value.trim().toLowerCase()
    return users.value.filter((user) => {
        const usernameMatch = user.username.toLowerCase().includes(keyword)
        const nicknameMatch = (user.nickname || '').toLowerCase().includes(keyword)
        const emailMatch = (user.email || '').toLowerCase().includes(keyword)
        return usernameMatch || nicknameMatch || emailMatch
    })
})

// 分页后的用户列表
const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / pageSize.value) || 1
})

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredUsers.value.slice(start, end)
})

// 搜索处理
const handleSearch = () => {
    currentPage.value = 1
}

// 编辑用户
const handleEditUser = (user: UserInfo) => {
    editingUser.value = { ...user }
    editDialogVisible.value = true
}

// 保存用户
const handleSaveUser = async () => {
    saving.value = true
    try {
        // 这里需要调用更新用户的API（需要后端支持管理员更新用户）
        ElMessage.warning('更新用户功能需要后端支持管理员API')
        editDialogVisible.value = false
    } catch (error) {
        console.error('保存用户失败:', error)
        ElMessage.error('保存用户失败')
    } finally {
        saving.value = false
    }
}

// 删除用户
const handleDeleteUser = async (user: UserInfo) => {
    try {
        await ElMessageBox.confirm(`确定要删除用户"${user.nickname || user.username}"吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })

        // 这里需要调用删除用户的API（需要后端支持管理员删除用户）
        ElMessage.warning('删除用户功能需要后端支持管理员API')
    } catch (error) {
        // 用户取消删除
    }
}

onMounted(() => {
    loadUsers()
})
</script>

<style scoped>
@reference "../../App.css";

.user-manage {
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
    @apply min-h-[400px];
}

.search-box {
    @apply mb-4;
}

.users-list {
    @apply space-y-4;
}

.user-card {
    @apply bg-white/80 backdrop-blur-xl rounded-xl p-4;
    @apply border border-gray-200/50 shadow-sm;
    transition: all 0.3s ease;
}

.user-card:hover {
    @apply shadow-md bg-white/90;
}

.user-header {
    @apply flex items-center justify-between;
}

.user-info {
    @apply flex items-center gap-4 flex-1;
}

.user-avatar {
    @apply w-16 h-16 object-cover rounded-full border-2 border-blue-100;
}

.user-details {
    @apply flex-1;
}

.user-name-row {
    @apply flex items-center gap-2 mb-2;
}

.user-name {
    @apply text-lg font-bold text-gray-800;
}

.user-meta {
    @apply flex flex-col gap-1 text-sm text-gray-600;
}

.user-username,
.user-email,
.user-time {
    @apply text-xs;
}

.user-actions {
    @apply flex items-center gap-1;
}

.empty-state {
    @apply flex flex-col items-center justify-center py-16;
}

.empty-icon {
    @apply text-6xl text-gray-300 mb-4;
}

.empty-text {
    @apply text-lg font-semibold text-gray-600;
}

.pagination {
    @apply flex items-center justify-center gap-4 mt-6;
}

.page-info {
    @apply text-sm text-gray-600;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .user-manage {
        @apply p-4;
    }

    .user-card {
        @apply p-3;
    }

    .user-header {
        @apply flex-col items-start gap-3;
    }

    .user-actions {
        @apply w-full justify-end;
    }
}
</style>
