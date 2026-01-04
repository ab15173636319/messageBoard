const generateUid = require("../utils/getUid");

class Like {
  constructor(data) {
    this.lid = data.lid || generateUid();
    this.mid = data.mid;
    this.uid = data.uid;
    this.time = data.time || Date.now();
  }
}

module.exports = Like;
