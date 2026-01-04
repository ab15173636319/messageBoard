const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./config.env" });

const CONFIG = process.env;
const salt = bcrypt.genSaltSync(10);

function cryp(password) {
  return bcrypt.hashSync(password, salt);
}

function comparePawword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

module.exports = { cryp, comparePawword };
