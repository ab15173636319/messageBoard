# 留言板系统 (Message Board)

一个基于 Vue 3 + Node.js 的现代化留言板系统，支持用户注册登录、留言发布、回复互动、点赞等功能。

## ✨ 功能特性

### 用户功能
- ✅ 用户注册与登录（JWT 认证）
- ✅ 留言发布与管理
- ✅ 富文本编辑器（支持表情、格式化）
- ✅ 留言回复（添加、编辑、删除）
- ✅ 留言点赞（点赞/取消点赞）
- ✅ 用户个人中心
  - 个人信息管理
  - 头像管理
  - 密码修改
  - 我的留言管理
  - 我的回复管理

### 管理员功能
- ✅ 留言管理（查看、删除所有留言）
- ✅ 回复管理（查看、删除所有回复）
- ✅ 用户管理（查看、编辑、删除用户）

### 其他功能
- ✅ 响应式设计（支持移动端）
- ✅ 搜索功能
- ✅ 分页显示
- ✅ 数据实时更新
- ✅ 用户信息自动关联

## 🛠️ 技术栈

### 前端
- **框架**: Vue 3 + TypeScript
- **UI 组件库**: Element Plus
- **样式**: Tailwind CSS
- **状态管理**: Pinia
- **路由**: Vue Router
- **富文本编辑器**: WangEditor
- **HTTP 客户端**: Axios
- **构建工具**: Vite

### 后端
- **框架**: Node.js + Express
- **数据库**: MongoDB
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcrypt
- **文件上传**: Multer + 阿里云 OSS
- **工具库**: uuid

## 📁 项目结构

```
messageBoard/
├── api/                          # 后端服务
│   ├── config/                   # 配置文件
│   │   ├── mongoDB.js           # MongoDB 连接配置
│   │   ├── aliyun_oss_config.js # 阿里云 OSS 配置
│   │   └── config.env           # 环境变量配置
│   ├── middleware/               # 中间件
│   │   └── validateToken.js    # Token 验证中间件
│   ├── modules/                  # 数据模型
│   │   ├── User.js              # 用户模型
│   │   ├── Message.js           # 留言模型
│   │   ├── Remark.js            # 回复模型
│   │   └── Like.js                # 点赞模型
│   ├── router/                   # 路由
│   │   ├── userRouter.js        # 用户相关路由
│   │   ├── messageRouter.js     # 留言相关路由
│   │   └── fileRouter.js        # 文件上传路由
│   ├── utils/                    # 工具函数
│   │   ├── token.js             # JWT 工具
│   │   ├── comparePassword.js   # 密码比较
│   │   └── getUid.js            # UID 生成
│   └── App.js                    # 应用入口
│
└── message_board_vue/            # 前端应用
    ├── src/
    │   ├── api/                  # API 接口
    │   │   ├── user.ts           # 用户 API
    │   │   └── message.ts        # 留言 API
    │   ├── components/           # 组件
    │   │   ├── base/             # 基础组件
    │   │   └── layout/           # 布局组件
    │   ├── views/                # 页面视图
    │   │   ├── manage/           # 管理页面
    │   │   └── user/             # 用户页面
    │   ├── stores/               # 状态管理
    │   │   └── modules/          # Store 模块
    │   ├── router/               # 路由配置
    │   ├── types/                # TypeScript 类型定义
    │   └── utils/                # 工具函数
    └── vite.config.ts            # Vite 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20.19.0 或 >= 22.12.0
- pnpm >= 10.14.0
- MongoDB 数据库

### 安装依赖

```bash
# 安装后端依赖
cd api
pnpm install

# 安装前端依赖
cd ../message_board_vue
pnpm install
```

### nodeJs配置环境变量`config.env`

在 `api/config.env` 文件中配置：

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

# 阿里云 OSS 配置（可选）
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
REGION=your_region
BUCKET=your_bucket_name
ENDPOINT=your_endpoint
```

### 启动项目

```bash
# 启动后端服务（端口 3000）
cd api
pnpm dev

# 启动前端服务（端口 5173）
cd message_board_vue
pnpm dev
```

访问 `http://localhost:5173` 查看应用。

## 📡 API 接口

### 用户相关

- `POST /user/signup` - 用户注册
- `POST /user/login` - 用户登录
- `POST /user/queryUserInfo` - 查询当前用户信息
- `POST /user/updateUserInfo` - 更新用户信息
- `POST /user/updatePassword` - 修改密码
- `POST /user/updateAvatar` - 更新头像
- `GET /user/queryUser` - 查询所有用户（管理员）

### 留言相关

- `POST /message/sendMessage` - 发送留言
- `GET /message/queryMessage` - 查询所有留言（包含用户信息、回复、点赞）
- `POST /message/queryMessageByUid` - 查询用户自己的留言
- `POST /message/deleteMessage` - 删除留言

### 回复相关

- `POST /message/remark` - 添加回复
- `GET /message/queryRemark?mid=xxx` - 查询指定留言的回复
- `GET /message/queryAllRemarks` - 查询所有回复（管理员）
- `POST /message/updateRemark` - 更新回复
- `POST /message/deleteRemark` - 删除回复
- `POST /message/queryMyRemarks` - 查询我的回复

### 点赞相关

- `POST /message/addLike` - 添加点赞
- `POST /message/cancelLike` - 取消点赞
- `POST /message/toggleLike` - 切换点赞状态
- `GET /message/queryLike?mid=xxx&uid=xxx` - 查询点赞状态

## 🗄️ 数据库结构

### 用户表 (users)
- `uid` - 用户唯一标识
- `username` - 用户名
- `password` - 加密后的密码
- `nickname` - 昵称
- `email` - 邮箱
- `phone` - 手机号
- `avatar` - 头像 URL
- `role` - 角色（user/admin）
- `createTime` - 创建时间

### 留言表 (messages)
- `mid` - 留言唯一标识
- `uid` - 用户 ID
- `content` - 留言内容
- `time` - 发布时间
- `name` - 留言者名称
- `replyCount` - 回复数量
- `likeCount` - 点赞数量
- `isHide` - 是否隐藏

### 回复表 (remarks)
- `rid` - 回复唯一标识
- `mid` - 留言 ID
- `uid` - 用户 ID
- `content` - 回复内容
- `time` - 回复时间
- `name` - 回复者名称

### 点赞表 (likes)
- `lid` - 点赞唯一标识
- `mid` - 留言 ID
- `uid` - 用户 ID
- `time` - 点赞时间

## 🔐 权限说明

- **普通用户**: 可以发布留言、回复、点赞，管理自己的内容
- **管理员**: 拥有所有权限，可以管理所有用户、留言和回复

## 📝 开发计划

查看 `/plan` 页面了解详细的开发计划和进度。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC

