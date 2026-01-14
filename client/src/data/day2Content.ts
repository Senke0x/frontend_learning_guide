export const day2Content = {
  day: 2,
  title: 'Next.js 框架与全栈开发',
  subtitle: '构建现代化的全栈 Web 应用',
  overview: `Next.js 是由 Vercel 公司开发的基于 React 的全栈框架。它在 React 的基础上提供了服务端渲染（SSR）、静态站点生成（SSG）、增量静态再生成（ISR）、API 路由等企业级特性，使得构建生产级 Web 应用变得简单高效。

对于后端开发者来说，Next.js 的优势在于它提供了一个统一的开发体验——前端和后端代码可以在同一个项目中管理，使用相同的语言（TypeScript），共享类型定义。这大大降低了全栈开发的复杂度。

Next.js 13 引入了革命性的 App Router，采用 React Server Components 作为默认渲染模式，这代表了 React 生态系统的未来发展方向。`,
  sections: [
    {
      title: 'React 基础：从问题到解决方案',
      background: `在学习 Next.js 之前，我们需要先理解 React 的核心价值。React 诞生于 2013 年，由 Facebook（现 Meta）开发并开源。它的出现彻底改变了前端开发的方式。

在 React 之前，前端开发主要使用 jQuery 或原生 JavaScript 直接操作 DOM。随着应用复杂度增加，这种方式暴露出严重的问题：代码难以维护、状态管理混乱、UI 与数据不同步。React 的出现就是为了解决这些痛点。

理解 React 解决了什么问题，比学习它的语法更重要。这将帮助你理解为什么 Next.js 要在 React 基础上做进一步的封装和优化。`,
      content: `**React 出现前的前端开发痛点**

1. **命令式 DOM 操作**
   - 需要手动查找 DOM 元素、添加事件监听、更新内容
   - 代码充斥着 \`document.querySelector\`、\`addEventListener\`、\`innerHTML\`
   - 难以追踪 UI 状态的变化来源

2. **状态与 UI 不同步**
   - 数据更新后需要手动更新对应的 DOM
   - 容易遗漏某些需要更新的地方，导致 UI 显示错误
   - 多个地方依赖同一数据时，同步更新变得极其复杂

3. **代码复用困难**
   - 缺乏组件化思想，相似的 UI 逻辑需要重复编写
   - 难以抽象和封装可复用的 UI 单元

4. **性能优化困难**
   - 频繁的 DOM 操作导致性能问题
   - 难以判断哪些 DOM 需要更新，哪些不需要

**React 的核心解决方案**

1. **声明式 UI（Declarative UI）**
   - 不再手动操作 DOM，而是描述 UI 应该是什么样子
   - UI = f(state)：UI 是状态的函数
   - 状态变化时，React 自动更新 UI

2. **组件化（Component-Based）**
   - 将 UI 拆分成独立、可复用的组件
   - 每个组件管理自己的状态和逻辑
   - 组件可以组合成复杂的应用

3. **虚拟 DOM（Virtual DOM）**
   - React 维护一个轻量级的 DOM 副本（虚拟 DOM）
   - 状态变化时，先更新虚拟 DOM，然后计算最小差异
   - 只更新真正需要改变的 DOM 节点，提升性能

4. **单向数据流（Unidirectional Data Flow）**
   - 数据从父组件流向子组件（通过 props）
   - 子组件通过回调函数通知父组件更新数据
   - 数据流向清晰，易于调试和理解

**React 引入的新语法和概念**

1. **JSX 语法**
   - 在 JavaScript 中编写类似 HTML 的语法
   - 编译时转换为 \`React.createElement\` 调用
   - 提供类型检查和更好的开发体验

2. **组件（Components）**
   - 函数组件：纯函数，接收 props 返回 JSX
   - 类组件（已过时）：使用 ES6 class 定义

3. **Hooks（React 16.8+）**
   - \`useState\`：管理组件状态
   - \`useEffect\`：处理副作用（数据获取、订阅等）
   - \`useContext\`：跨组件共享数据
   - \`useRef\`：访问 DOM 或保存可变值
   - 自定义 Hooks：封装可复用的逻辑

4. **Props 和 State**
   - Props：父组件传递给子组件的数据（只读）
   - State：组件内部管理的数据（可变）

**React 引入的新问题**

尽管 React 解决了很多问题，但也带来了新的挑战：

1. **首次加载性能问题**
   - 纯客户端渲染（CSR）：需要下载、解析、执行 JavaScript 后才能看到内容
   - 首屏白屏时间长，SEO 不友好（搜索引擎难以抓取内容）

2. **代码分割和懒加载复杂**
   - 需要手动配置 Webpack 或其他打包工具
   - 路由级别的代码分割需要额外的库（如 React Router）

3. **数据获取模式不统一**
   - 需要在 \`useEffect\` 中手动获取数据
   - 缺乏统一的数据获取和缓存方案
   - 容易出现竞态条件（race condition）

4. **路由需要额外配置**
   - React 本身不包含路由功能
   - 需要使用 React Router 等第三方库
   - 路由配置与组件分离，不够直观

5. **服务端渲染（SSR）实现复杂**
   - 需要自己搭建 Node.js 服务器
   - 处理数据预取、状态同步、水合（Hydration）等问题
   - 配置复杂，容易出错

**Next.js 与 React 的关系**

Next.js 是基于 React 的全栈框架，它的定位是：

1. **React 的超集**
   - Next.js 完全兼容 React，所有 React 代码都可以在 Next.js 中运行
   - 你仍然使用 React 的组件、Hooks、JSX 等特性
   - Next.js 不是替代 React，而是增强 React

2. **解决 React 的工程化问题**
   - **内置路由**：文件系统路由，无需配置
   - **混合渲染**：支持 SSR、SSG、ISR、CSR 多种渲染策略
   - **自动优化**：代码分割、图片优化、字体优化等开箱即用
   - **全栈能力**：API 路由、Server Actions，前后端一体化

3. **引入新的架构模式**
   - **React Server Components**：组件可以在服务器运行
   - **App Router**：基于文件系统的新一代路由
   - **流式渲染**：边计算边返回，提升首屏速度

4. **开发体验提升**
   - 零配置启动项目
   - 内置 TypeScript 支持
   - 快速刷新（Fast Refresh）
   - 开发和生产环境一致

**类比理解**

- **React**：就像汽车的发动机，提供核心动力（组件化、声明式 UI）
- **Next.js**：就像完整的汽车，在发动机基础上加上车身、轮胎、导航系统等（路由、SSR、优化）

你可以只用 React 构建应用（就像只用发动机），但需要自己解决很多问题。Next.js 提供了一套完整的解决方案，让你专注于业务逻辑。

**学习路径建议**

1. **先理解 React 核心概念**：组件、Props、State、Hooks
2. **再学习 Next.js 特性**：路由、渲染策略、数据获取
3. **最后掌握高级特性**：Server Components、Server Actions、中间件

接下来的章节将详细介绍 Next.js 的各项特性。`,
      codeExample: \`// ==========================================
// React 基础：从 jQuery 到 React
// ==========================================

// ----- jQuery 时代的代码（命令式）-----
/*
<!DOCTYPE html>
<html>
<body>
  <div id="app">
    <h1 id="title">计数器</h1>
    <p>当前计数: <span id="count">0</span></p>
    <button id="increment">增加</button>
    <button id="decrement">减少</button>
  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script>
    // 状态存储在全局变量中
    let count = 0;

    // 手动更新 DOM
    function updateCount() {
      $('#count').text(count);
    }

    // 手动绑定事件
    $('#increment').on('click', function() {
      count++;
      updateCount();
    });

    $('#decrement').on('click', function() {
      count--;
      updateCount();
    });
  </script>
</body>
</html>
*/

// 问题：
// 1. 状态和 UI 分离，容易不同步
// 2. 需要手动查找 DOM 元素
// 3. 需要手动更新每个相关的 DOM
// 4. 代码难以复用和测试

// ----- React 时代的代码（声明式）-----
// Counter.tsx
import { useState } from 'react';

export default function Counter() {
  // 状态由 React 管理
  const [count, setCount] = useState(0);

  // UI 是状态的函数，状态变化时 React 自动更新 UI
  return (
    <div>
      <h1>计数器</h1>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
    </div>
  );
}

// 优势：
// 1. 状态和 UI 绑定，自动同步
// 2. 不需要手动操作 DOM
// 3. 代码简洁，易于理解
// 4. 组件可复用

// ----- React 核心概念演示 -----

// 1. 组件化：将 UI 拆分成独立的组件
function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
}

function CounterWithComponents() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">计数器</h1>
      <p className="my-4">当前计数: {count}</p>
      <div className="space-x-2">
        <Button onClick={() => setCount(count + 1)}>增加</Button>
        <Button onClick={() => setCount(count - 1)}>减少</Button>
        <Button onClick={() => setCount(0)}>重置</Button>
      </div>
    </div>
  );
}

// 2. Props：父组件向子组件传递数据
interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
}

function UserCard({ name, email, avatar }: UserCardProps) {
  return (
    <div className="p-4 border rounded">
      {avatar && <img src={avatar} alt={name} className="w-16 h-16 rounded-full" />}
      <h3 className="font-bold">{name}</h3>
      <p className="text-gray-600">{email}</p>
    </div>
  );
}

function UserList() {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];

  return (
    <div className="space-y-4">
      {users.map(user => (
        <UserCard key={user.id} name={user.name} email={user.email} />
      ))}
    </div>
  );
}

// 3. State：组件内部状态管理
function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input]);
      setInput('');
    }
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="添加待办事项..."
          className="flex-1 p-2 border rounded"
        />
        <button onClick={addTodo} className="px-4 py-2 bg-blue-500 text-white rounded">
          添加
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo, index) => (
          <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span>{todo}</span>
            <button
              onClick={() => removeTodo(index)}
              className="text-red-500 hover:text-red-700"
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 4. useEffect：处理副作用
function DataFetcher() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 组件挂载时获取数据
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // 空依赖数组表示只在挂载时执行一次

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  return <div>数据: {JSON.stringify(data)}</div>;
}

// 5. 自定义 Hook：封装可复用逻辑
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

function CounterWithCustomHook() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}

// ----- React 的问题：纯客户端渲染 -----
/*
问题演示：

1. 首屏白屏
   - 用户访问页面时，先下载 HTML（几乎是空的）
   - 然后下载 JavaScript bundle（可能很大）
   - 执行 JavaScript，渲染 React 组件
   - 最后才看到内容

2. SEO 不友好
   - 搜索引擎爬虫看到的是空 HTML
   - 虽然 Google 可以执行 JavaScript，但其他搜索引擎可能不行

3. 数据获取在客户端
   - 组件渲染后才开始获取数据（useEffect）
   - 用户需要等待数据加载
   - 可能出现多次请求（瀑布流）

这些问题促使了 Next.js 的诞生！
*/

// ----- Next.js 如何解决这些问题 -----
/*
1. 服务端渲染（SSR）
   - 在服务器上渲染 React 组件
   - 返回完整的 HTML 给客户端
   - 用户立即看到内容，然后 JavaScript 接管交互

2. 静态生成（SSG）
   - 构建时生成 HTML
   - 部署后直接返回静态文件
   - 速度最快，适合内容不常变化的页面

3. React Server Components
   - 组件在服务器运行，不发送 JavaScript 到客户端
   - 可以直接访问数据库、文件系统
   - 减少客户端 JavaScript 体积

4. 自动代码分割
   - 每个页面只加载需要的 JavaScript
   - 路由切换时按需加载
   - 提升首屏加载速度

接下来的章节将详细介绍 Next.js 的这些特性！
*/
\`,
      keyPoints: [
        'React 解决了命令式 DOM 操作、状态同步、代码复用等问题',
        'React 的核心是声明式 UI、组件化、虚拟 DOM、单向数据流',
        'React 引入了 JSX、Hooks、Props/State 等新概念',
        'React 的问题：首屏性能、SEO、数据获取模式、路由配置',
        'Next.js 是 React 的超集，解决了 React 的工程化问题',
        'Next.js 提供了路由、SSR/SSG、优化、全栈能力等特性',
        '学习 Next.js 前需要先掌握 React 的核心概念'
      ],
      references: [
        { text: 'React 官方文档', url: 'https://react.dev' },
        { text: 'React 哲学', url: 'https://react.dev/learn/thinking-in-react' },
        { text: 'Why React?', url: 'https://react.dev/learn' },
        { text: 'Next.js vs React', url: 'https://nextjs.org/learn/foundations/from-javascript-to-react' }
      ]
    },
    {
      title: 'Next.js 框架概述',
      background: `Next.js 诞生于 2016 年，最初是为了解决 React 应用的服务端渲染问题。随着版本迭代，它逐渐发展成为一个功能完整的全栈框架。

2022 年发布的 Next.js 13 是一个里程碑版本，引入了全新的 App Router 和 React Server Components。这些新特性改变了 React 应用的开发方式，使得服务端渲染和客户端交互可以更自然地结合。

Next.js 的设计哲学是"约定优于配置"（Convention over Configuration）。通过文件系统路由、自动代码分割、内置优化等特性，开发者可以专注于业务逻辑，而不是繁琐的配置。`,
      content: `**Next.js 的核心特性**

1. **混合渲染策略**
   - SSR（服务端渲染）：每次请求时在服务器生成 HTML
   - SSG（静态站点生成）：构建时生成静态 HTML
   - ISR（增量静态再生成）：静态页面可以在后台更新
   - CSR（客户端渲染）：传统的 React 渲染方式

2. **文件系统路由**
   - 文件和文件夹的位置直接对应 URL 路由
   - 支持动态路由、嵌套路由、平行路由等高级模式
   - 无需手动配置路由表

3. **全栈能力**
   - API Routes：在同一项目中创建后端 API
   - Server Actions：直接在组件中调用服务端函数
   - 中间件：请求级别的拦截和处理

4. **内置优化**
   - 自动代码分割和懒加载
   - 图片优化（next/image）
   - 字体优化（next/font）
   - 脚本优化（next/script）`,
      codeExample: `// ==========================================
// Next.js 项目结构（App Router）
// ==========================================

/*
my-nextjs-app/
├── app/                          # App Router 目录
│   ├── layout.tsx               # 根布局（必需）
│   ├── page.tsx                 # 首页 (/)
│   ├── loading.tsx              # 加载状态 UI
│   ├── error.tsx                # 错误处理 UI
│   ├── not-found.tsx            # 404 页面
│   │
│   ├── dashboard/               # /dashboard 路由
│   │   ├── layout.tsx           # 仪表板布局
│   │   ├── page.tsx             # 仪表板首页
│   │   └── settings/
│   │       └── page.tsx         # /dashboard/settings
│   │
│   ├── blog/
│   │   ├── page.tsx             # /blog（博客列表）
│   │   └── [slug]/              # 动态路由
│   │       └── page.tsx         # /blog/my-post
│   │
│   ├── api/                     # API 路由
│   │   └── users/
│   │       └── route.ts         # /api/users
│   │
│   └── globals.css              # 全局样式
│
├── components/                   # 可复用组件
│   ├── ui/                      # UI 基础组件
│   └── features/                # 功能组件
│
├── lib/                         # 工具函数和配置
│   ├── db.ts                    # 数据库连接
│   └── utils.ts                 # 通用工具
│
├── public/                      # 静态资源
│   └── images/
│
├── next.config.js               # Next.js 配置
├── tailwind.config.js           # Tailwind 配置
├── tsconfig.json                # TypeScript 配置
└── package.json
*/

// ----- 创建 Next.js 项目 -----
// 终端命令：
// npx create-next-app@latest my-app --typescript --tailwind --eslint --app

// ----- 根布局 (app/layout.tsx) -----
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'A modern web application built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <header>
          <nav>{/* 导航栏 */}</nav>
        </header>
        <main>{children}</main>
        <footer>{/* 页脚 */}</footer>
      </body>
    </html>
  );
}

// ----- 首页 (app/page.tsx) -----
export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold">欢迎使用 Next.js</h1>
      <p className="mt-4 text-gray-600">
        这是一个使用 App Router 构建的现代 Web 应用
      </p>
    </div>
  );
}`,
      keyPoints: [
        'Next.js 是基于 React 的全栈框架，提供 SSR、SSG、ISR 等渲染策略',
        'App Router 是 Next.js 13+ 的推荐路由方案，基于文件系统',
        'layout.tsx 定义共享布局，page.tsx 定义页面内容',
        '使用 TypeScript 可以获得完整的类型支持',
        'next.config.js 用于自定义 Next.js 的行为'
      ],
      references: [
        { text: 'Next.js 官方文档', url: 'https://nextjs.org/docs' },
        { text: 'Next.js 学习课程', url: 'https://nextjs.org/learn' },
        { text: 'App Router 介绍', url: 'https://nextjs.org/docs/app' }
      ]
    },
    {
      title: '文件系统路由详解',
      background: `Next.js 的文件系统路由是其最具特色的功能之一。在 App Router 中，app 目录下的文件夹结构直接映射到 URL 路由。这种"约定优于配置"的方式大大简化了路由管理。

与传统的路由配置（如 React Router 需要手动定义路由表）不同，Next.js 的路由是自动的——你只需要创建文件，路由就自动生效。这不仅减少了样板代码，还使得项目结构更加清晰。

App Router 还引入了一些特殊的文件约定，如 layout.tsx、loading.tsx、error.tsx 等，它们分别处理布局、加载状态和错误处理，形成了一套完整的页面生命周期管理方案。`,
      content: `**路由文件约定**

| 文件名 | 作用 |
|--------|------|
| page.tsx | 定义路由的 UI，使路由可访问 |
| layout.tsx | 定义共享布局，子路由共用 |
| loading.tsx | 加载状态 UI（基于 Suspense） |
| error.tsx | 错误处理 UI（基于 Error Boundary） |
| not-found.tsx | 404 页面 |
| route.ts | API 路由处理器 |

**路由类型**

1. **静态路由**: /about → app/about/page.tsx
2. **动态路由**: /blog/[slug] → app/blog/[slug]/page.tsx
3. **捕获所有路由**: /docs/[...slug] → app/docs/[...slug]/page.tsx
4. **可选捕获所有**: /shop/[[...slug]] → app/shop/[[...slug]]/page.tsx
5. **路由组**: (marketing) → 不影响 URL，用于组织代码`,
      codeExample: `// ==========================================
// 文件系统路由详解
// ==========================================

// ----- 静态路由 -----
// app/about/page.tsx → /about
export default function AboutPage() {
  return (
    <div>
      <h1>关于我们</h1>
      <p>这是关于页面</p>
    </div>
  );
}

// ----- 动态路由 -----
// app/blog/[slug]/page.tsx → /blog/my-first-post, /blog/hello-world 等

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <article>
      <h1>博客文章: {params.slug}</h1>
    </article>
  );
}

// 生成静态参数（用于 SSG）
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());
  
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

// ----- 多段动态路由 -----
// app/shop/[category]/[product]/page.tsx → /shop/electronics/iphone

interface ProductPageProps {
  params: {
    category: string;
    product: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div>
      <p>分类: {params.category}</p>
      <p>产品: {params.product}</p>
    </div>
  );
}

// ----- 捕获所有路由 -----
// app/docs/[...slug]/page.tsx → /docs/a, /docs/a/b, /docs/a/b/c 等

interface DocsPageProps {
  params: {
    slug: string[];  // 数组形式
  };
}

export default function DocsPage({ params }: DocsPageProps) {
  // /docs/getting-started/installation → slug = ['getting-started', 'installation']
  const path = params.slug.join('/');
  
  return (
    <div>
      <h1>文档路径: {path}</h1>
      <nav>
        {params.slug.map((segment, index) => (
          <span key={index}> / {segment}</span>
        ))}
      </nav>
    </div>
  );
}

// ----- 布局 (Layout) -----
// app/dashboard/layout.tsx

import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

// 布局是嵌套的：
// app/layout.tsx (根布局)
//   └── app/dashboard/layout.tsx (仪表板布局)
//         └── app/dashboard/settings/page.tsx (设置页面)

// ----- 加载状态 -----
// app/dashboard/loading.tsx

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      <span className="ml-3">加载中...</span>
    </div>
  );
}

// ----- 错误处理 -----
// app/dashboard/error.tsx
'use client'; // 错误组件必须是客户端组件

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 记录错误到日志服务
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold text-red-600">出错了！</h2>
      <p className="mt-2 text-gray-600">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        重试
      </button>
    </div>
  );
}

// ----- 路由组 -----
// 使用 (folderName) 创建路由组，不会影响 URL

/*
app/
├── (marketing)/           # 路由组：营销相关页面
│   ├── layout.tsx        # 营销页面专用布局
│   ├── page.tsx          # / (首页)
│   ├── about/
│   │   └── page.tsx      # /about
│   └── pricing/
│       └── page.tsx      # /pricing
│
├── (dashboard)/           # 路由组：仪表板相关页面
│   ├── layout.tsx        # 仪表板专用布局（带侧边栏）
│   ├── dashboard/
│   │   └── page.tsx      # /dashboard
│   └── settings/
│       └── page.tsx      # /settings
*/

// ----- 平行路由 -----
// 使用 @folderName 创建平行路由，可以同时渲染多个页面

/*
app/
├── layout.tsx
├── page.tsx
├── @modal/              # 平行路由：模态框
│   ├── default.tsx     # 默认内容（无模态框时）
│   └── login/
│       └── page.tsx    # 登录模态框
└── @sidebar/            # 平行路由：侧边栏
    └── default.tsx
*/

// app/layout.tsx - 使用平行路由
export default function Layout({
  children,
  modal,
  sidebar,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="flex">
      {sidebar}
      <main className="flex-1">
        {children}
        {modal}
      </main>
    </div>
  );
}`,
      keyPoints: [
        '文件夹名称直接对应 URL 路径段',
        '使用 [param] 创建动态路由，[...param] 捕获所有路由',
        'layout.tsx 创建共享布局，会自动嵌套',
        'loading.tsx 和 error.tsx 提供加载和错误状态的 UI',
        '路由组 (folderName) 用于组织代码而不影响 URL',
        '平行路由 @folderName 允许同时渲染多个页面'
      ],
      references: [
        { text: 'Next.js 路由基础', url: 'https://nextjs.org/docs/app/building-your-application/routing' },
        { text: '动态路由', url: 'https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes' },
        { text: '路由组', url: 'https://nextjs.org/docs/app/building-your-application/routing/route-groups' }
      ]
    },
    {
      title: 'Server Components vs Client Components',
      background: `React Server Components（RSC）是 React 18 引入的革命性特性，Next.js 13 的 App Router 将其作为默认渲染模式。这是 React 生态系统中最重要的架构变化之一。

传统的 React 应用是纯客户端渲染（CSR）：所有组件都在浏览器中运行，需要下载大量 JavaScript。即使使用 SSR，组件仍然需要在客户端"水合"（Hydration）才能交互。

Server Components 改变了这一范式：组件可以完全在服务器上运行，其 JavaScript 代码不会发送到客户端。这带来了更小的包体积、更快的首次加载、以及直接访问服务器资源（数据库、文件系统）的能力。`,
      content: `**Server Components 的特点**

- 默认在服务器上渲染，JavaScript 不发送到客户端
- 可以直接访问数据库、文件系统、环境变量
- 可以使用 async/await 直接获取数据
- 不能使用 React hooks（useState, useEffect 等）
- 不能处理用户交互（点击、输入等）

**Client Components 的特点**

- 在浏览器中运行，可以使用所有 React 特性
- 需要在文件顶部添加 'use client' 指令
- 可以使用 hooks、处理事件、访问浏览器 API
- JavaScript 会发送到客户端

**最佳实践**

- 默认使用 Server Components
- 只在需要交互或浏览器 API 时使用 Client Components
- 将 Client Components 放在组件树的叶子节点
- Server Components 可以导入 Client Components，反之不行`,
      codeExample: `// ==========================================
// Server Components vs Client Components
// ==========================================

// ----- Server Component（默认）-----
// app/users/page.tsx

import { db } from '@/lib/db';
import UserList from '@/components/UserList';

// 这是一个 Server Component
// - 可以直接使用 async/await
// - 可以直接访问数据库
// - 代码不会发送到客户端
export default async function UsersPage() {
  // 直接在组件中获取数据
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">用户列表</h1>
      
      {/* 将数据传递给客户端组件 */}
      <UserList users={users} />
      
      {/* 或者直接渲染 */}
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user.id} className="p-4 border rounded">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ----- Client Component -----
// components/UserList.tsx
'use client';  // 必须在文件顶部声明

import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 客户端过滤和排序
  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div>
      {/* 搜索框 - 需要处理用户输入 */}
      <input
        type="text"
        placeholder="搜索用户..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* 排序按钮 - 需要处理点击事件 */}
      <button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        排序: {sortOrder === 'asc' ? '升序' : '降序'}
      </button>

      {/* 用户列表 */}
      <ul className="space-y-2">
        {filteredUsers.map(user => (
          <li key={user.id} className="p-3 bg-gray-50 rounded">
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ----- 混合使用示例 -----
// app/dashboard/page.tsx

import { db } from '@/lib/db';
import DashboardStats from '@/components/DashboardStats';
import RecentActivity from '@/components/RecentActivity';
import InteractiveChart from '@/components/InteractiveChart';

export default async function DashboardPage() {
  // Server Component: 获取数据
  const [stats, activities] = await Promise.all([
    db.stats.findFirst(),
    db.activity.findMany({ take: 10 }),
  ]);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Server Component: 静态展示 */}
      <div className="col-span-4">
        <DashboardStats stats={stats} />
      </div>

      {/* Client Component: 交互式图表 */}
      <div className="col-span-8">
        <InteractiveChart data={stats?.chartData} />
      </div>

      {/* Server Component: 列表展示 */}
      <div className="col-span-12">
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}

// components/InteractiveChart.tsx
'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface ChartProps {
  data: Array<{ date: string; value: number }>;
}

export default function InteractiveChart({ data }: ChartProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // 根据时间范围过滤数据
  const filteredData = filterByTimeRange(data, timeRange);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex gap-2 mb-4">
        {(['week', 'month', 'year'] as const).map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={\`px-3 py-1 rounded \${
              timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }\`}
          >
            {range === 'week' ? '周' : range === 'month' ? '月' : '年'}
          </button>
        ))}
      </div>

      <LineChart width={600} height={300} data={filteredData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" />
      </LineChart>
    </div>
  );
}

function filterByTimeRange(data: any[], range: string) {
  // 实现时间范围过滤逻辑
  return data;
}

// ----- 常见错误示例 -----

// ❌ 错误：在 Server Component 中使用 hooks
// app/wrong/page.tsx
/*
import { useState } from 'react';  // 这会报错！

export default function WrongPage() {
  const [count, setCount] = useState(0);  // Server Component 不能使用 hooks
  return <div>{count}</div>;
}
*/

// ❌ 错误：在 Client Component 中直接访问数据库
// components/WrongComponent.tsx
/*
'use client';
import { db } from '@/lib/db';  // 数据库代码不应该发送到客户端

export default function WrongComponent() {
  const users = await db.user.findMany();  // 这不会工作
  return <div>{users.length}</div>;
}
*/

// ✅ 正确：通过 props 传递数据
// Server Component 获取数据，传递给 Client Component`,
      keyPoints: [
        'App Router 中的组件默认是 Server Components',
        '使用 "use client" 指令将组件标记为 Client Component',
        'Server Components 可以直接 async/await 获取数据',
        'Client Components 用于交互、hooks 和浏览器 API',
        '将 Client Components 放在组件树的叶子节点以最小化客户端 JavaScript',
        '数据从 Server Components 通过 props 传递给 Client Components'
      ],
      references: [
        { text: 'Server Components', url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components' },
        { text: 'Client Components', url: 'https://nextjs.org/docs/app/building-your-application/rendering/client-components' },
        { text: '组合模式', url: 'https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns' }
      ]
    },
    {
      title: 'API 路由与数据获取',
      background: `Next.js 允许在同一项目中创建 API 端点，这使得全栈开发变得非常简单。在 App Router 中，API 路由使用 route.ts 文件定义，支持所有 HTTP 方法。

API 路由在部署时会编译成 Serverless Functions（无服务器函数），这意味着它们可以自动扩展，按需执行，非常适合处理 API 请求。

对于数据获取，Next.js 提供了多种方式：
- 在 Server Components 中直接获取数据
- 使用 API 路由创建 RESTful 接口
- 使用 Server Actions 进行表单提交和数据变更`,
      content: `**API 路由基础**

API 路由文件必须命名为 route.ts（或 route.js），可以导出以下 HTTP 方法处理函数：
- GET：获取数据
- POST：创建数据
- PUT：更新数据（完整替换）
- PATCH：更新数据（部分更新）
- DELETE：删除数据

**数据获取策略**

1. **Server Components 直接获取**：最简单的方式，适合页面级数据
2. **API 路由**：适合需要被多个客户端调用的接口
3. **Server Actions**：适合表单提交和数据变更操作`,
      codeExample: `// ==========================================
// API 路由与数据获取
// ==========================================

// ----- 基础 API 路由 -----
// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// GET /api/users - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // 构建查询条件
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    // 并行执行查询
    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// POST /api/users - 创建用户
const createUserSchema = z.object({
  name: z.string().min(2, '名称至少2个字符'),
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码至少8个字符'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求体
    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: '验证失败',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // 检查邮箱是否已存在
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '邮箱已被注册' },
        { status: 409 }
      );
    }

    // 创建用户（实际项目中需要加密密码）
    const user = await db.user.create({
      data: {
        name,
        email,
        password, // 应该使用 bcrypt 加密
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { success: true, data: user },
      { status: 201 }
    );
  } catch (error) {
    console.error('创建用户失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// ----- 动态 API 路由 -----
// app/api/users/[id]/route.ts

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/users/123 - 获取单个用户
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await db.user.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// PUT /api/users/123 - 更新用户
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();

    const user = await db.user.update({
      where: { id: parseInt(params.id) },
      data: {
        name: body.name,
        email: body.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/123 - 删除用户
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await db.user.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { success: true, message: '删除成功' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    );
  }
}

// ----- Server Actions -----
// app/actions/user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

// Server Action: 创建用户
export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // 验证
  if (!name || !email) {
    return { error: '请填写所有必填字段' };
  }

  try {
    await db.user.create({
      data: { name, email },
    });

    // 重新验证缓存
    revalidatePath('/users');
    
    // 可选：重定向
    redirect('/users');
  } catch (error) {
    return { error: '创建失败' };
  }
}

// Server Action: 删除用户
export async function deleteUser(userId: number) {
  try {
    await db.user.delete({
      where: { id: userId },
    });

    revalidatePath('/users');
    return { success: true };
  } catch (error) {
    return { error: '删除失败' };
  }
}

// ----- 在组件中使用 Server Actions -----
// app/users/new/page.tsx

import { createUser } from '@/app/actions/user';

export default function NewUserPage() {
  return (
    <form action={createUser} className="space-y-4">
      <div>
        <label htmlFor="name">名称</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="email">邮箱</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        创建用户
      </button>
    </form>
  );
}

// ----- 客户端调用 Server Actions -----
// components/DeleteButton.tsx
'use client';

import { useTransition } from 'react';
import { deleteUser } from '@/app/actions/user';

export function DeleteButton({ userId }: { userId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('确定要删除吗？')) {
      startTransition(async () => {
        const result = await deleteUser(userId);
        if (result.error) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
    >
      {isPending ? '删除中...' : '删除'}
    </button>
  );
}`,
      keyPoints: [
        'API 路由使用 route.ts 文件，支持 GET、POST、PUT、DELETE 等方法',
        '使用 NextRequest 和 NextResponse 处理请求和响应',
        '动态路由参数通过第二个参数的 params 获取',
        'Server Actions 使用 "use server" 指令，可以直接在表单中调用',
        'revalidatePath 用于重新验证缓存，确保数据更新后页面刷新',
        '使用 zod 等库进行请求数据验证'
      ],
      references: [
        { text: 'Route Handlers', url: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers' },
        { text: 'Server Actions', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations' },
        { text: '数据获取', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching' }
      ]
    },
    {
      title: '中间件与认证',
      background: `中间件（Middleware）是 Next.js 提供的请求级别拦截机制。它在请求到达路由处理器之前运行，可以用于：
- 认证和授权检查
- 请求重定向
- 添加响应头
- A/B 测试
- 地理位置路由

中间件运行在 Edge Runtime（边缘运行时），这意味着它在全球各地的边缘节点上执行，延迟极低。但这也意味着它有一些限制，比如不能使用 Node.js 的某些 API。`,
      content: `**中间件的特点**

- 在每个请求之前运行
- 可以修改请求和响应
- 运行在 Edge Runtime，延迟低
- 使用 matcher 配置匹配的路由

**常见用例**

1. **认证检查**：验证用户是否登录
2. **权限控制**：检查用户是否有权访问某个页面
3. **重定向**：根据条件重定向到不同页面
4. **国际化**：根据用户语言偏好重定向`,
      codeExample: `// ==========================================
// 中间件与认证
// ==========================================

// ----- 基础中间件 -----
// middleware.ts（必须放在项目根目录）

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 获取请求信息
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  console.log(\`[Middleware] \${request.method} \${pathname}\`);

  // 添加自定义响应头
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'my-value');

  return response;
}

// 配置中间件匹配的路由
export const config = {
  matcher: [
    // 匹配所有路由，但排除静态文件和 API
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// ----- 认证中间件 -----
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// 需要认证的路由
const protectedRoutes = ['/dashboard', '/settings', '/profile'];

// 公开路由（已登录用户不应访问）
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // 验证 token
  const isAuthenticated = token ? await verifyToken(token) : false;

  // 检查是否访问受保护的路由
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // 检查是否访问认证路由
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // 未登录用户访问受保护路由 → 重定向到登录页
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 已登录用户访问认证路由 → 重定向到仪表板
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/profile/:path*', '/login', '/register'],
};

// ----- 基于角色的访问控制 -----
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getUserRole } from '@/lib/auth';

// 路由权限配置
const routePermissions: Record<string, string[]> = {
  '/admin': ['admin'],
  '/dashboard': ['admin', 'user'],
  '/settings': ['admin', 'user'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // 获取用户角色
  let userRole: string | null = null;
  if (token) {
    try {
      const payload = await verifyToken(token);
      userRole = payload.role;
    } catch {
      // Token 无效，清除 cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // 检查路由权限
  for (const [route, allowedRoles] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      if (!userRole) {
        // 未登录
        return NextResponse.redirect(new URL('/login', request.url));
      }
      if (!allowedRoles.includes(userRole)) {
        // 无权限
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

// ----- 国际化中间件 -----
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'zh', 'ja'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // 1. 检查 cookie 中的语言偏好
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. 检查 Accept-Language 头
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().substring(0, 2))
      .find(lang => locales.includes(lang));
    if (preferredLocale) {
      return preferredLocale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查路径是否已包含语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(\`/\${locale}/\`) || pathname === \`/\${locale}\`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 获取用户语言偏好并重定向
  const locale = getLocale(request);
  const newUrl = new URL(\`/\${locale}\${pathname}\`, request.url);
  
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// ----- JWT 认证工具 -----
// lib/auth.ts

import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as TokenPayload;
}`,
      keyPoints: [
        '中间件文件必须命名为 middleware.ts 并放在项目根目录',
        '使用 matcher 配置中间件匹配的路由',
        '中间件运行在 Edge Runtime，不能使用所有 Node.js API',
        'NextResponse.redirect() 用于重定向，NextResponse.next() 继续处理',
        '可以通过 cookies 和 headers 传递信息',
        '中间件适合做认证检查、权限控制、国际化等全局逻辑'
      ],
      references: [
        { text: 'Next.js 中间件', url: 'https://nextjs.org/docs/app/building-your-application/routing/middleware' },
        { text: 'Edge Runtime', url: 'https://nextjs.org/docs/app/api-reference/edge' },
        { text: '认证最佳实践', url: 'https://nextjs.org/docs/app/building-your-application/authentication' }
      ]
    }
  ],
  homework: [
    {
      title: '创建 Next.js 项目',
      description: '使用 create-next-app 创建一个新的 Next.js 项目，配置 TypeScript 和 Tailwind CSS，实现一个包含首页、关于页、联系页的多页面应用。',
      hints: ['使用 npx create-next-app@latest', '创建 layout.tsx 定义共享布局', '使用 Link 组件进行页面导航']
    },
    {
      title: '实现用户列表功能',
      description: '创建一个用户管理页面，包含用户列表展示、搜索过滤、分页功能。使用 Server Components 获取数据，Client Components 处理交互。',
      hints: ['创建 API 路由 /api/users', '使用 Server Component 获取初始数据', '使用 Client Component 实现搜索和分页']
    },
    {
      title: '添加认证中间件',
      description: '实现一个简单的认证系统，包含登录页面、受保护的仪表板页面，以及中间件进行认证检查。',
      hints: ['创建 middleware.ts', '使用 cookies 存储认证状态', '实现登录和登出功能']
    }
  ]
};
