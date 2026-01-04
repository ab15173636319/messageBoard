<template>
    <div class="chat-list-container w-full h-full" v-loading="messageStore.loading">
        <search @search="handleSearch" @clear="handleClear"></search>

        <!-- 搜索结果提示 -->
        <div v-if="searchKeyword" class="search-result-info">
            <span class="result-text">搜索"{{ searchKeyword }}"的结果：{{ filteredList.length }} 条</span>
            <el-button type="text" size="small" @click="handleClear">清除搜索</el-button>
        </div>

        <!-- 空搜索结果提示 -->
        <div v-if="searchKeyword && filteredList.length === 0" class="empty-search">
            <p>未找到相关留言</p>
            <el-button type="primary" plain @click="handleClear">清除搜索</el-button>
        </div>

        <!-- 留言列表 -->
        <TransitionGroup v-if="displayList.length > 0" name="list" tag="div" class="chat-list">
            <chat-list-item v-for="item in displayList" :key="item._id" :item="item" @replay="handleReplay"
                @delete="handleDelete" :manage="props.manage"></chat-list-item>
        </TransitionGroup>

        <!-- 分页 -->
        <div v-if="total > 1" class="pagination">
            <el-button type="primary" plain @click="handlePreviousPage" :disabled="pageNumber === 1">
                上一页
            </el-button>
            <el-button type="primary" plain @click="handleNextPage" :disabled="pageNumber === total">
                下一页
            </el-button>
            <span class="page-info">第{{ pageNumber }}页，共{{ total }}页</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChatItem } from '@/types/chat';
import ChatListItem from '@/components/base/ChatListItem.vue';
import Search from '@/components/layout/Search.vue';
import { computed, ref, watch } from 'vue';
import { hideOverflow } from '@/utils/overflow';
import { useRouter } from 'vue-router';
import type { MessageItem } from '@/types/message';
import { ElMessageBox } from 'element-plus';
import { useMessageStore } from '@/stores/modules/message';

const router = useRouter()
const messageStore = useMessageStore()
const props = defineProps<{
    list: MessageItem[]
    manage?: boolean
}>()

const pageNumber = ref(1)
const pageSize = ref(5)
const searchKeyword = ref('')

// 过滤后的列表（根据搜索关键词）
const filteredList = computed(() => {
    if (!searchKeyword.value.trim()) {
        return props.list
    }

    const keyword = searchKeyword.value.trim().toLowerCase()
    return props.list.filter(item => {
        const contentMatch = item.content.toLowerCase().includes(keyword)
        const nameMatch = item.name.toLowerCase().includes(keyword)
        return contentMatch || nameMatch
    })
})

// 总页数（基于过滤后的列表）
const total = computed(() => {
    return Math.ceil(filteredList.value.length / pageSize.value) || 1
})

// 当前页显示的数据
const displayList = computed(() => {
    const start = (pageNumber.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredList.value.slice(start, end)
})

// 搜索处理
const handleSearch = (keyword: string) => {
    searchKeyword.value = keyword
    pageNumber.value = 1 // 搜索时重置到第一页
}

// 清除搜索
const handleClear = () => {
    searchKeyword.value = ''
    pageNumber.value = 1
}

// 上一页
const handlePreviousPage = () => {
    if (pageNumber.value > 1) {
        pageNumber.value--
    }
}

// 下一页
const handleNextPage = () => {
    if (pageNumber.value < total.value) {
        pageNumber.value++
    }
}

// 回复处理
const handleReplay = (item: MessageItem) => {
    router.push({
        name: 'Message',
        params: {
            id: item._id,
            reply: 1
        }
    })
}

const handleDelete = (item: MessageItem) => {
    if (!props.manage) return;
    ElMessageBox.confirm('确定删除该留言吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        console.log(item);
        messageStore.deleteMessage({ mid: item.mid })
        messageStore.queryMessage()
    }).catch(() => {
        console.log('取消')
    })
}

// 监听分页变化
watch(() => pageNumber.value, () => {
    hideOverflow(600)
})

// 监听搜索关键词变化，重置分页
watch(() => searchKeyword.value, () => {
    if (pageNumber.value > total.value) {
        pageNumber.value = 1
    }
})
</script>

<style scoped>
@reference "../../App.css";

.chat-list-container {
    @apply bg-white/60 backdrop-blur-lg rounded-2xl p-4;
    @apply border border-gray-200/50 shadow-lg;
}

.chat-list {
    @apply space-y-0;
}

/* 搜索结果提示 */
.search-result-info {
    @apply flex items-center justify-between mb-4 p-3;
    @apply bg-blue-50/80 backdrop-blur-sm rounded-lg;
    @apply border border-blue-200/50;
}

.result-text {
    @apply text-sm text-blue-700 font-medium;
}

/* 空搜索结果 */
.empty-search {
    @apply bg-white/60 backdrop-blur-lg rounded-xl p-12 mb-4;
    @apply border border-gray-200/50 shadow-sm;
    @apply text-center;
}

.empty-icon {
    @apply text-4xl text-gray-400 mb-3;
}

.empty-search p {
    @apply text-gray-500 mb-4;
}

.pagination {
    @apply flex gap-2 items-center justify-center mt-4 pt-4;
    @apply border-t border-gray-200;
}

.page-info {
    @apply text-sm text-gray-600 ml-auto;
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.list-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.list-move {
    transition: transform 0.3s ease;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .chat-list-container {
        @apply p-2 rounded-lg;
        @apply border-0 shadow-md;
    }

    .chat-list {
        @apply space-y-0;
    }

    .search-result-info {
        @apply flex-col items-start gap-2 p-2;
    }

    .result-text {
        @apply text-xs;
    }

    .empty-search {
        @apply p-8;
    }

    .empty-icon {
        @apply text-3xl;
    }

    .pagination {
        @apply flex-col gap-2 mt-3 pt-3;
    }

    .page-info {
        @apply ml-0 text-xs text-center;
        @apply order-first;
    }

    .pagination :deep(.el-button) {
        @apply flex-1 w-full;
        @apply text-sm;
    }
}
</style>