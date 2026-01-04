<template>
    <div class="remark-view">
        <div class="header">
            <h2 class="title">回复管理</h2>
            <p class="desc">管理您的所有回复</p>
        </div>

        <div class="content" v-loading="loading">
            <!-- 回复列表 -->
            <div v-if="remarks.length > 0" class="remarks-list">
                <div v-for="remark in remarks" :key="remark.rid" class="remark-card">
                    <div class="remark-header">
                        <div class="remark-info">
                            <span class="remark-time">{{ formatTime(new Date(remark.time)) }}</span>
                            <el-tag v-if="remark.message" type="info" size="small" class="message-tag">
                                回复于: {{ remark.message.name || '未知消息' }}
                            </el-tag>
                        </div>
                        <div class="remark-actions">
                            <el-button v-if="editingRemarkId !== remark.rid" text type="primary" size="small"
                                :icon="Edit" @click="startEditRemark(remark)">
                                编辑
                            </el-button>
                            <el-button text type="danger" size="small" :icon="Delete"
                                @click="handleDeleteRemark(remark)">
                                删除
                            </el-button>
                        </div>
                    </div>

                    <!-- 关联的消息信息 -->
                    <div v-if="remark.message" class="related-message" @click="goToMessage(remark.message)">
                        <el-icon class="message-icon">
                            <Document />
                        </el-icon>
                        <div class="message-preview">
                            <span class="message-title">关联消息：</span>
                            <span class="message-content" v-html="getMessagePreview(remark.message.content)"></span>
                        </div>
                        <el-icon class="arrow-icon">
                            <ArrowRight />
                        </el-icon>
                    </div>

                    <!-- 编辑模式 -->
                    <div v-if="editingRemarkId === remark.rid" class="remark-edit">
                        <Chat v-model="editingContent" placeholder="编辑回复..." :min-height="'120px'"
                            :max-height="'200px'" />
                        <div class="edit-actions">
                            <el-button size="small" @click="cancelEdit">取消</el-button>
                            <el-button type="primary" size="small" @click="saveEdit">保存</el-button>
                        </div>
                    </div>

                    <!-- 显示模式 -->
                    <div v-else class="remark-content" v-html="remark.content"></div>
                </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="empty-state">
                <el-icon class="empty-icon">
                    <ChatLineRound />
                </el-icon>
                <p class="empty-text">暂无回复</p>
                <p class="empty-desc">您还没有发表任何回复</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Document, ArrowRight, ChatLineRound } from '@element-plus/icons-vue'
import { useMessageStore } from '@/stores/modules/message'
import Chat from '@/components/layout/Chat.vue'
import type { RemarkItem, MessageItem } from '@/types/message'
import { formatTime } from '@/utils/dayJs'

const router = useRouter()
const messageStore = useMessageStore()
const loading = ref(false)
const remarks = ref<RemarkItem[]>([])
const editingRemarkId = ref<string | null>(null)
const editingContent = ref('')

// 加载回复列表
const loadRemarks = async () => {
    loading.value = true
    try {
        const data = await messageStore.queryMyRemarks()
        remarks.value = data || []
    } catch (error) {
        console.error('加载回复失败:', error)
    } finally {
        loading.value = false
    }
}

// 开始编辑
const startEditRemark = (remark: RemarkItem) => {
    editingRemarkId.value = remark.rid
    editingContent.value = remark.content
}

// 取消编辑
const cancelEdit = () => {
    editingRemarkId.value = null
    editingContent.value = ''
}

// 保存编辑
const saveEdit = async () => {
    if (!editingContent.value.trim()) {
        ElMessage.warning('请输入回复内容')
        return
    }

    if (!editingRemarkId.value) return

    const success = await messageStore.updateRemark({
        rid: editingRemarkId.value,
        content: editingContent.value
    })

    if (success) {
        editingRemarkId.value = null
        editingContent.value = ''
        // 重新加载列表
        await loadRemarks()
    }
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
        if (success) {
            // 重新加载列表
            await loadRemarks()
        }
    } catch (error) {
        // 用户取消删除
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

// 获取消息预览（截取前50个字符）
const getMessagePreview = (content: string) => {
    if (!content) return '无内容'
    // 移除HTML标签
    const text = content.replace(/<[^>]*>/g, '')
    return text.length > 50 ? text.substring(0, 50) + '...' : text
}

onMounted(() => {
    loadRemarks()
})
</script>

<style scoped>
@reference "../../App.css";

.remark-view {
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

/* 回复列表 */
.remarks-list {
    @apply space-y-4;
}

/* 回复卡片 */
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
    @apply flex items-center gap-2 flex-1;
}

.remark-time {
    @apply text-xs text-gray-500;
}

.message-tag {
    @apply ml-2;
}

.remark-actions {
    @apply flex items-center gap-1;
}

/* 关联消息 */
.related-message {
    @apply flex items-center gap-2 p-3 mb-3 rounded-lg;
    @apply bg-blue-50/50 border border-blue-100/50;
    @apply cursor-pointer transition-all;
    @apply hover:bg-blue-100/50 hover:border-blue-200;
}

.message-icon {
    @apply text-blue-600 text-lg shrink-0;
}

.message-preview {
    @apply flex-1 min-w-0;
}

.message-title {
    @apply text-sm font-semibold text-gray-700 mr-2;
}

.message-content {
    @apply text-sm text-gray-600;
    @apply line-clamp-1;
}

.arrow-icon {
    @apply text-gray-400 shrink-0;
}

/* 编辑区域 */
.remark-edit {
    @apply mt-3;
}

.edit-actions {
    @apply flex justify-end gap-2 mt-2;
}

/* 回复内容 */
.remark-content {
    @apply text-gray-700 text-sm leading-relaxed;
    @apply px-2;
}

/* 空状态 */
.empty-state {
    @apply flex flex-col items-center justify-center py-16;
}

.empty-icon {
    @apply text-6xl text-gray-300 mb-4;
}

.empty-text {
    @apply text-lg font-semibold text-gray-600 mb-2;
}

.empty-desc {
    @apply text-sm text-gray-500;
}

/* 内容样式 */
:deep(.remark-content p),
:deep(.message-content p) {
    @apply mb-2;
}

:deep(.remark-content p:last-child),
:deep(.message-content p:last-child) {
    @apply mb-0;
}

:deep(.remark-content img),
:deep(.message-content img) {
    @apply max-w-full rounded-lg my-2;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .remark-view {
        @apply p-4;
    }

    .remark-card {
        @apply p-3;
    }

    .remark-header {
        @apply flex-col items-start gap-2;
    }

    .remark-actions {
        @apply w-full justify-end;
    }

    .related-message {
        @apply flex-col items-start;
    }

    .message-preview {
        @apply w-full;
    }
}
</style>