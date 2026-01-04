const express = require("express");
const testRouter = require("./router/testRouter");
const connect = require("./config/mongoDB");
const validateToken = require("./middleware/validateToken");
const cors = require("cors");
const userRouter = require("./router/userRouter");
const messageRouter = require("./router/messageRouter");
const app = express();

// 解析 JSON 请求体
app.use(express.json());
// 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true }));
// 跨域配置
app.use(cors());

app.use("/", testRouter);
app.use("/message", validateToken, messageRouter);
app.use("/user", validateToken, userRouter);
app.listen(3000, () => {
  console.log("服务器启动成功，在3000端口上运行，地址：http://localhost:3000");
});
