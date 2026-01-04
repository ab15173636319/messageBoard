import type { UserInfo } from "./user";

interface MessageParams {
  content: string;
  name: string;
}

interface QueryMessageParams {
  queryByUid: boolean;
}

interface RemarkItem {
  rid: string;
  mid: string;
  content: string;
  time: number;
  name: string;
  uid: string;
  user?: UserInfo;
  message?: MessageItem; // 关联的消息信息（在查询我的回复时返回）
}

interface RemarkParams {
  mid: string;
  content: string;
  name?: string;
}

interface LikeParams {
  mid: string;
}

interface MessageItem {
  _id: string;
  mid: string;
  content: string;
  avatar?: string;
  time: string;
  name: string;
  uid: string;
  replyCount: number;
  likeCount: number;
  remark: RemarkItem[];
  user?: UserInfo;
  isLiked?: boolean;
}

export type {
  MessageParams,
  MessageItem,
  QueryMessageParams,
  RemarkItem,
  RemarkParams,
  LikeParams,
};
