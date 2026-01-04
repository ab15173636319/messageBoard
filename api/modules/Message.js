const generateUid = require("../utils/getUid");

class Message {
  constructor(data) {
    this.uid = data.uid;
    this.mid = data.mid || generateUid();
    this.content = data.content || "";
    this.time = data.time || Date.now();
    this.name = data.name || "";
    this.replyCount = data.replyCount || 0;
    this.likeCount = data.likeCount || 0;
    this.isHide = data.isHide || false;
  }
}

module.exports = Message;
