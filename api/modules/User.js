const generateUid = require("../utils/getUid");

class User {
  constructor(data) {
    this.uid = data.uid;
    this.nickname = data.nickname || "";
    this.username = data.username || "";
    this.password = data.password || "";
    this.email = data.email || "";
    this.phone = data.phone || "";
    this.createTime = data.createTime;
    this.role = data.role || "user";
    this.status = data.status || "active"; //
    this.isDelete = data.isDelete || false; // 是否删除
    this.avatar = data.avatar || "";
  }
}

module.exports = User;
