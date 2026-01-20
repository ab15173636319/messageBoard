<template>
  <div class="message-view">
    <div class="content-container">
      <!-- 返回按钮 -->
      <div class="back-button">
        <el-button @click="goBack" icon="ArrowLeft" plain size="large">
          返回
        </el-button>
      </div>

      <!-- 主留言卡片 -->
      <div
        v-if="currentMessage"
        class="message-card"
        v-loading="messageStore.loading"
      >
        <div class="message-header">
          <!-- 头像 -->
          <div class="avatar-wrapper">
            <img
              class="lazy-image avatar"
              :src="currentMessage.user?.avatar || '/avatar.svg'"
              :alt="currentMessage.name"
            />
          </div>

          <!-- 用户信息 -->
          <div class="user-info">
            <h2 class="username">{{ currentMessage.name }}</h2>
            <span class="time">{{ formatTime(currentMessage.time) }}</span>
          </div>
        </div>

        <!-- 留言内容 -->
        <div class="message-content" v-html="currentMessage.content"></div>

        <!-- 操作栏 -->
        <div class="message-actions">
          <div class="action-item">
            <el-icon>
              <ChatLineRound />
            </el-icon>
            <span>{{ currentMessage.replyCount || 0 }}</span>
          </div>
          <div class="action-item">
            <el-icon>
              <Star />
            </el-icon>
            <span>{{ currentMessage.likeCount || 0 }}</span>
          </div>
          <el-button
            :type="currentMessage?.isLiked ? 'primary' : 'default'"
            size="small"
            plain
            :icon="Star"
            @click="handleReward"
          >
            {{ currentMessage?.isLiked ? "已点赞" : "点赞" }}
          </el-button>
        </div>
      </div>

      <!-- 回复列表 -->
      <div
        v-if="
          currentMessage &&
          currentMessage.remark &&
          currentMessage.remark.length > 0
        "
        class="replies-section"
      >
        <h3 class="section-title">回复 ({{ currentMessage.remark.length }})</h3>
        <div class="replies-list">
          <TransitionGroup name="list">
            <div
              v-for="reply in currentMessage.remark"
              :key="reply.rid"
              class="reply-card"
            >
              <div class="reply-header">
                <img
                  class="reply-avatar"
                  :src="reply.user?.avatar || '/avatar.svg'"
                  :alt="reply.user?.nickname || reply.name"
                />
                <div class="reply-info">
                  <span class="reply-name">{{
                    reply.user?.nickname || reply.name
                  }}</span>
                  <span class="reply-time">{{
                    formatTime(new Date(reply.time))
                  }}</span>
                </div>
                <div v-if="isMyRemark(reply)" class="reply-actions">
                  <el-button
                    v-if="editingRemarkId !== reply.rid"
                    text
                    type="primary"
                    size="small"
                    :icon="Edit"
                    @click="startEditRemark(reply)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    text
                    type="danger"
                    size="small"
                    :icon="Delete"
                    @click="handleDeleteRemark(reply)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              <!-- 编辑模式 -->
              <div v-if="editingRemarkId === reply.rid" class="reply-edit">
                <Chat
                  v-model="editingContent"
                  placeholder="编辑回复..."
                  :min-height="'100px'"
                  :max-height="'200px'"
                />
                <div class="edit-actions">
                  <el-button size="small" @click="cancelEdit">取消</el-button>
                  <el-button type="primary" size="small" @click="saveEdit"
                    >保存</el-button
                  >
                </div>
              </div>
              <!-- 显示模式 -->
              <div v-else class="reply-content" v-html="reply.content"></div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- 暂无回复提示 -->
      <div
        v-else-if="
          currentMessage &&
          (!currentMessage.remark || currentMessage.remark.length === 0)
        "
        class="empty-replies"
      >
        <el-icon class="empty-icon">
          <ChatLineRound />
        </el-icon>
        <p>暂无回复，快来抢沙发吧！</p>
      </div>

      <!-- 回复输入框 -->
      <div class="reply-input-card">
        <h3 class="section-title">发表回复</h3>
        <Chat
          v-model="replyContent"
          v-replay="isReply"
          placeholder="写下你的回复..."
          :min-height="'150px'"
          :max-height="'300px'"
        />
        <div class="input-actions">
          <el-button @click="clearReply">清空</el-button>
          <el-button
            type="primary"
            @click="submitReply"
            :disabled="!replyContent.trim()"
          >
            发表回复
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import Chat from "@/components/layout/Chat.vue";
import type { ChatItem } from "@/types/chat";
import {
  ChatLineRound,
  Star,
  ArrowLeft,
  Delete,
  Edit,
} from "@element-plus/icons-vue";
import { useMessageStore } from "@/stores/modules/message";
import { useUserStore } from "@/stores/modules/user";
import type { MessageItem, RemarkItem } from "@/types/message";
import { formatTime } from "@/utils/dayJs";

const route = useRoute();
const router = useRouter();
const replyContent = ref("");
const messageStore = useMessageStore();
const userStore = useUserStore();
const editingRemarkId = ref<string | null>(null);
const editingContent = ref("");

onMounted(async () => {
  await messageStore.queryMessage();
  // 加载回复列表
  if (currentMessage.value) {
    await messageStore.queryRemark(currentMessage.value.mid);
    // 查询点赞状态
    if (userStore.userInfo) {
      await messageStore.queryLike(currentMessage.value.mid);
    }
  }

  console.log(route.params.id);

  if (!route.params.id) {
    ElMessage.error("错误页面！");
    router.push({
      name: "Home",
    });
  }
});

// 根据路由参数获取当前留言
const currentMessage = computed<MessageItem | null>(() => {
  const id = route.params.id as string;
  const chatList = messageStore.messageList;
  return chatList.find((item) => item.mid === id || item._id === id) || null;
});

// 监听消息变化，重新加载回复
watch(currentMessage, async (newVal) => {
  if (newVal) {
    await messageStore.queryRemark(newVal.mid);
    if (userStore.userInfo) {
      await messageStore.queryLike(newVal.mid);
    }
  }
});

const isReply = computed(() => {
  return Number(route.params.reply) === 1;
});

// 返回上一页
const goBack = () => {
  router.back();
};

// 点赞功能
const handleReward = async () => {
  if (!currentMessage.value) {
    ElMessage.warning("消息不存在");
    return;
  }

  if (!userStore.userInfo) {
    ElMessage.warning("请先登录");
    router.push({ name: "Auth" });
    return;
  }

  const isLiked = await messageStore.toggleLike({
    mid: currentMessage.value.mid,
  });
  if (isLiked !== null) {
    ElMessage.success(isLiked ? "点赞成功！" : "取消点赞成功！");
  }
};

// 清空回复
const clearReply = () => {
  replyContent.value = "";
  editingRemarkId.value = null;
  editingContent.value = "";
};

// 提交回复
const submitReply = async () => {
  if (!replyContent.value.trim()) {
    ElMessage.warning("请输入回复内容");
    return;
  }

  if (!currentMessage.value) {
    ElMessage.error("留言不存在");
    return;
  }

  if (!userStore.userInfo) {
    ElMessage.warning("请先登录");
    router.push({ name: "Auth" });
    return;
  }

  const success = await messageStore.addRemark({
    mid: currentMessage.value.mid,
    content: replyContent.value,
    name: userStore.userInfo.nickname || userStore.userInfo.username,
  });

  if (success) {
    replyContent.value = "";
  }
};

// 编辑回复
const startEditRemark = (remark: RemarkItem) => {
  editingRemarkId.value = remark.rid;
  editingContent.value = remark.content;
};

// 取消编辑
const cancelEdit = () => {
  editingRemarkId.value = null;
  editingContent.value = "";
};

// 保存编辑
const saveEdit = async () => {
  if (!editingContent.value.trim()) {
    ElMessage.warning("请输入回复内容");
    return;
  }

  if (!editingRemarkId.value) return;

  const success = await messageStore.updateRemark({
    rid: editingRemarkId.value,
    content: editingContent.value,
  });

  if (success) {
    editingRemarkId.value = null;
    editingContent.value = "";
  }
};

// 删除回复
const handleDeleteRemark = async (remark: RemarkItem) => {
  try {
    await ElMessageBox.confirm("确定要删除这条回复吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await messageStore.deleteRemark({ rid: remark.rid });
  } catch (error) {
    // 用户取消删除
  }
};

// 检查是否为当前用户的回复
const isMyRemark = (remark: RemarkItem) => {
  return userStore.userInfo && remark.uid === userStore.userInfo.uid;
};

// 检查留言是否存在
onMounted(() => {
  if (!currentMessage.value) {
    ElMessage.error("留言不存在");
    router.push({ name: "Home" });
  }
});
</script>

<style scoped>
@reference "../App.css";

.message-view {
  @apply min-h-screen bg-white;
}

.content-container {
  @apply max-w-4xl mx-auto px-4 py-8;
}

/* 返回按钮 */
.back-button {
  @apply mb-6;
}

/* 主留言卡片 */
.message-card {
  @apply bg-white/80 backdrop-blur-xl rounded-2xl p-6 mb-6;
  @apply border border-gray-200/50 shadow-lg;
  transition: all 0.3s ease;
}

.message-card:hover {
  @apply shadow-xl;
}

.message-header {
  @apply flex items-center gap-4 mb-4;
}

.avatar-wrapper {
  @apply shrink-0;
}

.avatar {
  @apply w-16 h-16 object-cover rounded-full;
  @apply border-2 border-blue-100;
}

.user-info {
  @apply flex-1 flex flex-col gap-1;
}

.username {
  @apply text-xl font-bold text-gray-800;
}

.time {
  @apply text-sm text-gray-500;
}

.message-content {
  @apply text-gray-700 text-base leading-relaxed mb-6;
  @apply px-2;
}

.message-actions {
  @apply flex items-center gap-4 pt-4 border-t border-gray-200;
}

.action-item {
  @apply flex items-center gap-1.5 text-sm text-gray-600;
  @apply cursor-pointer hover:text-blue-600 transition-colors;
}

/* 回复区域 */
.replies-section {
  @apply mb-6;
}

.section-title {
  @apply text-lg font-bold text-gray-800 mb-4;
}

.replies-list {
  @apply space-y-3;
}

.reply-card {
  @apply bg-white/70 backdrop-blur-lg rounded-xl p-4;
  @apply border border-gray-200/50 shadow-sm;
  transition: all 0.3s ease;
}

.reply-card:hover {
  @apply shadow-md bg-white/80;
}

.reply-header {
  @apply flex items-center gap-3 mb-3;
}

.reply-avatar {
  @apply w-10 h-10 object-cover rounded-full;
  @apply border border-gray-200;
}

.reply-info {
  @apply flex items-center gap-2 flex-1;
}

.reply-name {
  @apply font-semibold text-gray-800;
}

.reply-time {
  @apply text-xs text-gray-500;
}

.reply-actions {
  @apply flex items-center gap-1;
}

.reply-edit {
  @apply mt-3;
}

.edit-actions {
  @apply flex justify-end gap-2 mt-2;
}

.reply-content {
  @apply text-gray-700 text-sm leading-relaxed;
  @apply pl-13;
}

/* 空回复提示 */
.empty-replies {
  @apply bg-white/60 backdrop-blur-lg rounded-xl p-12 mb-6;
  @apply border border-gray-200/50 shadow-sm;
  @apply text-center;
}

.empty-icon {
  @apply text-4xl text-gray-400 mb-3;
}

.empty-replies p {
  @apply text-gray-500;
}

/* 回复输入框 */
.reply-input-card {
  @apply bg-white/80 backdrop-blur-xl rounded-2xl p-6;
  @apply border border-gray-200/50 shadow-lg;
}

.input-actions {
  @apply flex justify-end gap-2 mt-4;
}

/* 内容样式 */
:deep(.message-content p),
:deep(.reply-content p) {
  @apply mb-2;
}

:deep(.message-content p:last-child),
:deep(.reply-content p:last-child) {
  @apply mb-0;
}

:deep(.message-content img),
:deep(.reply-content img) {
  @apply max-w-full rounded-lg my-2;
}

/* 按钮样式 */
:deep(.el-button) {
  @apply transition-all duration-200;
}

:deep(.el-icon) {
  @apply text-base;
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
  .content-container {
    @apply px-3 py-4;
  }

  .message-card,
  .reply-input-card {
    @apply p-4 rounded-xl;
  }

  .avatar {
    @apply w-12 h-12;
  }

  .username {
    @apply text-lg;
  }

  .reply-content {
    @apply pl-0;
  }
}
</style>
