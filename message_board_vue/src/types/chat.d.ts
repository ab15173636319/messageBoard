interface RemarkItem {
  id: string;
  avatar: string;
  content: string;
  time: string;
  name: string;
  uid: string;
}

interface ChatItem {
  _id: string;
  avatar: string;
  content: string;
  time: string;
  name: string;
  uid: string;
  replyCount: number;
  rewardCount: number;
  remark?: RemarkItem[];
}

export type { ChatItem };
