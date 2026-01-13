import type { DayAnswers } from '../answersTypes';

export const day1Answers: DayAnswers = {
  day: 1,
  title: 'TypeScript 基础与类型系统',
  answers: [
    {
      homeworkIndex: 0,
      title: '创建类型定义文件',
      explanation: `## 思路说明

1. 用 interface 描述核心实体（User/Role/Permission），用类型别名封装枚举和联合。
2. 预留通用的 API 响应/分页类型，便于后续扩展。
3. 严格模式下优先使用 readonly/可选属性，减少可变共享状态。`,
      code: `// types.ts
export interface Permission {
  code: 'user.read' | 'user.write' | 'role.manage';
  description: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  createdAt: Date;
}

// 统一 API 响应与分页
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PageInfo {
  page: number;
  pageSize: number;
  total: number;
}

export type PagedResponse<T> = ApiResponse<{
  items: T[];
  pageInfo: PageInfo;
}>;`,
      language: 'typescript',
      testCases: [
        {
          input: 'User 对象 shape',
          expected: 'roles 是 Role[]，permissions 是 Permission[]',
          code: `const demoUser: User = {
  id: 'u1',
  name: 'Ada',
  email: 'ada@example.com',
  roles: [{ id: 'r1', name: 'admin', permissions: [] }],
  createdAt: new Date(),
};`
        },
        {
          input: '分页响应',
          expected: 'data.items 与 pageInfo 结构匹配',
          code: `const response: PagedResponse<User> = {
  success: true,
  data: { items: [demoUser], pageInfo: { page: 1, pageSize: 10, total: 1 } },
};`
        },
      ],
      keyInsights: [
        'interface 描述实体结构，type 组合/联合/工具泛型',
        'ApiResponse<T> 让所有请求形状统一',
        '在 strict 模式下多用 readonly/可选属性约束变化',
      ],
      relatedConcepts: ['interface', 'type alias', '泛型', 'strict 模式'],
    },
    {
      homeworkIndex: 1,
      title: '实现泛型数据结构',
      explanation: `## 思路说明

用泛型类 Stack<T>，在空栈 peek/pop 时返回 undefined；通过 length getter 暴露状态。`,
      code: `export class Stack<T> {
  #items: T[] = [];

  push(item: T) {
    this.#items.push(item);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  peek(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  isEmpty(): boolean {
    return this.#items.length === 0;
  }

  get length() {
    return this.#items.length;
  }
}

// 使用示例
const numbers = new Stack<number>();
numbers.push(1);
numbers.push(2);
console.log(numbers.peek()); // 2`,
      language: 'typescript',
      testCases: [
        {
          input: 'push 后 length',
          expected: 'length 递增且 peek 返回栈顶',
          code: `const s = new Stack<string>();
s.push('a'); s.push('b');
console.log(s.length, s.peek()); // 2 'b'`
        },
        {
          input: '空栈 pop',
          expected: '返回 undefined 而非抛错',
          code: `const empty = new Stack<number>();
console.log(empty.pop()); // undefined`
        },
      ],
      keyInsights: [
        '用私有字段封装内部数组，避免外部直接修改',
        '返回 undefined 比抛错更便于调用方处理空栈',
        'length 用 getter，保持不可写',
      ],
      relatedConcepts: ['泛型类', '封装', '可选返回值'],
    },
    {
      homeworkIndex: 2,
      title: '配置 TypeScript 项目',
      explanation: `## 思路说明

1. 使用 \`pnpm dlx create-next-app@latest --ts\` 或 \`pnpm dlx tsx --init\` 初始化。
2. 开启 strict 与路径别名，保持一致的编译设置。
3. 使用 \`paths\` 将 @/* 指向 src，便于导入。`,
      code: `// tsconfig.json 片段
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// 验证命令
// pnpm tsc --noEmit`,
      language: 'typescript',
      testCases: [
        {
          input: 'tsc --noEmit',
          expected: '无类型错误',
          code: `pnpm tsc --noEmit`
        },
        {
          input: '路径别名导入',
          expected: '@/* 能正确解析',
          code: `import { Stack } from '@/lib/stack';`
        },
      ],
      keyInsights: [
        'strict + noEmit 保障类型安全而不产生构建产物',
        '路径别名减少相对路径复杂度',
        '在 CI 中运行 tsc --noEmit 是最低成本的防线',
      ],
      relatedConcepts: ['tsconfig', 'paths', 'strict 模式'],
    },
  ],
};
