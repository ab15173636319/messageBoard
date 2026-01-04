const express = require("express");
const Message = require("../modules/Message");
const Remark = require("../modules/Remark");
const Like = require("../modules/Like");
const mongoDB = require("../config/mongoDB");
const router = express.Router();
/**
 * 留言相关api
 * 数据库：messages
 * 回复表：remarks
 * 点赞表：likes
 */

// 发送消息
router.post("/sendMessage", async (req, res) => {
  const { content } = req.body;
  const message = new Message({ ...req.body, uid: req.user.uid });
  try {
    const { collection } = await mongoDB("messages");
    const result = await collection.insertOne(message);
    res.send({
      code: 200,
      message: "发送消息成功",
      data: result,
    });
  } catch (error) {
    res.send({
      code: 500,
      message: "发送消息失败",
      data: error,
    });
  }
});

// 查询消息，根据 queryByUid 决定是否按 uid 查询
router.get("/queryMessage", async (req, res) => {
  try {
    const { collection: messageCollection } = await mongoDB("messages");
    const { collection: userCollection } = await mongoDB("users");
    const { collection: remarkCollection } = await mongoDB("remarks");
    const { collection: likeCollection } = await mongoDB("likes");

    // 查询所有消息
    const result = await messageCollection.find().sort({ time: -1 }).toArray();

    // 收集所有唯一的 uid 和 mid
    const uids = [
      ...new Set(result.filter((msg) => msg.uid).map((msg) => msg.uid)),
    ];
    const mids = result.map((msg) => msg.mid);

    // 批量查询用户信息
    const users =
      uids.length > 0
        ? await userCollection.find({ uid: { $in: uids } }).toArray()
        : [];
    const userMap = {};
    users.forEach((user) => {
      userMap[user.uid] = {
        nickname: user.nickname || "",
        uid: user.uid,
        avatar: user.avatar || "",
      };
    });

    // 批量查询所有回复
    const allRemarks =
      mids.length > 0
        ? await remarkCollection
            .find({ mid: { $in: mids } })
            .sort({ time: -1 })
            .toArray()
        : [];

    // 收集回复中的 uid
    const remarkUids = [
      ...new Set(allRemarks.filter((r) => r.uid).map((r) => r.uid)),
    ];

    // 批量查询回复用户信息
    const remarkUsers =
      remarkUids.length > 0
        ? await userCollection.find({ uid: { $in: remarkUids } }).toArray()
        : [];
    const remarkUserMap = {};
    remarkUsers.forEach((user) => {
      remarkUserMap[user.uid] = {
        nickname: user.nickname || "",
        uid: user.uid,
        avatar: user.avatar || "",
      };
    });

    // 为回复添加用户信息并按 mid 分组
    const remarksByMid = {};
    allRemarks.forEach((remark) => {
      if (remark.uid && remarkUserMap[remark.uid]) {
        remark.user = remarkUserMap[remark.uid];
      } else if (remark.uid) {
        remark.user = {
          nickname: "",
          uid: remark.uid,
          avatar: "",
        };
      }

      if (!remarksByMid[remark.mid]) {
        remarksByMid[remark.mid] = [];
      }
      remarksByMid[remark.mid].push(remark);
    });

    // 批量查询点赞信息（如果需要）
    const allLikes =
      mids.length > 0
        ? await likeCollection.find({ mid: { $in: mids } }).toArray()
        : [];
    const likesByMid = {};
    allLikes.forEach((like) => {
      if (!likesByMid[like.mid]) {
        likesByMid[like.mid] = [];
      }
      likesByMid[like.mid].push(like);
    });

    // 整合所有数据到消息中
    result.forEach((msg) => {
      // 添加用户信息
      if (msg.uid && userMap[msg.uid]) {
        msg.user = userMap[msg.uid];
      } else if (msg.uid) {
        msg.user = {
          nickname: "",
          uid: msg.uid,
          avatar: "",
        };
      }

      // 添加回复列表
      msg.remark = remarksByMid[msg.mid] || [];

      // 更新回复数量（确保与实际回复数量一致）
      msg.replyCount = msg.remark.length;

      // 更新点赞数量（确保与实际点赞数量一致）
      msg.likeCount = likesByMid[msg.mid]?.length || 0;
    });

    res.send({
      code: 200,
      message: "查询消息成功",
      data: result,
    });
  } catch (error) {
    console.error("查询消息失败:", error);
    res.send({
      code: 500,
      message: "查询消息失败",
      data: error.message,
    });
  }
});

router.post("/queryMessageByUid", async (req, res) => {
  const { uid } = req.user;
  try {
    const { collection: messageCollection } = await mongoDB("messages");
    const result = await messageCollection.find({ uid }).toArray();

    // 查询用户信息并添加到每个消息中
    if (uid) {
      const { collection: userCollection } = await mongoDB("users");
      const user = await userCollection.findOne({ uid });

      if (user) {
        const userInfo = {
          nickname: user.nickname || "",
          uid: user.uid,
          avatar: user.avatar || "",
        };

        // 为每个消息添加用户信息（nickname、uid、avatar）
        result.forEach((msg) => {
          msg.user = userInfo;
        });
      } else {
        // 如果用户不存在，仍然为消息添加基本的用户信息结构
        const defaultUserInfo = {
          nickname: "",
          uid: uid,
          avatar: "",
        };
        result.forEach((msg) => {
          msg.user = defaultUserInfo;
        });
      }
    }

    res.send({
      code: 200,
      message: "查询消息成功",
      data: result,
    });
  } catch (error) {
    res.send({
      code: 500,
      message: "查询消息失败",
      data: error.message,
    });
  }
});

router.post("/deleteMessage", async (req, res) => {
  const { mid } = req.body;
  console.log(mid);

  try {
    const { collection } = await mongoDB("messages");
    const result = await collection.deleteOne({ mid });
    res.send({
      code: 200,
      message: "删除消息成功",
      data: result,
    });
  } catch (error) {
    res.send({
      code: 500,
      message: "删除消息失败",
      data: error.message,
    });
  }
});

// ==================== 回复功能 API ====================

// 添加回复
router.post("/remark", async (req, res) => {
  const { mid, content, name } = req.body;
  const uid = req.user.uid;

  if (!mid || !content) {
    return res.send({
      code: 400,
      message: "参数不完整，需要 mid 和 content",
    });
  }

  try {
    const { collection: remarkCollection } = await mongoDB("remarks");
    const remark = new Remark({
      mid,
      content,
      name: name || req.user.nickname || "",
      uid,
    });
    const result = await remarkCollection.insertOne(remark);

    // 更新消息的回复数量
    const { collection: messageCollection } = await mongoDB("messages");
    await messageCollection.updateOne({ mid }, { $inc: { replyCount: 1 } });

    res.send({
      code: 200,
      message: "添加回复成功",
      data: result,
    });
  } catch (error) {
    res.send({
      code: 500,
      message: "添加回复失败",
      data: error.message,
    });
  }
});

// 查询所有回复
router.get("/queryAllRemarks", async (req, res) => {
  try {
    const { collection: remarkCollection } = await mongoDB("remarks");
    const { collection: userCollection } = await mongoDB("users");
    const { collection: messageCollection } = await mongoDB("messages");

    // 查询所有回复
    const remarks = await remarkCollection.find().sort({ time: -1 }).toArray();

    // 收集所有唯一的 uid 和 mid
    const uids = [...new Set(remarks.filter((r) => r.uid).map((r) => r.uid))];
    const mids = [...new Set(remarks.filter((r) => r.mid).map((r) => r.mid))];

    // 批量查询用户信息
    const users =
      uids.length > 0
        ? await userCollection.find({ uid: { $in: uids } }).toArray()
        : [];
    const userMap = {};
    users.forEach((user) => {
      userMap[user.uid] = {
        uid: user.uid,
        nickname: user.nickname || "",
        avatar: user.avatar || "",
      };
    });

    // 批量查询消息信息
    const messages =
      mids.length > 0
        ? await messageCollection.find({ mid: { $in: mids } }).toArray()
        : [];
    const messageMap = {};
    messages.forEach((msg) => {
      messageMap[msg.mid] = {
        mid: msg.mid,
        content: msg.content || "",
        name: msg.name || "",
      };
    });

    // 整合数据：为每个回复添加用户信息和消息信息
    const result = remarks.map((remark) => {
      const remarkData = { ...remark };

      // 添加用户信息
      if (remark.uid && userMap[remark.uid]) {
        remarkData.user = userMap[remark.uid];
      } else if (remark.uid) {
        remarkData.user = {
          uid: remark.uid,
          nickname: "",
          avatar: "",
        };
      }

      // 添加消息信息
      if (remark.mid && messageMap[remark.mid]) {
        remarkData.message = messageMap[remark.mid];
      }

      return remarkData;
    });

    res.send({
      code: 200,
      message: "查询所有回复成功",
      data: result,
    });
  } catch (error) {
    res.send({
      code: 500,
      message: "查询所有回复失败",
      data: error.message,
    });
  }
});

// 查询回复（根据 mid 查询）
router.get("/queryRemark", async (req, res) => {
  const { mid } = req.query;

  if (!mid) {
    return res.send({
      code: 400,
      message: "参数不完整，需要 mid",
    });
  }

  try {
    const { collection: remarkCollection } = await mongoDB("remarks");
    const { collection: userCollection } = await mongoDB("users");

    const remarks = await remarkCollection
      .find({ mid })
      .sort({ time: -1 })
      .toArray();

    // 收集所有唯一的 uid
    const uids = [...new Set(remarks.filter((r) => r.uid).map((r) => r.uid))];

    // 查询用户信息
    if (uids.length > 0) {
      const users = await userCollection.find({ uid: { $in: uids } }).toArray();
      const userMap = {};
      users.forEach((user) => {
        userMap[user.uid] = {
          nickname: user.nickname || "",
          uid: user.uid,
          avatar: user.avatar || "",
        };
      });

      // 为每个回复添加用户信息
      remarks.forEach((remark) => {
        if (remark.uid && userMap[remark.uid]) {
          remark.user = userMap[remark.uid];
        } else if (remark.uid) {
          remark.user = {
            nickname: "",
            uid: remark.uid,
            avatar: "",
          };
        }
      });
    }

    res.send({
      code: 200,
      message: "查询回复成功",
      data: remarks,
    });
  } catch (error) {
    res.send({
      code: 500,
      message: "查询回复失败",
      data: error.message,
    });
  }
});

// 更新回复
router.post("/updateRemark", async (req, res) => {
  const { rid, content } = req.body;
  const uid = req.user.uid;

  if (!rid || !content) {
    return res.send({
      code: 400,
      message: "参数不完整，需要 rid 和 content",
    });
  }

  try {
    const { collection: remarkCollection } = await mongoDB("remarks");

    // 检查回复是否存在且属于当前用户
    const remark = await remarkCollection.findOne({ rid });
    if (!remark) {
      return res.send({
        code: 404,
        message: "回复不存在",
      });
    }

    if (remark.uid !== uid) {
      return res.send({
        code: 403,
        message: "无权修改此回复",
      });
    }

    const result = await remarkCollection.updateOne(
      { rid },
      { $set: { content, time: Date.now() } }
    );

    res.send({
      code: 200,
      message: "更新回复成功",
      data: result,
    });
  } catch (error) {
    res.send({
      code: 500,
      message: "更新回复失败",
      data: error.message,
    });
  }
});

// 删除回复
router.post("/deleteRemark", async (req, res) => {
  const { rid } = req.body;
  const uid = req.user.uid;

  if (!rid) {
    return res.send({
      code: 400,
      message: "参数不完整，需要 rid",
    });
  }

  try {
    const { collection: remarkCollection } = await mongoDB("remarks");

    // 检查回复是否存在且属于当前用户
    const remark = await remarkCollection.findOne({ rid });
    if (!remark) {
      return res.send({
        code: 404,
        message: "回复不存在",
      });
    }

    if (remark.uid !== uid) {
      return res.send({
        code: 403,
        message: "无权删除此回复",
      });
    }

    const result = await remarkCollection.deleteOne({ rid });

    // 更新消息的回复数量
    const { collection: messageCollection } = await mongoDB("messages");
    await messageCollection.updateOne(
      { mid: remark.mid },
      { $inc: { replyCount: -1 } }
    );

    res.send({
      code: 200,
      message: "删除回复成功",
      data: result,
    });
  } catch (error) {
    res.send({
      code: 500,
      message: "删除回复失败",
      data: error.message,
    });
  }
});

// 查询用户自己的回复
router.post("/queryMyRemarks", async (req, res) => {
  const uid = req.user.uid;

  try {
    const { collection: remarkCollection } = await mongoDB("remarks");
    const { collection: userCollection } = await mongoDB("users");
    const { collection: messageCollection } = await mongoDB("messages");

    const remarks = await remarkCollection
      .find({ uid })
      .sort({ time: -1 })
      .toArray();

    // 收集所有唯一的 mid
    const mids = [...new Set(remarks.map((r) => r.mid))];

    // 查询消息信息
    const messages =
      (await mids.length) > 0
        ? await messageCollection.find({ mid: { $in: mids } }).toArray()
        : [];

    const messageMap = {};
    messages.forEach((msg) => {
      messageMap[msg.mid] = msg;
    });

    // 查询用户信息
    const user = await userCollection.findOne({ uid });
    const userInfo = user
      ? {
          nickname: user.nickname || "",
          uid: user.uid,
          avatar: user.avatar || "",
        }
      : {
          nickname: "",
          uid: uid,
          avatar: "",
        };

    // 为每个回复添加用户信息和消息信息
    remarks.forEach((remark) => {
      remark.user = userInfo;
      if (messageMap[remark.mid]) {
        remark.message = messageMap[remark.mid];
      }
    });

    res.send({
      code: 200,
      message: "查询成功",
      data: remarks,
    });
  } catch (error) {
    res.send({
      code: 500,
      message: "查询失败",
      data: error.message,
    });
  }
});

// 添加点赞
router.post("/addLike", async (req, res) => {
  const { mid } = req.body;
  const uid = req.user.uid;

  if (!mid) {
    return res.send({
      code: 400,
      message: "参数不完整，需要 mid",
    });
  }

  try {
    const { collection: likeCollection } = await mongoDB("likes");

    // 检查是否已经点赞
    const existingLike = await likeCollection.findOne({ mid, uid });
    if (existingLike) {
      return res.send({
        code: 400,
        message: "已经点赞过了",
      });
    }

    const like = new Like({ mid, uid });
    const result = await likeCollection.insertOne(like);

    // 更新消息的点赞数量
    const { collection: messageCollection } = await mongoDB("messages");
    await messageCollection.updateOne({ mid }, { $inc: { likeCount: 1 } });

    res.send({
      code: 200,
      message: "点赞成功",
      data: result,
    });
  } catch (error) {
    res.send({
      code: 500,
      message: "点赞失败",
      data: error.message,
    });
  }
});

// 取消点赞
router.post("/cancelLike", async (req, res) => {
  const { mid } = req.body;
  const uid = req.user.uid;

  if (!mid) {
    return res.send({
      code: 400,
      message: "参数不完整，需要 mid",
    });
  }

  try {
    const { collection: likeCollection } = await mongoDB("likes");

    // 检查是否已经点赞
    const existingLike = await likeCollection.findOne({ mid, uid });
    if (!existingLike) {
      return res.send({
        code: 400,
        message: "尚未点赞",
      });
    }

    const result = await likeCollection.deleteOne({ mid, uid });

    // 更新消息的点赞数量
    const { collection: messageCollection } = await mongoDB("messages");
    await messageCollection.updateOne({ mid }, { $inc: { likeCount: -1 } });

    res.send({
      code: 200,
      message: "取消点赞成功",
      data: result,
    });
  } catch (error) {
    res.send({
      code: 500,
      message: "取消点赞失败",
      data: error.message,
    });
  }
});

// 查询点赞（根据 mid 查询所有点赞，或查询用户是否已点赞）
router.get("/queryLike", async (req, res) => {
  const { mid, uid } = req.query;

  try {
    const { collection: likeCollection } = await mongoDB("likes");

    if (mid && uid) {
      // 查询特定用户是否对特定消息点赞
      const like = await likeCollection.findOne({ mid, uid });
      res.send({
        code: 200,
        message: "查询成功",
        data: {
          isLiked: !!like,
          like: like || null,
        },
      });
    } else if (mid) {
      // 查询特定消息的所有点赞
      const likes = await likeCollection.find({ mid }).toArray();
      res.send({
        code: 200,
        message: "查询成功",
        data: likes,
      });
    } else {
      res.send({
        code: 400,
        message: "参数不完整，需要 mid 或 mid 和 uid",
      });
    }
  } catch (error) {
    res.send({
      code: 500,
      message: "查询点赞失败",
      data: error.message,
    });
  }
});

// 切换点赞状态（如果已点赞则取消，如果未点赞则点赞）
router.post("/toggleLike", async (req, res) => {
  const { mid } = req.body;
  const uid = req.user.uid;

  if (!mid) {
    return res.send({
      code: 400,
      message: "参数不完整，需要 mid",
    });
  }

  try {
    const { collection: likeCollection } = await mongoDB("likes");
    const { collection: messageCollection } = await mongoDB("messages");

    // 检查是否已经点赞
    const existingLike = await likeCollection.findOne({ mid, uid });

    if (existingLike) {
      // 取消点赞
      await likeCollection.deleteOne({ mid, uid });
      await messageCollection.updateOne({ mid }, { $inc: { likeCount: -1 } });
      res.send({
        code: 200,
        message: "取消点赞成功",
        data: { isLiked: false },
      });
    } else {
      // 添加点赞
      const like = new Like({ mid, uid });
      await likeCollection.insertOne(like);
      await messageCollection.updateOne({ mid }, { $inc: { likeCount: 1 } });
      res.send({
        code: 200,
        message: "点赞成功",
        data: { isLiked: true },
      });
    }
  } catch (error) {
    res.send({
      code: 500,
      message: "操作失败",
      data: error.message,
    });
  }
});

module.exports = router;
