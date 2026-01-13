import type { DayAnswers } from '../answersTypes';

export const day2Answers: DayAnswers = {
  day: 2,
  title: 'Next.js 入门与全栈基础',
  answers: [
    {
      homeworkIndex: 0,
      title: '创建 Next.js 项目',
      explanation: `## 思路说明

1. 使用官方脚手架生成 TS + Tailwind 模板。
2. 在 \`app/\` 下建立 layout 与基础页面（首页/关于/联系），复用导航。
3. 将全局样式与 meta 放入 \`app/layout.tsx\`。`,
      code: `# 初始化（示例）
pnpm dlx create-next-app@latest next-demo --ts --tailwind --eslint

// app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = { title: 'Demo', description: 'Next.js starter' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white">
          <nav className="max-w-5xl mx-auto flex gap-4 p-4">
            <a href="/">首页</a>
            <a href="/about">关于</a>
            <a href="/contact">联系</a>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}

// app/page.tsx
export default function Home() {
  return <h1 className="text-3xl font-bold">Hello Next.js</h1>;
}

// app/about/page.tsx 与 app/contact/page.tsx 类似`,
      language: 'typescript',
      testCases: [
        {
          input: 'pnpm dev',
          expected: 'http://localhost:3000 正常加载 3 个页面',
          code: `pnpm dev`
        },
        {
          input: 'pnpm lint',
          expected: 'ESLint 通过',
          code: `pnpm lint`
        },
      ],
      keyInsights: [
        'App Router 下的 \`app/layout.tsx\` 充当根布局',
        'Tailwind 已预置，直接在 JSX 使用类名',
        '小页面优先静态渲染，减少服务器开销',
      ],
      relatedConcepts: ['App Router', '布局', 'Tailwind'],
    },
    {
      homeworkIndex: 1,
      title: '实现用户列表功能',
      explanation: `## 思路说明

1. API Route 提供用户数据；Server Component 直接 fetch。
2. Client Component 负责搜索/分页状态，避免服务器端重新渲染过多。
3. 分页参数通过查询字符串管理，便于分享链接。`,
      code: `// app/api/users/route.ts
import { NextResponse } from 'next/server';

const users = [
  { id: 1, name: 'Ada', email: 'ada@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  // ...
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() ?? '';
  const filtered = users.filter((u) => u.name.toLowerCase().includes(q));
  return NextResponse.json({ data: filtered });
}

// app/users/page.tsx (Server Component)
import UserTable from './UserTable';

export default async function UsersPage({ searchParams }: { searchParams: { q?: string } }) {
  const res = await fetch(\`${process.env.NEXT_PUBLIC_BASE_URL}/api/users?q=\${searchParams.q ?? ''}\`, { cache: 'no-store' });
  const { data } = await res.json();
  return <UserTable initialData={data} initialQuery={searchParams.q ?? ''} />;
}

// app/users/UserTable.tsx (Client Component)
'use client';
import { useEffect, useState } from 'react';

export default function UserTable({ initialData, initialQuery }: { initialData: any[]; initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const run = async () => {
      const res = await fetch(\`/api/users?q=\${query}\`);
      setData((await res.json()).data);
    };
    run();
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索用户" />
      <ul>{data.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  );
}`,
      language: 'typescript',
      testCases: [
        {
          input: 'GET /api/users?q=ada',
          expected: '只返回 name 含 ada 的用户',
          code: `curl "http://localhost:3000/api/users?q=ada"`
        },
        {
          input: '空查询',
          expected: '返回全部用户',
          code: `curl "http://localhost:3000/api/users"`
        },
      ],
      keyInsights: [
        'Server Component 适合数据获取，Client 组件处理交互',
        'API Route 返回 JSON，默认不可缓存时用 cache: "no-store"',
        '搜索/分页参数放在 URL，便于分享与刷新保持状态',
      ],
      relatedConcepts: ['API Routes', 'Server/Client Components', '搜索过滤'],
    },
    {
      homeworkIndex: 2,
      title: '添加认证中间件',
      explanation: `## 思路说明

1. 使用 \`middleware.ts\` 拦截受保护路径，检查 cookie/token。
2. 未登录跳转到 /login，同时附带回跳的 next 参数。
3. 在 API 路由也可使用相同逻辑避免未授权访问。`,
      code: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/about', '/contact'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const token = req.cookies.get('session')?.value;
  if (!token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

// app/login/page.tsx (示意)
// 处理登录成功后 setCookie 并重定向到 next`,
      language: 'typescript',
      testCases: [
        {
          input: '未登录访问 /dashboard',
          expected: '302 重定向到 /login?next=/dashboard',
          code: `curl -I http://localhost:3000/dashboard`
        },
        {
          input: '携带 session cookie',
          expected: '放行到受保护页面',
          code: `curl -I --cookie "session=demo" http://localhost:3000/dashboard`
        },
      ],
      keyInsights: [
        'middleware 在边缘执行，可统一处理鉴权',
        '记得排除 _next 静态资源',
        '登录后写入 httpOnly/secure cookie，再重定向回原路径',
      ],
      relatedConcepts: ['middleware', '重定向', 'cookie 鉴权'],
    },
  ],
};
