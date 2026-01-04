const jwt = require("jsonwebtoken");

function generateToken(username) {
  console.log(username);

  return jwt.sign({ username }, "nodeJs", {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

function verifyToken(token) {
  if (!token || typeof token !== "string") {
    console.log("Token 不存在或不是字符串");
    return null;
  }

  token = token.trim().replace(/^["']|["']$/g, "");

  if (!token.includes(".")) {
    console.log("Token 格式不正确:", token);
    return null;
  }

  try {
    return jwt.verify(token, "nodeJs", { algorithms: ["HS256"] });
  } catch (err) {
    console.error("Token 验证失败:", err.message);
    return null;
  }
}

module.exports = { generateToken, verifyToken };
