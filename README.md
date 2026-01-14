# 前端开发与浏览器自动化学习指南

从后端到全栈 AI Agent 开发的 7 天学习路线（含 Day 0 预备课）

## 项目简介

这是一个交互式前端学习平台，专为后端开发者设计，帮助快速掌握 JavaScript/TypeScript 和 React 开发技能。课程内容涵盖 8 天（Day 0-7），包含 Markdown 渲染、代码示例和交互式组件。

## 技术栈

- **前端**: React 19, TypeScript, Vite 7
- **UI 组件**: shadcn/ui (Radix UI), Tailwind CSS v4
- **路由**: Wouter
- **后端**: Express (静态文件服务)
- **包管理**: pnpm

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm check

# 构建生产版本
pnpm build

# 运行生产服务器
pnpm start
```

## 项目结构

```
frontend_learning_guide/
├── client/                 # 前端应用 (Vite + React + TypeScript)
│   ├── src/
│   │   ├── components/     # React 组件
│   │   │   └── ui/         # shadcn/ui 组件库
│   │   ├── contexts/       # React 上下文
│   │   ├── data/           # 课程内容数据
│   │   │   └── answers/    # 作业答案
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── lib/            # 工具函数
│   │   └── pages/          # 页面组件
│   └── index.html          # HTML 入口
│
├── server/                 # Express 服务器
│   └── index.ts            # 服务器入口
│
├── shared/                 # 客户端/服务器共享代码
│   └── const.ts            # 共享常量
│
├── day0/                   # Day 0: JavaScript 基础学习材料
│   ├── README.md           # 学习指南
│   ├── core-syntax.md      # 核心语法详解
│   └── demos/              # 可运行的演示代码
│
├── day1/                   # Day 1: TypeScript 学习材料
│   ├── README.md           # 学习指南
│   ├── core-syntax.md      # 核心语法详解
│   └── demos/              # 可运行的演示代码
│
├── day4/                   # Day 4: 作业目录
│   ├── homework1-codegen-demo/
│   ├── homework2-api-mock/
│   └── homework3-airbnb-search/
│
├── dist/                   # 构建输出
│   ├── index.js            # 打包后的服务器
│   └── public/             # 打包后的前端静态文件
│
├── .claude/                # Claude Code 配置
│   └── skills/             # 自定义技能
│
└── patches/                # pnpm 补丁文件
```

## 课程内容

| 天数 | 主题 | 说明 |
|------|------|------|
| Day 0 | JavaScript 基础 | 变量、类型、函数、类、模块化 |
| Day 1 | TypeScript | 类型系统、泛型、工具类型 |
| Day 2 | React 基础 | 组件、状态、生命周期 |
| Day 3 | React 进阶 | Hooks、Context、性能优化 |
| Day 4 | 工程化实践 | 构建工具、代码规范 |
| Day 5 | 浏览器自动化 | Playwright、CDP |
| Day 6 | AI Agent 开发 | MCP、Stagehand |
| Day 7 | 项目实战 | 综合应用 |

## 路由说明

- `/` - 首页（课程概览）
- `/day/:day` - 具体某天的课程详情
- `/about` - 关于页面
- `/resources` - 资源页面
- `/answers` - 作业答案页面

## 运行演示代码

Day 0 和 Day 1 包含可执行的 TypeScript 演示文件：

```bash
# 运行 Day 0 演示
pnpm tsx day0/demos/01-variables-types-builtins.ts

# 运行 Day 1 演示
pnpm tsx day1/demos/01-everyday-types-and-narrowing.ts
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动 Vite 开发服务器 (端口 3000) |
| `pnpm build` | 构建客户端和服务器 |
| `pnpm start` | 运行生产服务器 |
| `pnpm preview` | 预览构建结果 |
| `pnpm check` | TypeScript 类型检查 |
| `pnpm format` | Prettier 代码格式化 |

## 配置说明

### 路径别名

```typescript
// tsconfig.json & vite.config.ts
{
  "@/*": "./client/src/*",
  "@shared/*": "./shared/*",
  "@assets/*": "./attached_assets/*"
}
```

### TypeScript 配置

- 严格模式启用
- 模块解析: bundler
- JSX: preserve (由 Vite 处理)

## 贡献指南

1. 课程内容位于 `client/src/data/dayXContent.ts`
2. 遵循 Conventional Commits 规范
3. 提交前运行 `pnpm check` 确保类型正确

## 许可证

MIT
