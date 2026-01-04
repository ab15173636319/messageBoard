import {
  deleteMessageApi,
  queryMessageApi,
  queryMessageByUidApi,
  sendMessageApi,
  addRemarkApi,
  queryRemarkApi,
  updateRemarkApi,
  deleteRemarkApi,
  queryMyRemarksApi,
  addLikeApi,
  cancelLikeApi,
  toggleLikeApi,
  queryLikeApi,
} from "@/api/message";
import type {
  MessageItem,
  MessageParams,
  QueryMessageParams,
  RemarkParams,
  LikeParams,
  RemarkItem,
} from "@/types/message";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserStore } from "./user";

export const useMessageStore = defineStore("message", () => {
  const messageList = ref<MessageItem[]>([]);
  const loading = ref(false);

  const sendMessage = async (data: MessageParams) => {
    try {
      loading.value = true;
      const res = await sendMessageApi(data);
      // @ts-ignore
      if (res.code === 200) {
        ElMessage.success("发送成功！");
        // 发送成功后刷新列表
        await queryMessage();
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
      }
    } catch (error) {
      console.error("发送消息失败:", error);
    } finally {
      loading.value = false;
    }
  };

  const queryMessage = async (data?: QueryMessageParams) => {
    try {
      loading.value = true;
      const res = await queryMessageApi(data);
      // @ts-ignore
      if (res.code === 200) {
        messageList.value = res.data;
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
      }
    } catch (error) {
      console.error("查询消息失败:", error);
    } finally {
      loading.value = false;
    }
  };

  const queryMessageByUid = async () => {
    try {
      loading.value = true;
      const res = await queryMessageByUidApi();
      // @ts-ignore
      if (res.code === 200) {
        messageList.value = res.data;
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
      }
    } catch (error) {
      console.error("查询用户消息失败:", error);
    } finally {
      loading.value = false;
    }
  };

  const deleteMessage = async (data: { mid: string }) => {
    try {
      loading.value = true;
      const res = await deleteMessageApi(data);
      // @ts-ignore
      if (res.code === 200) {
        ElMessage.success("删除成功！");
        await queryMessage();
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
      }
    } catch (error) {
      console.error("删除消息失败:", error);
    } finally {
      loading.value = false;
    }
  };

  // 回复相关方法
  const addRemark = async (data: RemarkParams) => {
    try {
      loading.value = true;
      const res = await addRemarkApi(data);
      // @ts-ignore
      if (res.code === 200) {
        ElMessage.success("回复成功！");
        // 刷新当前消息的回复列表
        await queryRemark(data.mid);
        // 刷新消息列表
        await queryMessage();
        return true;
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
        return false;
      }
    } catch (error) {
      console.error("添加回复失败:", error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const queryRemark = async (mid: string) => {
    try {
      const res = await queryRemarkApi(mid);
      // @ts-ignore
      if (res.code === 200) {
        // 更新对应消息的回复列表
        const message = messageList.value.find((msg) => msg.mid === mid);
        if (message) {
          message.remark = res.data;
          message.replyCount = res.data.length;
        }
        return res.data;
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
        return [];
      }
    } catch (error) {
      console.error("查询回复失败:", error);
      return [];
    }
  };

  const updateRemark = async (data: { rid: string; content: string }) => {
    try {
      loading.value = true;
      const res = await updateRemarkApi(data);
      // @ts-ignore
      if (res.code === 200) {
        ElMessage.success("更新成功！");
        // 找到对应的消息并刷新回复列表
        const message = messageList.value.find((msg) =>
          msg.remark.some((r) => r.rid === data.rid)
        );
        if (message) {
          await queryRemark(message.mid);
        }
        return true;
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
        return false;
      }
    } catch (error) {
      console.error("更新回复失败:", error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteRemark = async (data: { rid: string }) => {
    try {
      loading.value = true;
      const res = await deleteRemarkApi(data);
      // @ts-ignore
      if (res.code === 200) {
        ElMessage.success("删除成功！");
        // 找到对应的消息并刷新回复列表
        const message = messageList.value.find((msg) =>
          msg.remark.some((r) => r.rid === data.rid)
        );
        if (message) {
          await queryRemark(message.mid);
        }
        // 刷新消息列表
        await queryMessage();
        return true;
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
        return false;
      }
    } catch (error) {
      console.error("删除回复失败:", error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const queryMyRemarks = async () => {
    try {
      loading.value = true;
      const res = await queryMyRemarksApi();
      // @ts-ignore
      if (res.code === 200) {
        return res.data;
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
        return [];
      }
    } catch (error) {
      console.error("查询我的回复失败:", error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  // 点赞相关方法
  const toggleLike = async (data: LikeParams) => {
    try {
      const res = await toggleLikeApi(data);
      // @ts-ignore
      if (res.code === 200) {
        // 更新消息的点赞状态和数量
        const message = messageList.value.find((msg) => msg.mid === data.mid);
        if (message) {
          message.isLiked = res.data.isLiked;
          message.likeCount = res.data.isLiked
            ? (message.likeCount || 0) + 1
            : Math.max((message.likeCount || 0) - 1, 0);
        }
        return res.data.isLiked;
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
        return null;
      }
    } catch (error) {
      console.error("点赞操作失败:", error);
      return null;
    }
  };

  const queryLike = async (mid: string) => {
    try {
      const userStore = useUserStore();
      const uid = userStore.userInfo?.uid;
      if (!uid) return false;

      const res = await queryLikeApi(mid, uid);
      // @ts-ignore
      if (res.code === 200) {
        // 更新消息的点赞状态
        const message = messageList.value.find((msg) => msg.mid === mid);
        if (message) {
          message.isLiked = res.data.isLiked;
        }
        return res.data.isLiked;
      }
      return false;
    } catch (error) {
      console.error("查询点赞状态失败:", error);
      return false;
    }
  };

  // 批量查询点赞状态
  const batchQueryLikes = async (mids: string[]) => {
    try {
      const userStore = useUserStore();
      const uid = userStore.userInfo?.uid;
      if (!uid || mids.length === 0) return;

      for (const mid of mids) {
        await queryLike(mid);
      }
    } catch (error) {
      console.error("批量查询点赞状态失败:", error);
    }
  };

  return {
    messageList,
    loading,
    sendMessage,
    queryMessage,
    queryMessageByUid,
    deleteMessage,
    addRemark,
    queryRemark,
    updateRemark,
    deleteRemark,
    queryMyRemarks,
    toggleLike,
    queryLike,
    batchQueryLikes,
  };
});
