const express = require("express");
const connect = require("../config/mongoDB");
const { comparePawword, cryp } = require("../utils/comparePassword");
const User = require("../modules/User");
const { generateToken } = require("../utils/token");
const generateUid = require("../utils/getUid");
const router = express.Router();

router.get("/queryUser", async (req, res) => {
  try {
    const { db, collection } = await connect("users");
    const result = await collection.find({}).toArray();
    res.send({
      code: 200,
      message: "查询所有用户成功",
      data: result,
    });
  } catch (e) {
    res.send({
      code: 500,
      message: `查询用户失败：${e}`,
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send({
      code: 400,
      message: "用户名和密码不能为空",
    });
  }
  try {
    const { db, collection } = await connect("users");
    const result = await collection.findOne({ username });
    if (!result) {
      return res.send({
        code: 400,
        message: "用户不存在",
      });
    }

    if (!comparePawword(password, result.password)) {
      return res.send({
        code: 400,
        message: "密码错误",
      });
    }
    const token = generateToken(result.username);
    res.send({
      code: 200,
      message: "登录成功",
      data: { token },
    });
  } catch (error) {
    res.send({
      code: 500,
      message: `登录失败：${error}`,
    });
  }
});

router.post("/signup", async (req, res) => {
  const { username, password, email, nickname } = req.body;
  if (!username || !password) {
    return res.send({
      code: 400,
      message: "用户名和密码不能为空",
    });
  }
  try {
    const { db, collection } = await connect("users");
    // 检查用户名是否已存在
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.send({
        code: 400,
        message: "用户名已存在",
      });
    }
    // 加密密码
    const hashedPassword = cryp(password);
    const user = new User({
      username,
      password: hashedPassword,
      email,
      nickname,
    });
    user.uid = generateUid();
    user.createTime = Date.now();
    const result = await collection.insertOne(user);
    if (result.insertedId) {
      return res.send({
        code: 200,
        message: "注册成功",
        data: { username: user.username, uid: user.uid },
      });
    }
    res.send({
      code: 500,
      message: "注册失败",
    });
  } catch (error) {
    res.send({
      code: 500,
      message: `注册失败：${error}`,
    });
  }
});

router.post("/queryUserInfo", async (req, res) => {
  const user = new User(req.user);
  if (user) {
    user.password = "保密，不给看";
    return res.send({
      code: 200,
      message: "查询用户信息成功",
      data: user,
    });
  }
  res.send({
    code: 401,
    message: "请先登录",
  });
});

router.post("/updateUserInfo", async (req, res) => {
  try {
    const { nickname, email, phone } = req.body;
    console.log(req.body);
    const currentUser = req.user;

    // 构建更新对象，只包含有值且与原值不同的字段
    const updateData = {};

    if (
      nickname !== undefined &&
      nickname !== null &&
      nickname !== "" &&
      nickname !== currentUser.nickname
    ) {
      updateData.nickname = nickname;
    }

    if (
      email !== undefined &&
      email !== null &&
      email !== "" &&
      email !== currentUser.email
    ) {
      updateData.email = email;
    }

    if (
      phone !== undefined &&
      phone !== null &&
      phone !== "" &&
      phone !== currentUser.phone
    ) {
      updateData.phone = phone;
    }

    // 如果没有需要更新的字段，返回提示
    if (Object.keys(updateData).length === 0) {
      return res.send({
        code: 400,
        message: "没有需要更新的信息，或传入的值与原值相同",
      });
    }

    // 更新用户信息
    const { collection } = await connect("users");
    const result = await collection.updateOne(
      { username: currentUser.username },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      // 获取更新后的用户信息
      const updatedUser = await collection.findOne({
        username: currentUser.username,
      });
      updatedUser.password = "保密，不给看";
      return res.send({
        code: 200,
        message: "修改用户信息成功",
        data: updatedUser,
      });
    }

    res.send({
      code: 500,
      message: "修改用户信息失败",
    });
  } catch (error) {
    res.send({
      code: 500,
      message: `修改用户信息失败：${error}`,
    });
  }
});

router.post("/updatePassword", async (req, res) => {
  console.log(req.body);

  try {
    const { oldPassword, newPassword } = req.body;
    const currentUser = req.user;

    // 验证必填参数
    if (!oldPassword || !newPassword) {
      return res.send({
        code: 400,
        message: "旧密码和新密码不能为空",
      });
    }

    // 验证旧密码是否与数据库中的密码相同
    if (!comparePawword(oldPassword, currentUser.password)) {
      return res.send({
        code: 400,
        message: "旧密码错误，无法修改密码",
      });
    }

    // 加密新密码
    const hashedNewPassword = cryp(newPassword);

    // 更新密码
    const { collection } = await connect("users");
    const result = await collection.updateOne(
      { username: currentUser.username },
      { $set: { password: hashedNewPassword } }
    );

    if (result.modifiedCount > 0) {
      return res.send({
        code: 200,
        message: "修改密码成功",
      });
    }

    res.send({
      code: 500,
      message: "修改密码失败",
    });
  } catch (error) {
    res.send({
      code: 500,
      message: `修改密码失败：${error}`,
    });
  }
});

router.post("/updateAvatar", async (req, res) => {
  try {
    const { avatar } = req.body;
    const currentUser = req.user;

    // 验证必填参数
    if (!avatar || avatar === "") {
      return res.send({
        code: 400,
        message: "头像链接不能为空",
      });
    }

    // 验证链接合法性，必须以 http:// 或 https:// 开头
    if (!avatar.startsWith("http://") && !avatar.startsWith("https://")) {
      return res.send({
        code: 400,
        message: "头像链接格式不正确，必须以 http:// 或 https:// 开头",
      });
    }

    // 如果传入的头像链接与原值相同，不进行更新
    if (avatar === currentUser.avatar) {
      return res.send({
        code: 400,
        message: "头像链接与原值相同，无需修改",
      });
    }

    // 更新头像
    const { collection } = await connect("users");
    const result = await collection.updateOne(
      { username: currentUser.username },
      { $set: { avatar } }
    );

    if (result.modifiedCount > 0) {
      // 获取更新后的用户信息
      const updatedUser = await collection.findOne({
        username: currentUser.username,
      });
      // 更新 req.user，保持与数据库同步
      req.user = updatedUser;
      updatedUser.password = "保密，不给看";
      return res.send({
        code: 200,
        message: "修改头像成功",
        data: updatedUser,
      });
    }

    res.send({
      code: 500,
      message: "修改头像失败",
    });
  } catch (error) {
    res.send({
      code: 500,
      message: `修改头像失败：${error}`,
    });
  }
});

module.exports = router;
