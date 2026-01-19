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
        <div class="item-actions flex flex-col justify-center align-center md:flex-row">
            <el-button v-if="props.manage" type="danger" plain icon="EditPen" size="small" @click="handleDelete">
                删除
            </el-button>
            <el-button v-else type="primary" plain icon="EditPen" size="small" @click="handleReplay">
                回复
            </el-button>
            <el-button style="margin: 0" type="success" plain icon="View" size="small" @click="handleView">
                查看
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MessageItem } from "@/types/message";
import { formatTime } from "@/utils/dayJs";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
    item: MessageItem;
    manage?: boolean;
}>();

const setAvatar = computed(() => {
    if (!props.item.avatar) throw new Error("avatar is required.");
    const acceptExts = [".gif", ".png", ".jpg", ".jpeg", ".webp"];
    const endWith = props.item.avatar.substr(props.item.avatar.lastIndexOf("."));
    if (!acceptExts.includes(endWith))
        throw new Error("avatar must be a valid image file.");
    return props.item.avatar;
});

const emit = defineEmits<{
    (e: "replay", item: MessageItem): void;
    (e: "view", item: MessageItem): void;
    (e: "delete", item: MessageItem): void;
}>();

const handleReplay = () => {
    emit("replay", props.item);
};

const handleView = () => {
    router.push({
        name: "Message",
        params: {
            id: props.item._id,
        },
    });
};

const handleDelete = () => {
    emit("delete", props.item);
};
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
    @apply flex items-center gap-2 shrink-0;
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
        @apply flex flex-row justify-end gap-1.5;
        @apply w-full;
    }

    .item-actions :deep(.el-button) {
        @apply text-xs px-2 py-1;
        @apply flex-1;
    }

    .item-actions :deep(.el-button span) {
        @apply hidden;
    }
}
</style>
