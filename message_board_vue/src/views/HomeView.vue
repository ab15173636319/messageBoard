<template>
    <div class="home-view">
        <div class="content-wrapper">
            <div class="chat-section h-auto border-2 border-gray-200 rounded-lg p-4 shadow-xl">
                <div class="flex justify-center items-center">
                    <div class="flex justify-center items-center rounded-full shadow-lg shadow-cyan-500/50 mb-10">
                        <LazyImage :src="userStore.userInfo?.avatar || '/avatar.svg'" :width="200" shape="circle"
                            aspect-ratio="1:1">
                        </LazyImage>
                    </div>
                </div>

                <el-form label-position="top" ref="messageFormRef" :model="messageForm" :rules="rules">
                    <el-form-item prop="name" label="标题">
                        <el-input v-model="messageForm.name" placeholder="请输入标题..."></el-input>
                    </el-form-item>
                    <el-form-item prop="content" label="内容">
                        <Chat v-model="messageForm.content" placeholder="请输入内容..." :min-height="'200px'"
                            :max-height="'400px'">
                        </Chat>
                    </el-form-item>
                    <el-form-item>
                        <div class="flex justify-end w-full">
                            <el-button type="primary" @click="handleSend">发送</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="list-section" v-loading="messageStore.loading">
                <chat-list :list="messageStore.messageList"></chat-list>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Chat from "@/components/layout/Chat.vue";
import ChatList from "@/components/layout/ChatList.vue";
import { onMounted, ref } from "vue";
import { useMessageStore } from "@/stores/modules/message";
import { useUserStore } from "@/stores/modules/user";
import { ElNotification, type FormInstance } from "element-plus";
import type { QueryMessageParams } from "@/types/message";
import type { ChatItem } from "@/types/chat";
import { storeToRefs } from "pinia";
import LazyImage from "@/components/Image/lazyImage.vue";

const messageStore = useMessageStore();
const userStore = useUserStore();
const messageFormRef = ref<FormInstance>();
const messageForm = ref({
    content: "",
    name: "",
});
const query = ref<QueryMessageParams>({
    queryByUid: false,
});
const rules = {
    name: [
        { required: true, message: "请输入标题", trigger: ["blur", "change"] },
    ],
    content: [
        { required: true, message: "请输入内容", trigger: ["blur", "change"] },
    ],
};
const handleSend = async () => {
    messageFormRef.value?.validate(async (valid) => {
        if (valid) {
            await messageStore.sendMessage({
                content: messageForm.value.content,
                name: messageForm.value.name,
            });
            // 发送成功后清空表单
            messageForm.value.content = "";
            messageForm.value.name = "";
            messageFormRef.value?.resetFields();
        }
    });
};

// 初始化时查询消息列表
onMounted(() => {
    messageStore.queryMessage();
});
</script>

<style scoped>
@reference "../App.css";

.home-view {
    @apply min-h-screen bg-white;
}

.content-wrapper {
    @apply max-w-7xl mx-auto px-4 py-6;
    @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.chat-section {
    @apply w-full;
}

.list-section {
    @apply w-full;
}

/* 移动端适配 */
@media (max-width: 1024px) {
    .content-wrapper {
        @apply grid-cols-1 gap-4;
    }

    .content-wrapper {
        @apply px-3 py-4;
    }
}

@media (max-width: 768px) {
    .content-wrapper {
        @apply px-2 py-3 gap-3;
    }
}
</style>
