# Server - Express 服务器

简单的 Express 静态文件服务器，用于服务构建后的前端应用。

## 目录结构

```
server/
└── index.ts    # 服务器入口
```

## 功能说明

- 服务 `dist/public/` 目录下的静态文件
- 支持客户端路由（所有非静态文件请求返回 `index.html`）
- 端口配置：环境变量 `PORT` 或默认 3000

## 技术栈

- **Express 4.21.2** - Web 服务器框架
- **Node.js** - 运行时环境

## 构建与运行

```bash
# 构建（使用 esbuild 打包到 dist/index.js）
pnpm build

# 运行生产服务器
pnpm start

# 或直接运行
NODE_ENV=production node dist/index.js
```

## 服务器配置

服务器会：
1. 设置静态文件目录为 `dist/public/`
2. 对所有非静态文件请求返回 `index.html`（支持 SPA 路由）
3. 监听 `PORT` 环境变量指定的端口，默认 3000

## 开发说明

开发时通常使用 Vite 开发服务器（`pnpm dev`），此 Express 服务器主要用于生产环境部署。
