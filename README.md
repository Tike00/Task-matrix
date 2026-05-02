<p align="center">
  <img src="docs/assets/task-matrix-logo.svg" alt="Task Matrix" width="720">
</p>

<p align="center">
  <strong>本地单机任务编排与脚本执行控制台</strong>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#项目结构">项目结构</a> ·
  <a href="#安全说明">安全说明</a>
</p>

## 项目简介

Task Matrix 是一个面向本地环境的任务管理与执行平台。它可以围绕一个目标 URL 创建项目，将扫描、检查或自动化脚本拆分为多个阶段和任务，按模板执行本机命令，实时查看日志，并保存脱敏后的执行结果和报告。

这个项目适合用于授权场景下的安全测试流程编排、脚本调试、扫描结果归档，以及单人本地工作台式的任务执行管理。

## 功能特性

- 项目管理：为每个目标 URL 创建独立项目，跟踪状态和描述信息。
- 阶段编排：按阶段组织任务，支持任务排序、移动、执行和汇总。
- 任务模板：内置资产识别、目录枚举、漏洞扫描等模板，可扩展自定义命令。
- 实时日志：通过 WebSocket 推送任务执行日志和状态变化。
- 结果脱敏：自动替换 URL、域名、IP、路径、邮箱等敏感信息。
- 脚本调试：上传 Python 脚本，配置固定目标、脱敏占位符、并发数和命令白名单。
- 报告导出：按项目生成文本报告，保留历史记录。
- 审计日志：记录关键操作、命令文本和执行行为。
- 本地优先：默认仅允许本机访问，数据存储在本地 SQLite。

## 技术栈

- 前端：Vue 3、Vite、Element Plus、Pinia、Vue Router、Axios
- 后端：Node.js、Express、SQLite、JWT、bcrypt、ws
- 数据库：SQLite
- 运行方式：本机单机部署，前后端分离开发，也支持后端托管构建后的前端资源

## 快速开始

### 环境要求

- Node.js 18 或更高版本
- npm
- 可选：根据任务模板安装 `whatweb`、`dirsearch`、`nuclei` 等外部命令，并确保它们在系统 `PATH` 中

### 安装依赖

注意releases里自带依赖，应该可以直接用，不行的会话再下一遍依赖

```bash
npm run install:all
```

### 初始化数据库

```bash
npm run db:init
```

数据库会创建在 `server/data/app.db`。首次初始化会自动创建默认管理员和默认任务模板。

默认登录信息：

```text
username: admin
password: admin
```

首次登录后请立刻修改默认密码。

### 开发模式启动

启动后端：

```bash
npm run dev:server
```

启动前端：

```bash
npm run dev:client
```

默认访问地址：

```text
前端：http://localhost:5173
后端：http://127.0.0.1:3000
```

### 生产构建

```bash
npm run build:client
npm run start:server
```

后端会读取 `client/dist` 中的静态资源。

## 常用脚本

```bash
npm run install:all      # 安装前后端依赖
npm run dev:server       # 启动后端开发服务
npm run dev:client       # 启动前端开发服务
npm run start:server     # 启动后端服务
npm run build:client     # 构建前端资源
npm run db:init          # 初始化数据库
npm run db:migrate       # 执行数据库迁移
npm run db:reset         # 重置数据库
npm run db:check         # 检查数据库状态
```

更多后端脚本可以查看 `server/package.json`。

## 配置说明

后端配置位于 `server/.env`，可以参考 `server/.env.example`。

常见配置项：

```env
HOST=127.0.0.1
PORT=3000
JWT_SECRET=change-me
ALLOW_REMOTE_ACCESS=false
```

默认情况下服务只允许本机访问。如果确实需要局域网访问，请确认运行环境可信，再调整 `HOST` 与 `ALLOW_REMOTE_ACCESS`。

## 脚本调试说明

脚本调试页面用于临时上传和执行本地脚本。

基本流程：

1. 配置固定目标 URL。
2. 配置脱敏占位符，例如 `testtest123`。
3. 在命令中使用占位符，例如 `python scan.py -u testtest123`。
4. 后端执行前会把占位符替换成真实目标。
5. 输出结果会重新脱敏为占位符，避免真实目标泄露。

可以通过“允许的命令”限制可执行命令名称，例如只允许 `python`、`python3`、`nmap`。

## 项目结构

```text
.
├── client/                 # Vue 前端
│   ├── src/api/            # API 请求封装
│   ├── src/components/     # 页面组件
│   ├── src/store/          # Pinia 状态管理
│   └── src/views/          # 页面视图
├── server/                 # Express 后端
│   ├── controllers/        # 控制器
│   ├── db/                 # SQLite 初始化、迁移和仓储
│   ├── middleware/         # 鉴权、本地访问限制、错误处理
│   ├── routes/             # API 路由
│   ├── services/           # 业务逻辑
│   └── ws/                 # WebSocket 推送
├── docs/assets/            # 文档资源与 Logo
└── package.json            # 根项目脚本
```

## 数据与输出

- SQLite 数据库：`server/data/app.db`
- 导出报告：`server/data/reports/`
- 前端构建产物：`client/dist/`

## 安全说明

Task Matrix 可以执行本机命令，请只在可信环境中运行。

- 不要把默认账号密码用于公开环境。
- 不要在未授权目标上运行扫描任务。
- 不要随意开启远程访问。
- 脚本调试功能可能执行任意命令，建议配置命令白名单。

## 免责声明

本项目仅用于授权范围内的安全测试、自动化任务编排和本地学习研究。使用者应自行确保行为符合当地法律法规和目标系统授权要求。

## 原神牛福

尊重开源精神，商用宣传务必标注，有问题就提issue，也可以直接对着codex许愿
