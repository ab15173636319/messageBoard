import type {
  MessageParams,
  QueryMessageParams,
  RemarkParams,
  LikeParams,
} from "@/types/message";
import { get, post } from "@/utils/request";

async function sendMessageApi(data: MessageParams) {
  try {
    const res = await post("/message/sendMessage", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function queryMessageApi(data?: QueryMessageParams) {
  try {
    const res = await get("/message/queryMessage", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function queryMessageByUidApi() {
  try {
    const res = await post("/message/queryMessageByUid");
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function deleteMessageApi(data: { mid: string }) {
  try {
    const res = await post("/message/deleteMessage", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

// 回复相关 API
async function addRemarkApi(data: RemarkParams) {
  try {
    const res = await post("/message/remark", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function queryRemarkApi(mid: string) {
  try {
    const res = await get("/message/queryRemark", { mid });
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function updateRemarkApi(data: { rid: string; content: string }) {
  try {
    const res = await post("/message/updateRemark", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function deleteRemarkApi(data: { rid: string }) {
  try {
    const res = await post("/message/deleteRemark", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function queryMyRemarksApi() {
  try {
    const res = await post("/message/queryMyRemarks");
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

// 点赞相关 API
async function addLikeApi(data: LikeParams) {
  try {
    const res = await post("/message/addLike", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function cancelLikeApi(data: LikeParams) {
  try {
    const res = await post("/message/cancelLike", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function toggleLikeApi(data: LikeParams) {
  try {
    const res = await post("/message/toggleLike", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function queryLikeApi(mid: string, uid?: string) {
  try {
    const params: any = { mid };
    if (uid) params.uid = uid;
    const res = await get("/message/queryLike", params);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

export {
  sendMessageApi,
  queryMessageApi,
  queryMessageByUidApi,
  deleteMessageApi,
  addRemarkApi,
  queryRemarkApi,
  updateRemarkApi,
  deleteRemarkApi,
  queryMyRemarksApi,
  addLikeApi,
  cancelLikeApi,
  toggleLikeApi,
  queryLikeApi,
};
