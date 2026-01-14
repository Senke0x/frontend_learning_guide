# Client - 前端应用

基于 Vite + React 19 + TypeScript 构建的前端学习平台。

## 目录结构

```
client/
├── index.html              # HTML 入口文件
├── public/                 # 静态资源目录
└── src/
    ├── main.tsx            # React 应用入口
    ├── App.tsx             # 根组件（路由配置）
    ├── index.css           # 全局样式（Tailwind + 主题变量）
    ├── const.ts            # 常量定义
    │
    ├── components/         # React 组件
    │   ├── ui/             # shadcn/ui 组件库（53个组件）
    │   ├── CodeBlock.tsx   # 代码块（语法高亮）
    │   ├── DayContent.tsx  # 课程内容渲染
    │   ├── ErrorBoundary.tsx
    │   ├── ManusDialog.tsx
    │   ├── Map.tsx
    │   └── MarkdownRenderer.tsx
    │
    ├── contexts/           # React 上下文
    │   └── ThemeContext.tsx  # 主题切换
    │
    ├── data/               # 课程内容数据
    │   ├── courseContent.ts  # 课程汇总
    │   ├── day0Content.ts ~ day7Content.ts  # 各天内容
    │   ├── answersTypes.ts   # 答案类型定义
    │   └── answers/          # 作业答案
    │       └── day0Answers.ts ~ day7Answers.ts
    │
    ├── hooks/              # 自定义 Hooks
    │   ├── useComposition.ts
    │   ├── useMobile.tsx
    │   └── usePersistFn.ts
    │
    ├── lib/                # 工具函数
    │   └── utils.ts        # 通用工具（cn 类名合并等）
    │
    └── pages/              # 页面组件
        ├── Home.tsx        # 首页
        ├── DayDetail.tsx   # 课程详情页
        ├── About.tsx       # 关于页
        ├── Resources.tsx   # 资源页
        ├── Answers.tsx     # 作业答案页
        └── NotFound.tsx    # 404 页面
```

## 技术栈

### 核心框架
- **React 19.2.1** - UI 框架
- **TypeScript 5.6.3** - 类型系统
- **Vite 7.1.7** - 构建工具

### UI 组件
- **shadcn/ui** - 基于 Radix UI 的组件系统
- **Radix UI** - 无障碍 UI 原语
- **Lucide React** - 图标库
- **Framer Motion** - 动画库

### 样式
- **Tailwind CSS v4** - 实用优先 CSS
- **next-themes** - 主题切换
- **class-variance-authority** - 组件变体

### 表单与验证
- **React Hook Form** - 表单管理
- **Zod** - 模式验证

### Markdown 渲染
- **react-markdown** - Markdown 渲染
- **remark-gfm** - GitHub Flavored Markdown
- **react-syntax-highlighter** - 代码高亮

## 路由配置

使用 Wouter 实现客户端路由：

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 课程概览 |
| `/day/:day` | DayDetail | 具体某天课程 |
| `/about` | About | 关于页面 |
| `/resources` | Resources | 资源页面 |
| `/answers` | Answers | 作业答案 |
| `/404` | NotFound | 404 页面 |

## 添加新课程内容

1. 在 `src/data/` 创建 `dayXContent.ts`：

```typescript
import { DayContent } from './courseContent';

export const dayXContent: DayContent = {
  day: X,
  title: '课程标题',
  subtitle: '副标题',
  overview: '概述',
  sections: [
    {
      id: 'section-1',
      title: '章节标题',
      content: 'Markdown 内容',
      codeExample: '代码示例',
      keyPoints: ['要点1', '要点2'],
      references: [{ title: '参考', url: 'https://...' }]
    }
  ],
  homework: [
    { id: 'hw-1', title: '作业标题', description: '描述' }
  ]
};
```

2. 在 `src/data/courseContent.ts` 中导入并添加到 `courseContent` 数组。

## 组件说明

### UI 组件 (`components/ui/`)

53 个 shadcn/ui 组件，包括：
- 布局: Card, Dialog, Sheet, Tabs, Accordion
- 表单: Button, Input, Select, Checkbox, Switch
- 反馈: Alert, Toast, Progress, Skeleton
- 导航: NavigationMenu, Breadcrumb, Pagination
- 数据展示: Table, Avatar, Badge, Tooltip

### 业务组件

- **DayContent** - 渲染结构化课程内容
- **MarkdownRenderer** - 自定义样式的 Markdown 渲染
- **CodeBlock** - 带语法高亮的代码块
- **ErrorBoundary** - 错误边界包装器

## 主题配置

支持深色/浅色主题切换，主题变量定义在 `src/index.css`：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

## 开发命令

```bash
# 启动开发服务器
pnpm dev

# 类型检查
pnpm check

# 构建
pnpm build
```
