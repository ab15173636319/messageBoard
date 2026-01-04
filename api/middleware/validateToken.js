const { verifyToken } = require("../utils/token");
const mongoDB = require("../config/mongoDB");
const whiteList = ["/signup", "/login", "/test"];
const vaildateToken = async (req, res, next) => {
  const token = req.headers.token;
  const path = req.path;
  const method = req.method;
  if (method === "GET" || whiteList.includes(path)) {
    return next();
  }
  if (!token) {
    return res.send({
      code: 401,
      message: "请先登录",
    });
  }
  const decoded = verifyToken(token);
  if (!decoded || !decoded.username) {
    return res.send({
      code: 401,
      message: "Token 无效",
    });
  }
  try {
    const { collection } = await mongoDB("users");
    const user = await collection.findOne({ username: decoded.username });
    if (!user) {
      return res.send({
        code: 401,
        message: "用户不存在",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("验证用户时出错:", error);
    return res.send({
      code: 500,
      message: "验证用户失败",
    });
  }
};

module.exports = vaildateToken;
