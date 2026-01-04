const uuid = require("uuid");

function generateUid() {
  return uuid.v4();
}

module.exports = generateUid;
