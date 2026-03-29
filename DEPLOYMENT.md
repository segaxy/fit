# 健身计划管理应用 - 部署文档

本应用是一个基于 Cloudflare Pages (前端 + Functions) 和 Cloudflare Workers (定时提醒) 的全栈应用，使用 D1 作为数据库。

## 1. 环境准备

- [Cloudflare 账号](https://dash.cloudflare.com/sign-up)
- Node.js (推荐 v18+)
- 安装 Wrangler CLI: `npm install -g wrangler`

## 2. 数据库配置 (D1)

1. **创建数据库**:
   ```bash
   npx wrangler d1 create fitness-db
   ```
   记录输出中的 `database_id`。

2. **初始化表结构**:
   ```bash
   npx wrangler d1 execute fitness-db --file=./schema.sql
   ```

## 3. 前端与 API 部署 (Cloudflare Pages)

1. **构建项目**:
   ```bash
   npm install
   npm run build
   ```

2. **部署到 Pages**:
   ```bash
   npx wrangler pages deploy dist --project-name my-fitness-app
   ```

3. **绑定 D1 数据库**:
   - 登录 Cloudflare 控制台 -> Workers & Pages -> 找到 `my-fitness-app`。
   - 设置 (Settings) -> 函数 (Functions) -> **D1 数据库绑定**。
   - 变量名称设为 `DB`，数据库选择 `fitness-db`。

## 4. 定时提醒 Worker 部署

1. **部署 Worker**:
   ```bash
   npx wrangler deploy worker.ts --name fitness-reminders
   ```

2. **配置环境变量 (Secrets)**:
   - 设置微信推送 Webhook:
     ```bash
     npx wrangler secret put WECHAT_WEBHOOK
     ```
     (输入你的企业微信机器人或 PushDeer 的 Webhook URL)

3. **绑定 D1**:
   - 同样在 Worker 的设置页面，将 `fitness-db` 绑定到变量名 `DB`。

4. **配置定时触发器 (Triggers)**:
   - 在 Worker 的控制台 -> Triggers -> **Cron Triggers**。
   - 添加 `* * * * *` (每分钟运行一次，用于检查提醒时间)。

---

## 5. 开发者建议

- **本地预览 API**: 使用 `npx wrangler pages dev dist --d1 DB=fitness-db`。
- **自定义推送**: 在 `functions/utils/push.ts` 中根据你选择的推送工具调整 JSON 结构。
