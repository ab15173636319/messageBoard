const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const CONFIG = process.env;

async function connect(basename) {
  const url = `mongodb://${CONFIG.MONGODB_USER}:${CONFIG.MONGODB_PASSWORD}@${CONFIG.MONGODB_URI}/?authSource=${CONFIG.MONGODB_DATABASE}`;
  try {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(CONFIG.MONGODB_DATABASE);
    const collection = db.collection(basename);
    return { db, collection };
  } catch (e) {
    throw new Error("mongodb错误：连接时出现错误，连接失败：" + e);
  }
}

module.exports = connect;
