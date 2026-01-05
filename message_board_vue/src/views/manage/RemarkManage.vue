<template>
    <div class="remark-manage">
        <div class="header">
            <h2 class="title">回复管理</h2>
            <p class="desc">管理所有用户的回复</p>
        </div>
        <div class="content" v-loading="loading">
            <!-- 搜索框 -->
            <div class="search-box">
                <el-input v-model="searchKeyword" placeholder="搜索回复内容或用户名" clearable @input="handleSearch">
                    <template #prefix>
                        <el-icon>
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
            </div>

            <!-- 回复列表 -->
            <div v-if="filteredRemarks.length > 0" class="remarks-list">
                <div v-for="remark in paginatedRemarks" :key="remark.rid" class="remark-card">
                    <div class="remark-header">
                        <div class="remark-info">
                            <img class="remark-avatar" :src="remark.user?.avatar || '/avatar.png'"
                                :alt="remark.user?.nickname || remark.name" />
                            <div class="remark-user-info">
                                <span class="remark-name">{{ remark.user?.nickname || remark.name }}</span>
                                <span class="remark-time">{{ formatTime(new Date(remark.time)) }}</span>
                            </div>
                        </div>
                        <div class="remark-actions">
                            <el-button text type="danger" size="small" :icon="Delete"
                                @click="handleDeleteRemark(remark)">
                                删除
                            </el-button>
                        </div>
                    </div>

                    <!-- 关联消息 -->
                    <div v-if="remark.message" class="related-message" @click="goToMessage(remark.message)">
                        <el-icon class="message-icon">
                            <Document />
                        </el-icon>
                        <span class="message-preview">关联消息：{{ getMessagePreview(remark.message.content) }}</span>
                        <el-icon class="arrow-icon">
                            <ArrowRight />
                        </el-icon>
                    </div>

                    <!-- 回复内容 -->
                    <div class="remark-content" v-html="remark.content"></div>
                </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="empty-state">
                <el-icon class="empty-icon">
                    <ChatLineRound />
                </el-icon>
                <p class="empty-text">{{ searchKeyword ? '未找到相关回复' : '暂无回复' }}</p>
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
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Document, ArrowRight, ChatLineRound, Search } from '@element-plus/icons-vue'
import { useMessageStore } from '@/stores/modules/message'
import type { RemarkItem, MessageItem } from '@/types/message'
import { formatTime } from '@/utils/dayJs'
import { get } from '@/utils/request'

const router = useRouter()
const messageStore = useMessageStore()
const loading = ref(false)
const remarks = ref<RemarkItem[]>([])
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 加载所有回复
const loadRemarks = async () => {
    loading.value = true
    try {
        const res = await get('/message/queryAllRemarks')
        // @ts-ignore
        if (res.code === 200) {
            remarks.value = res.data || []
        } else {
            // @ts-ignore
            ElMessage.error(res.message || '加载回复失败')
        }
    } catch (error) {
        console.error('加载回复失败:', error)
        ElMessage.error('加载回复失败')
    } finally {
        loading.value = false
    }
}

// 过滤后的回复列表
const filteredRemarks = computed(() => {
    if (!searchKeyword.value.trim()) {
        return remarks.value
    }
    const keyword = searchKeyword.value.trim().toLowerCase()
    return remarks.value.filter((remark) => {
        const contentMatch = remark.content.toLowerCase().includes(keyword)
        const nameMatch = (remark.user?.nickname || remark.name).toLowerCase().includes(keyword)
        return contentMatch || nameMatch
    })
})

// 分页后的回复列表
const totalPages = computed(() => {
    return Math.ceil(filteredRemarks.value.length / pageSize.value) || 1
})

const paginatedRemarks = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredRemarks.value.slice(start, end)
})

// 搜索处理
const handleSearch = () => {
    currentPage.value = 1
}

// 删除回复
const handleDeleteRemark = async (remark: RemarkItem) => {
    try {
        await ElMessageBox.confirm('确定要删除这条回复吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })

        const success = await messageStore.deleteRemark({ rid: remark.rid })
        await loadRemarks()
    } catch (error) {
        console.error('删除回复失败:', error)
    }
}

// 跳转到消息详情页
const goToMessage = (message: MessageItem) => {
    if (message && message.mid) {
        router.push({
            name: 'Message',
            params: {
                id: message.mid
            }
        })
    }
}

// 获取消息预览
const getMessagePreview = (content: string) => {
    if (!content) return '无内容'
    const text = content.replace(/<[^>]*>/g, '')
    return text.length > 50 ? text.substring(0, 50) + '...' : text
}

onMounted(() => {
    loadRemarks()
})
</script>

<style scoped>
@reference "../../App.css";

.remark-manage {
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

.remarks-list {
    @apply space-y-4;
}

.remark-card {
    @apply bg-white/80 backdrop-blur-xl rounded-xl p-4;
    @apply border border-gray-200/50 shadow-sm;
    transition: all 0.3s ease;
}

.remark-card:hover {
    @apply shadow-md bg-white/90;
}

.remark-header {
    @apply flex items-center justify-between mb-3 pb-3 border-b border-gray-100;
}

.remark-info {
    @apply flex items-center gap-3 flex-1;
}

.remark-avatar {
    @apply w-10 h-10 object-cover rounded-full border border-gray-200;
}

.remark-user-info {
    @apply flex flex-col;
}

.remark-name {
    @apply font-semibold text-gray-800;
}

.remark-time {
    @apply text-xs text-gray-500;
}

.remark-actions {
    @apply flex items-center gap-1;
}

.related-message {
    @apply flex items-center gap-2 p-2 mb-3 rounded-lg;
    @apply bg-blue-50/50 border border-blue-100/50;
    @apply cursor-pointer transition-all;
    @apply hover:bg-blue-100/50 hover:border-blue-200;
}

.message-icon {
    @apply text-blue-600 shrink-0;
}

.message-preview {
    @apply flex-1 text-sm text-gray-600 line-clamp-1;
}

.arrow-icon {
    @apply text-gray-400 shrink-0;
}

.remark-content {
    @apply text-gray-700 text-sm leading-relaxed;
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
    .remark-manage {
        @apply p-4;
    }

    .remark-card {
        @apply p-3;
    }

    .remark-header {
        @apply flex-col items-start gap-2;
    }
}
</style>
