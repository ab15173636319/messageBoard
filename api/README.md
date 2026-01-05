# 留言板系统 - 后端 API

这是留言板系统的后端服务，基于 Node.js + Express 构建的 RESTful API 服务。

## ✨ 功能特性

### 用户管理
- ✅ 用户注册与登录（JWT 认证）
- ✅ 用户信息查询与更新
- ✅ 密码修改（bcrypt 加密）
- ✅ 头像上传（阿里云 OSS）
- ✅ 用户列表查询（管理员）

### 留言管理
- ✅ 留言发布
- ✅ 留言查询（支持按用户查询）
- ✅ 留言删除
- ✅ 留言关联用户信息、回复、点赞数据

### 回复管理
- ✅ 回复添加
- ✅ 回复查询（按留言 ID、按用户）
- ✅ 回复更新
- ✅ 回复删除
- ✅ 所有回复查询（管理员）

### 点赞管理
- ✅ 点赞添加
- ✅ 点赞取消
- ✅ 点赞状态切换
- ✅ 点赞状态查询

### 文件管理
- ✅ 文件上传（阿里云 OSS）
- ✅ 文件查询（支持分页、搜索、分类）
- ✅ 文件删除
- ✅ 文件下载
- ✅ 文件大小统计

### 安全特性
- ✅ JWT Token 认证
- ✅ 密码加密存储（bcrypt）
- ✅ Token 验证中间件
- ✅ 请求白名单机制
- ✅ CORS 跨域支持

## 🛠️ 技术栈

- **运行环境**: Node.js >= 20.19.0 或 >= 22.12.0
- **框架**: Express 5.2+
- **数据库**: MongoDB 7.0+
- **认证**: JWT (jsonwebtoken 9.0+)
- **密码加密**: bcrypt 6.0+
- **文件上传**: Multer 2.0+ + 阿里云 OSS (ali-oss 6.23+)
- **工具库**: 
  - uuid 13.0+ (UID 生成)
  - dotenv 17.2+ (环境变量)
  - cors 2.8+ (跨域支持)
- **开发工具**: nodemon 3.1+ (热重载)

## 📁 项目结构

```
api/
├── config/                    # 配置文件
│   ├── mongoDB.js            # MongoDB 连接配置
│   ├── aliyun_oss_config.js  # 阿里云 OSS 配置
│   └── config.env            # 环境变量配置（需自行创建）
├── middleware/                # 中间件
│   └── validateToken.js      # Token 验证中间件
├── modules/                   # 数据模型
│   ├── User.js               # 用户模型
│   ├── Message.js            # 留言模型
│   ├── Remark.js             # 回复模型
│   └── Like.js               # 点赞模型
├── router/                    # 路由
│   ├── userRouter.js         # 用户相关路由
│   ├── messageRouter.js      # 留言相关路由
│   ├── fileRouter.js         # 文件上传路由
│   └── testRouter.js         # 测试路由
├── utils/                     # 工具函数
│   ├── token.js              # JWT 工具（生成/验证）
│   ├── comparePassword.js    # 密码比较
│   └── getUid.js             # UID 生成
├── uploads/                   # 临时上传目录
├── doc/                       # API 文档
├── App.js                     # 应用入口
└── package.json               # 依赖配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20.19.0 或 >= 22.12.0
- pnpm >= 10.14.0
- MongoDB 数据库（本地或远程）

### 安装依赖

```bash
cd api
pnpm install
```

### 配置环境变量

在 `api/config.env` 文件中配置以下环境变量：

```env
# MongoDB 配置
MONGODB_URI=your_mongodb_uri
MONGODB_DATABASE=your_database_name
MONGODB_USER=your_username
MONGODB_PASSWORD=your_password

# JWT 配置
JWT_SECRET_KEY=your_secret_key
JWT_ISS=your_issuer
JWT_EXPIRES_IN=7d

# 阿里云 OSS 配置（可选，用于文件上传）
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
REGION=your_region
BUCKET=your_bucket_name
ENDPOINT=your_endpoint
```

**配置说明**：
- `MONGODB_URI`: MongoDB 服务器地址（如：`localhost:27017` 或 `cluster.mongodb.net`）
- `MONGODB_DATABASE`: 数据库名称
- `MONGODB_USER`: MongoDB 用户名
- `MONGODB_PASSWORD`: MongoDB 密码
- `JWT_SECRET_KEY`: JWT 密钥（建议使用强随机字符串）
- `JWT_ISS`: JWT 签发者标识
- `JWT_EXPIRES_IN`: Token 过期时间（如：`7d`、`24h`）

### 启动服务

```bash
# 开发模式（自动重启）
pnpm dev

# 生产模式
node App.js
```

服务将在 `http://localhost:3000` 启动。

## 📡 API 接口

### 基础信息

- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`
- **认证方式**: JWT Token（在请求头中传递 `token`）

### 响应格式

所有 API 响应遵循统一格式：

```json
{
  "code": 200,        // 状态码：200 成功，400 客户端错误，401 未授权，500 服务器错误
  "message": "操作成功",
  "data": {}          // 响应数据（可选）
}
```

### 用户相关接口

#### 用户注册
- **URL**: `POST /user/signup`
- **认证**: 不需要
- **请求体**:
```json
{
  "username": "string",
  "password": "string",
  "nickname": "string",
  "email": "string",
  "phone": "string"
}
```

#### 用户登录
- **URL**: `POST /user/login`
- **认证**: 不需要
- **请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **响应**: 返回 JWT Token

#### 查询当前用户信息
- **URL**: `POST /user/queryUserInfo`
- **认证**: 需要（Token）

#### 更新用户信息
- **URL**: `POST /user/updateUserInfo`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "nickname": "string",
  "email": "string",
  "phone": "string"
}
```

#### 修改密码
- **URL**: `POST /user/updatePassword`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

#### 更新头像
- **URL**: `POST /user/updateAvatar`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "avatar": "string"  // 头像 URL
}
```

#### 查询所有用户（管理员）
- **URL**: `GET /user/queryUser`
- **认证**: 需要（Token，管理员权限）

### 留言相关接口

#### 发送留言
- **URL**: `POST /message/sendMessage`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "name": "string",      // 留言标题
  "content": "string"    // 留言内容（HTML）
}
```

#### 查询所有留言
- **URL**: `GET /message/queryMessage`
- **认证**: 不需要
- **查询参数**:
  - `queryByUid`: `boolean` (可选) - 是否按用户 ID 查询
- **响应**: 返回留言列表，包含用户信息、回复、点赞数据

#### 查询用户自己的留言
- **URL**: `POST /message/queryMessageByUid`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "uid": "string"  // 用户 ID（可选，默认使用当前用户）
}
```

#### 删除留言
- **URL**: `POST /message/deleteMessage`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "mid": "string"  // 留言 ID
}
```

### 回复相关接口

#### 添加回复
- **URL**: `POST /message/remark`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "mid": "string",      // 留言 ID
  "content": "string"   // 回复内容（HTML）
}
```

#### 查询指定留言的回复
- **URL**: `GET /message/queryRemark?mid=xxx`
- **认证**: 不需要
- **查询参数**:
  - `mid`: `string` - 留言 ID

#### 查询所有回复（管理员）
- **URL**: `GET /message/queryAllRemarks`
- **认证**: 需要（Token，管理员权限）

#### 更新回复
- **URL**: `POST /message/updateRemark`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "rid": "string",      // 回复 ID
  "content": "string"   // 新内容
}
```

#### 删除回复
- **URL**: `POST /message/deleteRemark`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "rid": "string"  // 回复 ID
}
```

#### 查询我的回复
- **URL**: `POST /message/queryMyRemarks`
- **认证**: 需要（Token）

### 点赞相关接口

#### 添加点赞
- **URL**: `POST /message/addLike`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "mid": "string"  // 留言 ID
}
```

#### 取消点赞
- **URL**: `POST /message/cancelLike`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "mid": "string"  // 留言 ID
}
```

#### 切换点赞状态
- **URL**: `POST /message/toggleLike`
- **认证**: 需要（Token）
- **请求体**:
```json
{
  "mid": "string"  // 留言 ID
}
```

#### 查询点赞状态
- **URL**: `GET /message/queryLike?mid=xxx&uid=xxx`
- **认证**: 不需要
- **查询参数**:
  - `mid`: `string` - 留言 ID
  - `uid`: `string` - 用户 ID

## 🗄️ 数据库结构

### 用户表 (users)

| 字段         | 类型   | 说明                   |
| ------------ | ------ | ---------------------- |
| `uid`        | String | 用户唯一标识           |
| `username`   | String | 用户名（唯一）         |
| `password`   | String | 加密后的密码           |
| `nickname`   | String | 昵称                   |
| `email`      | String | 邮箱                   |
| `phone`      | String | 手机号                 |
| `avatar`     | String | 头像 URL               |
| `role`       | String | 角色（`user`/`admin`） |
| `createTime` | Number | 创建时间（时间戳）     |

### 留言表 (messages)

| 字段         | 类型    | 说明               |
| ------------ | ------- | ------------------ |
| `mid`        | String  | 留言唯一标识       |
| `uid`        | String  | 用户 ID            |
| `name`       | String  | 留言标题           |
| `content`    | String  | 留言内容（HTML）   |
| `time`       | Number  | 发布时间（时间戳） |
| `replyCount` | Number  | 回复数量           |
| `likeCount`  | Number  | 点赞数量           |
| `isHide`     | Boolean | 是否隐藏           |

### 回复表 (remarks)

| 字段      | 类型   | 说明               |
| --------- | ------ | ------------------ |
| `rid`     | String | 回复唯一标识       |
| `mid`     | String | 留言 ID            |
| `uid`     | String | 用户 ID            |
| `name`    | String | 回复者名称         |
| `content` | String | 回复内容（HTML）   |
| `time`    | Number | 回复时间（时间戳） |

### 点赞表 (likes)

| 字段   | 类型   | 说明               |
| ------ | ------ | ------------------ |
| `lid`  | String | 点赞唯一标识       |
| `mid`  | String | 留言 ID            |
| `uid`  | String | 用户 ID            |
| `time` | Number | 点赞时间（时间戳） |

## 🔐 认证机制

### Token 验证中间件

系统使用 `validateToken` 中间件进行请求认证：

1. **白名单路由**（无需 Token）:
   - `GET` 请求（查询操作）
   - `/signup` - 用户注册
   - `/login` - 用户登录
   - `/test` - 测试接口

2. **需要 Token 的路由**:
   - 所有 `POST`、`PUT`、`DELETE` 请求（除白名单外）
   - 在请求头中传递 `token` 字段

3. **Token 验证流程**:
   - 从请求头获取 `token`
   - 验证 Token 有效性
   - 查询用户信息并附加到 `req.user`
   - 继续执行后续路由处理

### 使用示例

```javascript
// 前端请求示例
axios.post('/api/message/sendMessage', {
  name: '留言标题',
  content: '留言内容'
}, {
  headers: {
    'token': 'your_jwt_token_here'
  }
})
```

## 🔧 开发指南

### 添加新路由

1. 在 `router/` 目录创建或修改路由文件
2. 在 `App.js` 中注册路由：
```javascript
const newRouter = require("./router/newRouter");
app.use("/new", validateToken, newRouter);
```

### 添加新数据模型

1. 在 `modules/` 目录创建模型文件
2. 定义模型结构和默认值
3. 在路由中使用模型

### 数据库连接

使用 `config/mongoDB.js` 中的 `connect` 函数连接数据库：

```javascript
const connect = require("./config/mongoDB");

// 连接指定集合
const { db, collection } = await connect("collectionName");

// 执行数据库操作
const result = await collection.find({}).toArray();
```

### 错误处理

所有 API 应返回统一的响应格式：

```javascript
try {
  // 业务逻辑
  res.send({
    code: 200,
    message: "操作成功",
    data: result
  });
} catch (error) {
  res.send({
    code: 500,
    message: `操作失败：${error.message}`
  });
}
```

## 📝 注意事项

1. **环境变量**: 确保 `config.env` 文件已正确配置，不要将敏感信息提交到版本控制
2. **数据库连接**: MongoDB 连接字符串格式：`mongodb://user:password@host:port/?authSource=database`
3. **文件上传**: 上传的文件会先保存到 `uploads/` 目录，然后上传到阿里云 OSS
4. **Token 过期**: 默认 Token 有效期为 7 天，可在环境变量中配置
5. **CORS**: 已配置 CORS 支持跨域请求
6. **密码安全**: 所有密码使用 bcrypt 加密存储，不存储明文密码

## 🔗 相关链接

- [Express 文档](https://expressjs.com/)
- [MongoDB Node.js 驱动文档](https://www.mongodb.com/docs/drivers/node/current/)
- [JWT 文档](https://jwt.io/)
- [bcrypt 文档](https://www.npmjs.com/package/bcrypt)
- [阿里云 OSS 文档](https://help.aliyun.com/product/31815.html)

## 📄 许可证

ISC

