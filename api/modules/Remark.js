const generateUid = require("../utils/getUid");

class Remark {
  constructor(data) {
    this.rid = data.rid || generateUid();
    this.content = data.content || "";
    this.time = data.time || Date.now();
    this.name = data.name || "";
    this.mid = data.mid;
    this.uid = data.uid;
  }
}

module.exports = Remark;
