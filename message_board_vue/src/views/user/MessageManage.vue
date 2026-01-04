<template>
    <div class="message-manage">
        <div class="header">
            <h2 class="title">留言管理</h2>
            <p class="desc">管理您的所有留言</p>
        </div>
        <div class="content">
            <chat-list :list="messageStore.messageList" :manage="true"></chat-list>
        </div>
    </div>
</template>

<script setup lang="ts">
import ChatList from '@/components/layout/ChatList.vue';
import { useMessageStore } from '@/stores/modules/message';
import { onMounted } from 'vue';

const messageStore = useMessageStore();

onMounted(() => {
    messageStore.queryMessageByUid()
    console.log(messageStore.messageList);
})
</script>

<style scoped>
@reference "../../App.css";

.message-manage {
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
    @apply flex items-center justify-center min-h-[400px];
}
</style>
