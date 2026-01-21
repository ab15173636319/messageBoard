<template>
    <div class="message-manage">
        <div class="header">
            <h2 class="title">留言管理</h2>
            <p class="desc">管理所有用户的留言</p>
        </div>
        <div class="content">
            <ChatList :list="messageList" :manage="true" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ChatList from "@/components/layout/ChatList.vue";
import { useMessageStore } from "@/stores/modules/message";
import type { MessageItem } from "@/types/message";

const messageStore = useMessageStore();
const loading = ref(false);
const messageList = ref<MessageItem[]>([]);

const loadMessages = async () => {
    loading.value = true;
    try {
        await messageStore.queryMessage();
        messageList.value = messageStore.messageList;
    } catch (error) {
        console.error("加载留言失败:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadMessages();
});
</script>

<style scoped>
@reference "../../App.css";

.message-manage {
    @apply w-full p-6 bg-white rounded-lg shadow-md;
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
</style>
