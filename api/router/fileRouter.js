const client = require("../config/aliyun_oss_config");
const express = require("express");
const multer = require("multer");
const { classifyByDate } = require("../utils/file");

const router = express.Router();
const File = require("../modules/File");
const upload = multer({ dest: "uploads/" });
const {
  connect,
  createCollection,
  insertData,
  findData,
  deleteData,
  updateData,
} = require("../utils/mongodb");
const Message = require("../utils/message");
const { ObjectId } = require("mongodb");
const fs = require("node:fs");

const headers = {
  // 指定Object的存储类型。
  "x-oss-storage-class": "Standard",
  // 指定Object的访问权限。
  "x-oss-object-acl": "public-read",
  // 'Content-Disposition': 'attachment; filename="example.txt"',
  // 设置Object的标签，可同时设置多个标签。
  "x-oss-tagging": "Tag1=1&Tag2=2",
  // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
  "x-oss-forbid-overwrite": "true",
};

router.get("/", async (req, res) => {
  try {
    res.send("文件相关api可调用！");
  } catch (e) {
    throw new Error("mongodb错误：查询文件时出现错误，查询文件失败：" + e);
  }
});

// 上传文件
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const username = req.username;
    const param = req.body;
    const file = req.file;
    let fileName = param.fileName;
    if (file.type === "image/png") {
      fileName += " .png";
    } else if (file.type === "image/jpeg") {
      fileName += " .jpg";
    } else if (file.type === "video/mp4") {
      fileName += " .mp4";
    } else if (file.type === "image/gif") {
      fileName += " .gif";
    } else {
      fileName += file.originalname.substring(
        file.originalname.lastIndexOf(".")
      );
    }
    const result = await client.put(fileName, file.path, { headers });
    const fileData = new File({
      username: username,
      name: fileName,
      path: result.url,
      size: req.file.size,
      type: req.file.mimetype,
      uploadDate: Date.now(),
      lastUpdateDate: Date.now(),
    });
    await insertData("files", fileData);
    res.send(
      Message.create().code(200).message("上传文件成功").data({
        fileData,
      })
    );
  } catch (e) {
    throw new Error("mongodb错误：上传文件时出现错误，上传文件失败：" + e);
  }
});

// 分页查询建议
router.post("/queryFiles", async (req, res) => {
  const username = req.username;
  const search = req.body.find || "";
  const pageNumber = parseInt(req.body.page.pageNumber) || 1;
  const pageSize = parseInt(req.body.page.pageSize) || 10;
  const classify = req.body.filter;
  if (!username) {
    return res.send(Message.create().code(400).message("请先登录"));
  }
  try {
    let startIndex, filterFiles, pageTotal;
    // 查询分页数据
    let files = await findData("files", {
      username,
      name: { $regex: search, $options: "i" },
    });
    if (classify) {
      console.log(classify);
      if (!["year", "month", "day"].includes(classify)) {
        return res.send(
          Message.create()
            .code(400)
            .message("分类参数错误，只能是year, month, day")
        );
      }
      filterFiles = await classifyByDate(files, classify);
    } else {
      startIndex = (pageNumber - 1) * pageSize;
      filterFiles = files.slice(startIndex, startIndex + pageSize);
      pageTotal = Math.ceil(files.length / pageSize);
    }
    res.send(
      Message.create().code(200).message("查询文件成功").data({
        files: filterFiles,
        total: files.length,
        pageNumber,
        pageSize,
        pageTotal,
      })
    );
  } catch (e) {
    res.send(Message.create().code(500).message(`查询文件失败：${e}`));
  }
});

router.post("/delete", async (req, res) => {
  console.log("jr");
  const _id = req.body._id;
  const username = req.username || "";
  const fileName = req.body.fileName || "";
  if (!username) {
    return res.send(Message.create().code(400).message("请先登录"));
  }
  if (!fileName) {
    return res.send(Message.create().code(400).message("请输入文件名"));
  }
  try {
    const ossResult = await client.delete(fileName);
    const result = await deleteData("files", { _id: new ObjectId(_id) });
    if (ossResult.res.status !== 204 || result.deletedCount < 1) {
      res.send(Message.create().code(500).message("删除文件失败"));
    }
    res.send(Message.create().code(200).message("删除文件成功"));
  } catch (e) {
    res.send(Message.create().code(500).message(`删除文件失败：${e}`));
  }
});

// 下载文件
router.get("/download", async (req, res) => {
  const fileName = req.query.fileName || "";
  if (!fileName) {
    return res.send(Message.create().code(400).message("请输入文件名"));
  }
  try {
    const ossResult = await client.get(fileName);
    console.log(ossResult.res.requestUrls[0]);
    res.download(ossResult.res.requestUrls[0]);
    res.send(
      Message.create().code(200).message("下载文件成功").data(ossResult)
    );
  } catch (e) {
    res.send(Message.create().code(500).message(`下载文件失败：${e}`));
  }
});

// 查询某用户下所有文件大小
router.post("/allFileSize", async (req, res) => {
  const username = req.username;
  try {
    const files = await findData("files", { username });
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    res.send(
      Message.create().code(200).message("查询所有文件大小成功").data({
        totalSize,
      })
    );
  } catch (e) {
    res.send(Message.create().code(500).message(`查询所有文件大小失败：${e}`));
  }
});

module.exports = router;
