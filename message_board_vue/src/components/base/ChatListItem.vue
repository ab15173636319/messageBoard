<template>
    <div class="chat-list-item">
        <div class="item-header">
            <div class="avatar-wrapper">
                <img class="lazy-image avatar" :src="props.item.user?.avatar || '/avatar.png'" :alt="props.item.name" />
            </div>
            <div class="item-info">
                <div class="item-title">
                    <h2 class="username">{{ props.item.name }}</h2>
                    <span class="time">{{ formatTime(new Date(props.item.time)) }}</span>
                </div>
                <div class="line-clamp-1 text-sm">{{ props.item.content }}</div>
            </div>
        </div>
        <div class="item-actions">
            <el-button v-if="props.manage" type="danger" plain :icon="Delete" size="small" @click="handleDelete"
                class="action-btn">
                <span class="btn-text">删除</span>
            </el-button>
            <el-button v-else type="primary" plain :icon="Comment" size="small" @click="handleReplay"
                class="action-btn">
                <span class="btn-text">回复</span>
            </el-button>
            <el-button type="info" plain :icon="View" size="small" @click="handleView" class="action-btn">
                <span class="btn-text">查看</span>
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MessageItem } from "@/types/message";
import { formatTime } from "@/utils/dayJs";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { EditPen, View, Delete, Comment } from "@element-plus/icons-vue"; // 导入图标

const router = useRouter();
const props = defineProps<{
    item: MessageItem;
    manage?: boolean;
}>();

// ... 其他代码保持不变
</script>

<style scoped>
@reference "../../App.css";

.chat-list-item {
    @apply bg-white/80 backdrop-blur-xl rounded-xl p-4 mb-3;
    @apply border border-gray-200/50 shadow-sm;
    @apply flex items-center justify-between gap-4;
    transition: all 0.3s ease;
}

.chat-list-item:hover {
    @apply shadow-md bg-white/90;
}

.item-header {
    @apply flex items-center gap-4 flex-1 min-w-0;
}

.avatar-wrapper {
    @apply shrink-0;
}

.avatar {
    @apply w-14 h-14 object-cover rounded-full;
    @apply border-2 border-blue-100;
}

.item-info {
    @apply flex-1 min-w-0;
}

.item-title {
    @apply flex items-center gap-3 mb-2;
}

.username {
    @apply text-lg font-bold text-gray-800;
    @apply cursor-pointer hover:text-blue-600 transition-colors;
    @apply truncate;
}

.time {
    @apply text-xs text-gray-500 shrink-0 ml-auto;
}

.item-content {
    @apply text-gray-700 text-sm leading-relaxed;
    @apply line-clamp-2;
}

.item-actions {
    @apply flex flex-col gap-2 shrink-0;
}

.action-btn {
    @apply flex items-center justify-center;
}

.btn-text {
    @apply ml-1;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .chat-list-item {
        @apply flex-col items-stretch gap-2 p-3 mb-2;
        @apply rounded-lg;
    }

    .item-header {
        @apply gap-2;
    }

    .avatar {
        @apply w-10 h-10;
        @apply border;
    }

    .item-title {
        @apply gap-2 mb-1;
    }

    .username {
        @apply text-sm;
    }

    .time {
        @apply text-xs;
    }

    .item-content {
        @apply text-xs leading-relaxed;
        @apply line-clamp-2;
    }

    .item-actions {
        @apply flex-row justify-end gap-1.5 w-full mt-2;
        @apply flex-wrap;
        /* 允许换行 */
    }

    .action-btn {
        @apply flex-1 min-w-[60px] max-w-[100px];
        @apply py-1.5 px-2;
    }

    /* 在更小的屏幕上隐藏文本，只显示图标 */
    @media (max-width: 480px) {
        .btn-text {
            @apply hidden sm:block;
        }

        .action-btn {
            @apply min-w-[auto] p-2;
        }
    }
}
</style>
