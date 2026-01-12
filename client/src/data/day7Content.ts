export const day7Content = {
  day: 7,
  title: '综合项目与云端部署',
  subtitle: '云端浏览器服务与完整项目实战',
  overview: `在前六天的学习中，我们掌握了 TypeScript、Next.js、Playwright、MCP 协议和 Stagehand 等技术。今天，我们将把这些知识整合起来，学习云端浏览器服务的使用，并完成一个综合实战项目。

云端浏览器服务（如 Browserbase、Hyperbrowser、Steel）提供了托管的浏览器基础设施，解决了本地浏览器自动化的诸多问题：
- 无需管理浏览器环境
- 支持大规模并行执行
- 内置代理和反检测功能
- 提供会话录制和调试工具

本章将介绍主流的云端浏览器服务，并通过一个完整的项目将所学知识串联起来。`,
  sections: [
    {
      title: '云端浏览器服务概览',
      background: `云端浏览器服务是近年来兴起的基础设施即服务（IaaS）产品，专门为浏览器自动化和网页爬虫提供托管环境。

使用云端浏览器的优势：
1. **无需维护**：不用管理浏览器版本、依赖和更新
2. **可扩展性**：轻松实现大规模并行执行
3. **反检测**：内置指纹伪装和代理轮换
4. **全球分布**：从不同地理位置访问网站
5. **会话管理**：支持持久化会话和状态复用

主流的云端浏览器服务包括 Browserbase、Hyperbrowser、Steel、Apify 等。`,
      content: `**主流云端浏览器服务对比**

| 服务 | 特点 | 定价模式 | 适用场景 |
|------|------|----------|----------|
| Browserbase | Stagehand 原生支持、调试工具强 | 按会话时长 | AI Agent、复杂自动化 |
| Hyperbrowser | 简单易用、API 友好 | 按请求数 | 网页爬虫、数据采集 |
| Steel | 开源可自托管、MCP 支持 | 自托管免费 | 需要完全控制的场景 |
| Apify | 完整的爬虫平台 | 按计算单元 | 大规模数据采集 |

**选择建议**

- 如果使用 Stagehand：优先选择 Browserbase
- 如果需要简单的 API：考虑 Hyperbrowser
- 如果需要完全控制：使用 Steel 自托管
- 如果需要完整的爬虫平台：使用 Apify`,
      codeExample: `// ==========================================
// 云端浏览器服务使用示例
// ==========================================

// ----- Browserbase -----
/*
Browserbase 是 Stagehand 的官方云端浏览器服务。

注册：https://www.browserbase.com/
获取 API Key 和 Project ID
*/

import { Stagehand } from '@browserbasehq/stagehand';

async function useBrowserbase() {
  const stagehand = new Stagehand({
    env: 'BROWSERBASE',  // 使用云端浏览器
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
    browserbaseSessionCreateParams: {
      projectId: process.env.BROWSERBASE_PROJECT_ID,
      // 可选配置
      browserSettings: {
        // 指纹设置
        fingerprint: {
          browsers: ['chrome'],
          devices: ['desktop'],
          operatingSystems: ['macos'],
        },
        // 视口设置
        viewport: {
          width: 1920,
          height: 1080,
        },
      },
      // 代理设置
      proxies: true,  // 使用内置代理
    },
  });

  await stagehand.init();
  
  // 获取会话信息
  console.log('Session ID:', stagehand.browserbaseSessionID);
  
  // 正常使用 Stagehand API
  const page = stagehand.page;
  await page.goto('https://example.com');
  
  await stagehand.act({
    action: '点击登录按钮'
  });

  // 获取实时调试 URL
  // 可以在浏览器中打开查看实时执行
  const debugUrl = \`https://www.browserbase.com/sessions/\${stagehand.browserbaseSessionID}\`;
  console.log('Debug URL:', debugUrl);

  await stagehand.close();
}

// ----- Hyperbrowser -----
/*
Hyperbrowser 提供简单的 API 来控制云端浏览器。

注册：https://hyperbrowser.ai/
获取 API Key
*/

import { chromium } from 'playwright';

async function useHyperbrowser() {
  // 连接到 Hyperbrowser
  const browser = await chromium.connectOverCDP(
    \`wss://connect.hyperbrowser.ai?apiKey=\${process.env.HYPERBROWSER_API_KEY}\`
  );

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  });

  const page = await context.newPage();

  await page.goto('https://example.com');
  await page.screenshot({ path: 'screenshot.png' });

  await browser.close();
}

// Hyperbrowser 也支持 Stagehand
async function useHyperbrowserWithStagehand() {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
    localBrowserLaunchOptions: {
      cdpUrl: \`wss://connect.hyperbrowser.ai?apiKey=\${process.env.HYPERBROWSER_API_KEY}\`,
    },
  });

  await stagehand.init();
  // 使用 Stagehand API...
  await stagehand.close();
}

// ----- Steel (开源自托管) -----
/*
Steel 是开源的云端浏览器服务，可以自托管。

GitHub: https://github.com/AskSteel/steel
Docker 部署: docker run -p 3000:3000 asksteel/steel
*/

async function useSteel() {
  // 连接到自托管的 Steel 服务
  const browser = await chromium.connectOverCDP(
    'ws://localhost:3000/connect'
  );

  const page = await browser.newPage();
  await page.goto('https://example.com');

  // Steel 支持会话持久化
  const sessionId = 'my-session-123';
  
  // 创建持久化会话
  const response = await fetch('http://localhost:3000/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      timeout: 3600000,  // 1 小时
    }),
  });

  const { wsEndpoint } = await response.json();
  
  // 连接到持久化会话
  const persistentBrowser = await chromium.connectOverCDP(wsEndpoint);

  await browser.close();
}

// ----- Steel MCP Server -----
/*
Steel 提供了 MCP Server，可以让 AI 直接控制浏览器。

安装：npm install -g @anthropic-ai/mcp-server-steel

Claude Desktop 配置：
{
  "mcpServers": {
    "steel": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-steel"],
      "env": {
        "STEEL_API_URL": "http://localhost:3000"
      }
    }
  }
}
*/

// ----- 对比本地和云端执行 -----
async function compareLocalAndCloud() {
  // 本地执行
  console.time('Local execution');
  const localStagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
  });
  await localStagehand.init();
  await localStagehand.page.goto('https://example.com');
  await localStagehand.close();
  console.timeEnd('Local execution');

  // 云端执行
  console.time('Cloud execution');
  const cloudStagehand = new Stagehand({
    env: 'BROWSERBASE',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
    browserbaseSessionCreateParams: {
      projectId: process.env.BROWSERBASE_PROJECT_ID,
    },
  });
  await cloudStagehand.init();
  await cloudStagehand.page.goto('https://example.com');
  await cloudStagehand.close();
  console.timeEnd('Cloud execution');
}`,
      keyPoints: [
        '云端浏览器服务提供托管的浏览器基础设施',
        'Browserbase 是 Stagehand 的官方云端服务',
        'Hyperbrowser 提供简单易用的 API',
        'Steel 是开源可自托管的选择',
        '云端服务内置反检测和代理功能',
        '适合大规模并行执行和生产环境'
      ],
      references: [
        { text: 'Browserbase', url: 'https://www.browserbase.com/' },
        { text: 'Hyperbrowser', url: 'https://hyperbrowser.ai/' },
        { text: 'Steel GitHub', url: 'https://github.com/AskSteel/steel' },
        { text: 'Apify', url: 'https://apify.com/' }
      ]
    },
    {
      title: '工程化最佳实践',
      background: `在实际项目中，浏览器自动化代码需要遵循软件工程的最佳实践，以确保代码的可维护性、可测试性和可扩展性。

本节将介绍：
- 项目结构组织
- 配置管理
- 错误处理和重试机制
- 日志记录
- 测试策略`,
      content: `**推荐的项目结构**

\`\`\`
browser-automation/
├── src/
│   ├── agents/           # AI Agent 实现
│   │   ├── base.ts       # 基础 Agent 类
│   │   └── airbnb.ts     # Airbnb 专用 Agent
│   ├── actions/          # 可复用的操作
│   │   ├── auth.ts       # 认证相关
│   │   └── navigation.ts # 导航相关
│   ├── extractors/       # 数据提取器
│   │   └── schemas.ts    # Zod schemas
│   ├── utils/            # 工具函数
│   │   ├── retry.ts      # 重试逻辑
│   │   └── logger.ts     # 日志工具
│   └── config/           # 配置文件
│       └── index.ts
├── tests/                # 测试文件
├── .env                  # 环境变量
└── package.json
\`\`\``,
      codeExample: `// ==========================================
// 工程化最佳实践
// ==========================================

// ----- 配置管理 -----
// src/config/index.ts

import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  // AI 模型配置
  anthropicApiKey: z.string(),
  modelName: z.string().default('claude-3-5-sonnet-20241022'),
  
  // 浏览器配置
  browserEnv: z.enum(['LOCAL', 'BROWSERBASE']).default('LOCAL'),
  browserbaseProjectId: z.string().optional(),
  browserbaseApiKey: z.string().optional(),
  
  // 执行配置
  headless: z.boolean().default(false),
  timeout: z.number().default(30000),
  retryAttempts: z.number().default(3),
  
  // 日志配置
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type Config = z.infer<typeof configSchema>;

export const config: Config = configSchema.parse({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  modelName: process.env.MODEL_NAME,
  browserEnv: process.env.BROWSER_ENV,
  browserbaseProjectId: process.env.BROWSERBASE_PROJECT_ID,
  browserbaseApiKey: process.env.BROWSERBASE_API_KEY,
  headless: process.env.HEADLESS === 'true',
  timeout: parseInt(process.env.TIMEOUT || '30000'),
  retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3'),
  logLevel: process.env.LOG_LEVEL as any,
});

// ----- 日志工具 -----
// src/utils/logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private level: LogLevel;
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(level: LogLevel = 'info') {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level];
  }

  private format(level: LogLevel, message: string, meta?: object): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? \` \${JSON.stringify(meta)}\` : '';
    return \`[\${timestamp}] [\${level.toUpperCase()}] \${message}\${metaStr}\`;
  }

  debug(message: string, meta?: object) {
    if (this.shouldLog('debug')) {
      console.log(this.format('debug', message, meta));
    }
  }

  info(message: string, meta?: object) {
    if (this.shouldLog('info')) {
      console.log(this.format('info', message, meta));
    }
  }

  warn(message: string, meta?: object) {
    if (this.shouldLog('warn')) {
      console.warn(this.format('warn', message, meta));
    }
  }

  error(message: string, meta?: object) {
    if (this.shouldLog('error')) {
      console.error(this.format('error', message, meta));
    }
  }
}

export const logger = new Logger(config.logLevel);

// ----- 重试机制 -----
// src/utils/retry.ts

interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
  onRetry?: (error: Error, attempt: number) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: Error;
  let delay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }

      logger.warn(\`Attempt \${attempt} failed, retrying in \${delay}ms\`, {
        error: lastError.message,
      });

      onRetry?.(lastError, attempt);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= backoffMultiplier;
    }
  }

  throw lastError!;
}

// ----- 基础 Agent 类 -----
// src/agents/base.ts

import { Stagehand } from '@browserbasehq/stagehand';
import { config } from '../config';
import { logger } from '../utils/logger';
import { withRetry } from '../utils/retry';

export interface AgentResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  executionTime: number;
  steps: string[];
}

export abstract class BaseAgent<T> {
  protected stagehand: Stagehand | null = null;
  protected steps: string[] = [];
  protected startTime: number = 0;

  async init(): Promise<void> {
    logger.info('Initializing agent');
    
    this.stagehand = new Stagehand({
      env: config.browserEnv,
      modelName: config.modelName,
      modelClientOptions: {
        apiKey: config.anthropicApiKey,
      },
      headless: config.headless,
      ...(config.browserEnv === 'BROWSERBASE' && {
        browserbaseSessionCreateParams: {
          projectId: config.browserbaseProjectId,
        },
      }),
    });

    await this.stagehand.init();
    this.startTime = Date.now();
    logger.info('Agent initialized');
  }

  async cleanup(): Promise<void> {
    if (this.stagehand) {
      await this.stagehand.close();
      this.stagehand = null;
    }
    logger.info('Agent cleaned up');
  }

  protected async act(action: string): Promise<void> {
    if (!this.stagehand) throw new Error('Agent not initialized');
    
    logger.debug(\`Executing action: \${action}\`);
    this.steps.push(action);
    
    await withRetry(
      () => this.stagehand!.act({ action }),
      {
        maxAttempts: config.retryAttempts,
        onRetry: (error, attempt) => {
          logger.warn(\`Action failed, retrying\`, { action, attempt, error: error.message });
        },
      }
    );
  }

  protected async extract<S>(instruction: string, schema: any): Promise<S> {
    if (!this.stagehand) throw new Error('Agent not initialized');
    
    logger.debug(\`Extracting data: \${instruction}\`);
    
    return withRetry(
      () => this.stagehand!.extract({ instruction, schema }),
      { maxAttempts: config.retryAttempts }
    );
  }

  protected async navigate(url: string): Promise<void> {
    if (!this.stagehand) throw new Error('Agent not initialized');
    
    logger.info(\`Navigating to: \${url}\`);
    await this.stagehand.page.goto(url, { waitUntil: 'networkidle' });
  }

  abstract execute(): Promise<AgentResult<T>>;

  async run(): Promise<AgentResult<T>> {
    try {
      await this.init();
      const result = await this.execute();
      return result;
    } catch (error) {
      logger.error('Agent execution failed', { error: (error as Error).message });
      return {
        success: false,
        error: (error as Error).message,
        executionTime: Date.now() - this.startTime,
        steps: this.steps,
      };
    } finally {
      await this.cleanup();
    }
  }
}

// ----- Airbnb Agent 实现 -----
// src/agents/airbnb.ts

import { z } from 'zod';
import { BaseAgent, AgentResult } from './base';
import { logger } from '../utils/logger';

const ListingSchema = z.object({
  name: z.string(),
  type: z.string(),
  pricePerNight: z.number(),
  currency: z.string(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  isSuperhost: z.boolean().optional(),
});

const SearchResultSchema = z.object({
  listings: z.array(ListingSchema),
  totalResults: z.string().optional(),
});

type SearchResult = z.infer<typeof SearchResultSchema>;

interface AirbnbSearchParams {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  guests?: number;
  maxPrice?: number;
}

export class AirbnbAgent extends BaseAgent<SearchResult> {
  private params: AirbnbSearchParams;

  constructor(params: AirbnbSearchParams) {
    super();
    this.params = params;
  }

  async execute(): Promise<AgentResult<SearchResult>> {
    logger.info('Starting Airbnb search', { params: this.params });

    // 1. 导航到 Airbnb
    await this.navigate('https://www.airbnb.com');

    // 2. 关闭可能的弹窗
    try {
      await this.act('如果有弹窗或对话框，关闭它');
    } catch {
      // 忽略，可能没有弹窗
    }

    // 3. 输入目的地
    await this.act('点击搜索栏中的目的地输入框');
    await this.act(\`输入 "\${this.params.destination}" 作为目的地\`);
    await this.act(\`从搜索建议中选择包含 "\${this.params.destination}" 的选项\`);

    // 4. 选择日期
    await this.act('点击入住日期选择器');
    
    const checkInStr = this.formatDate(this.params.checkIn);
    const checkOutStr = this.formatDate(this.params.checkOut);
    
    await this.act(\`选择 \${checkInStr} 作为入住日期\`);
    await this.act(\`选择 \${checkOutStr} 作为退房日期\`);

    // 5. 设置客人数量
    if (this.params.guests) {
      await this.act('点击客人数量选择器');
      await this.act(\`将成人数量设置为 \${this.params.guests}\`);
    }

    // 6. 搜索
    await this.act('点击搜索按钮');

    // 7. 等待结果加载
    await this.stagehand!.page.waitForLoadState('networkidle');
    await this.stagehand!.page.waitForTimeout(2000);

    // 8. 提取结果
    const results = await this.extract<SearchResult>(
      '提取页面上显示的房源信息',
      SearchResultSchema
    );

    // 9. 过滤价格（如果指定了最大价格）
    if (this.params.maxPrice && results.listings) {
      results.listings = results.listings.filter(
        listing => listing.pricePerNight <= this.params.maxPrice!
      );
    }

    logger.info(\`Found \${results.listings?.length || 0} listings\`);

    return {
      success: true,
      data: results,
      executionTime: Date.now() - this.startTime,
      steps: this.steps,
    };
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

// ----- 使用示例 -----
// src/index.ts

async function main() {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const checkOut = new Date(nextWeek);
  checkOut.setDate(checkOut.getDate() + 3);

  const agent = new AirbnbAgent({
    destination: 'New York',
    checkIn: nextWeek,
    checkOut: checkOut,
    guests: 2,
    maxPrice: 200,
  });

  const result = await agent.run();

  if (result.success) {
    console.log('搜索成功！');
    console.log(\`执行时间: \${result.executionTime}ms\`);
    console.log(\`执行步骤: \${result.steps.length}\`);
    console.log(\`找到 \${result.data?.listings?.length || 0} 个房源\`);
    
    result.data?.listings?.forEach((listing, i) => {
      console.log(\`\\n\${i + 1}. \${listing.name}\`);
      console.log(\`   类型: \${listing.type}\`);
      console.log(\`   价格: \${listing.currency} \${listing.pricePerNight}/晚\`);
      if (listing.rating) {
        console.log(\`   评分: \${listing.rating} (\${listing.reviewCount} 条评价)\`);
      }
    });
  } else {
    console.error('搜索失败:', result.error);
    console.log('执行步骤:', result.steps);
  }
}

main().catch(console.error);`,
      keyPoints: [
        '使用配置文件管理环境变量和设置',
        '实现统一的日志记录系统',
        '使用重试机制处理临时失败',
        '抽象基础 Agent 类实现代码复用',
        '使用 Zod 进行数据验证',
        '记录执行步骤便于调试'
      ],
      references: [
        { text: 'Zod 文档', url: 'https://zod.dev/' },
        { text: 'TypeScript 最佳实践', url: 'https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html' }
      ]
    },
    {
      title: '完整项目实战',
      background: `现在让我们把所有学到的知识整合起来，构建一个完整的项目：一个基于 Next.js 的 AI 浏览器自动化服务。

这个项目将包括：
- Next.js 前端界面
- API 路由处理请求
- Stagehand 执行自动化任务
- 支持本地和云端浏览器
- 任务队列和状态管理`,
      content: `**项目架构**

\`\`\`
ai-browser-service/
├── app/
│   ├── page.tsx              # 首页
│   ├── api/
│   │   ├── tasks/
│   │   │   ├── route.ts      # 创建任务
│   │   │   └── [id]/
│   │   │       └── route.ts  # 获取任务状态
│   │   └── execute/
│   │       └── route.ts      # 执行任务
│   └── layout.tsx
├── components/
│   ├── TaskForm.tsx          # 任务表单
│   └── TaskStatus.tsx        # 任务状态
├── lib/
│   ├── agents/               # Agent 实现
│   ├── queue.ts              # 任务队列
│   └── store.ts              # 状态存储
└── package.json
\`\`\``,
      codeExample: `// ==========================================
// 完整项目实战：AI 浏览器自动化服务
// ==========================================

// ----- 项目初始化 -----
/*
npx create-next-app@latest ai-browser-service --typescript --tailwind --app
cd ai-browser-service
npm install @browserbasehq/stagehand zod uuid
*/

// ----- 类型定义 -----
// lib/types.ts

export interface Task {
  id: string;
  type: 'airbnb_search' | 'google_search' | 'custom';
  status: 'pending' | 'running' | 'completed' | 'failed';
  params: Record<string, any>;
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  steps: string[];
}

export interface CreateTaskRequest {
  type: Task['type'];
  params: Record<string, any>;
}

// ----- 任务存储 -----
// lib/store.ts

import { Task } from './types';

// 简单的内存存储（生产环境应使用数据库）
const tasks = new Map<string, Task>();

export const taskStore = {
  get(id: string): Task | undefined {
    return tasks.get(id);
  },

  set(task: Task): void {
    tasks.set(task.id, task);
  },

  update(id: string, updates: Partial<Task>): Task | undefined {
    const task = tasks.get(id);
    if (task) {
      const updated = { ...task, ...updates, updatedAt: new Date() };
      tasks.set(id, updated);
      return updated;
    }
    return undefined;
  },

  list(): Task[] {
    return Array.from(tasks.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },
};

// ----- Agent 工厂 -----
// lib/agents/factory.ts

import { Stagehand } from '@browserbasehq/stagehand';
import { Task } from '../types';
import { taskStore } from '../store';

export async function executeTask(task: Task): Promise<void> {
  // 更新状态为运行中
  taskStore.update(task.id, { status: 'running' });

  const stagehand = new Stagehand({
    env: process.env.BROWSER_ENV as 'LOCAL' | 'BROWSERBASE' || 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY!,
    },
    ...(process.env.BROWSER_ENV === 'BROWSERBASE' && {
      browserbaseSessionCreateParams: {
        projectId: process.env.BROWSERBASE_PROJECT_ID!,
      },
    }),
  });

  try {
    await stagehand.init();
    const page = stagehand.page;
    const steps: string[] = [];

    switch (task.type) {
      case 'airbnb_search':
        await executeAirbnbSearch(stagehand, task.params, steps);
        break;
      case 'google_search':
        await executeGoogleSearch(stagehand, task.params, steps);
        break;
      case 'custom':
        await executeCustomTask(stagehand, task.params, steps);
        break;
    }

    // 提取结果
    const result = await stagehand.extract({
      instruction: task.params.extractInstruction || '提取页面上的主要内容',
      schema: task.params.schema || {
        type: 'object',
        properties: {
          content: { type: 'string' },
        },
      },
    });

    taskStore.update(task.id, {
      status: 'completed',
      result,
      steps,
    });

  } catch (error) {
    taskStore.update(task.id, {
      status: 'failed',
      error: (error as Error).message,
    });
  } finally {
    await stagehand.close();
  }
}

async function executeAirbnbSearch(
  stagehand: Stagehand,
  params: Record<string, any>,
  steps: string[]
): Promise<void> {
  const { destination, checkIn, checkOut, guests } = params;

  await stagehand.page.goto('https://www.airbnb.com');
  steps.push('打开 Airbnb');

  try {
    await stagehand.act({ action: '关闭弹窗' });
  } catch {}

  await stagehand.act({ action: '点击目的地输入框' });
  await stagehand.act({ action: \`输入 "\${destination}"\` });
  steps.push(\`输入目的地: \${destination}\`);

  await stagehand.act({ action: '选择第一个搜索建议' });
  steps.push('选择目的地');

  await stagehand.act({ action: '点击日期选择器' });
  await stagehand.act({ action: \`选择入住日期 \${checkIn}\` });
  await stagehand.act({ action: \`选择退房日期 \${checkOut}\` });
  steps.push(\`选择日期: \${checkIn} - \${checkOut}\`);

  if (guests) {
    await stagehand.act({ action: '点击客人选择器' });
    await stagehand.act({ action: \`设置 \${guests} 位客人\` });
    steps.push(\`设置客人数: \${guests}\`);
  }

  await stagehand.act({ action: '点击搜索按钮' });
  steps.push('执行搜索');

  await stagehand.page.waitForLoadState('networkidle');
}

async function executeGoogleSearch(
  stagehand: Stagehand,
  params: Record<string, any>,
  steps: string[]
): Promise<void> {
  const { query } = params;

  await stagehand.page.goto('https://www.google.com');
  steps.push('打开 Google');

  await stagehand.act({ action: \`在搜索框中输入 "\${query}"\` });
  steps.push(\`输入搜索词: \${query}\`);

  await stagehand.act({ action: '点击搜索按钮或按回车' });
  steps.push('执行搜索');

  await stagehand.page.waitForLoadState('networkidle');
}

async function executeCustomTask(
  stagehand: Stagehand,
  params: Record<string, any>,
  steps: string[]
): Promise<void> {
  const { url, actions } = params;

  if (url) {
    await stagehand.page.goto(url);
    steps.push(\`导航到: \${url}\`);
  }

  if (actions && Array.isArray(actions)) {
    for (const action of actions) {
      await stagehand.act({ action });
      steps.push(action);
    }
  }
}

// ----- API 路由：创建任务 -----
// app/api/tasks/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { taskStore } from '@/lib/store';
import { executeTask } from '@/lib/agents/factory';
import { CreateTaskRequest, Task } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskRequest = await request.json();

    const task: Task = {
      id: uuidv4(),
      type: body.type,
      status: 'pending',
      params: body.params,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [],
    };

    taskStore.set(task);

    // 异步执行任务
    executeTask(task).catch(console.error);

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function GET() {
  const tasks = taskStore.list();
  return NextResponse.json({ tasks });
}

// ----- API 路由：获取任务状态 -----
// app/api/tasks/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { taskStore } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const task = taskStore.get(params.id);

  if (!task) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ task });
}

// ----- 前端组件：任务表单 -----
// components/TaskForm.tsx

'use client';

import { useState } from 'react';

interface TaskFormProps {
  onSubmit: (task: any) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [type, setType] = useState('airbnb_search');
  const [destination, setDestination] = useState('New York');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let params: Record<string, any> = {};

    if (type === 'airbnb_search') {
      params = { destination, checkIn, checkOut, guests };
    } else if (type === 'google_search') {
      params = { query };
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, params }),
      });

      const data = await response.json();
      onSubmit(data.task);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium mb-1">任务类型</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="airbnb_search">Airbnb 搜索</option>
          <option value="google_search">Google 搜索</option>
        </select>
      </div>

      {type === 'airbnb_search' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">目的地</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">入住日期</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">退房日期</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">客人数量</label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              min={1}
              max={16}
              className="w-full p-2 border rounded"
            />
          </div>
        </>
      )}

      {type === 'google_search' && (
        <div>
          <label className="block text-sm font-medium mb-1">搜索关键词</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '创建中...' : '创建任务'}
      </button>
    </form>
  );
}

// ----- 前端页面 -----
// app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { TaskForm } from '@/components/TaskForm';
import { Task } from '@/lib/types';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 轮询更新任务状态
  useEffect(() => {
    const interval = setInterval(async () => {
      if (selectedTask && ['pending', 'running'].includes(selectedTask.status)) {
        const response = await fetch(\`/api/tasks/\${selectedTask.id}\`);
        const data = await response.json();
        setSelectedTask(data.task);
        
        // 更新任务列表
        setTasks(prev => prev.map(t => 
          t.id === data.task.id ? data.task : t
        ));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedTask]);

  const handleTaskCreated = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    setSelectedTask(task);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI 浏览器自动化服务</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">创建任务</h2>
            <TaskForm onSubmit={handleTaskCreated} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">任务状态</h2>
            {selectedTask ? (
              <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">{selectedTask.type}</span>
                  <span className={\`px-2 py-1 rounded text-sm \${
                    selectedTask.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedTask.status === 'failed' ? 'bg-red-100 text-red-800' :
                    selectedTask.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }\`}>
                    {selectedTask.status}
                  </span>
                </div>

                {selectedTask.steps.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">执行步骤</h3>
                    <ul className="text-sm space-y-1">
                      {selectedTask.steps.map((step, i) => (
                        <li key={i} className="text-gray-600">
                          {i + 1}. {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedTask.result && (
                  <div>
                    <h3 className="font-medium mb-2">结果</h3>
                    <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto max-h-60">
                      {JSON.stringify(selectedTask.result, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedTask.error && (
                  <div className="text-red-600">
                    <h3 className="font-medium mb-2">错误</h3>
                    <p className="text-sm">{selectedTask.error}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">创建任务后在此查看状态</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}`,
      keyPoints: [
        '使用 Next.js 构建全栈应用',
        'API 路由处理任务创建和状态查询',
        '异步执行自动化任务',
        '前端轮询更新任务状态',
        '支持多种任务类型',
        '可扩展的 Agent 工厂模式'
      ],
      references: [
        { text: 'Next.js 文档', url: 'https://nextjs.org/docs' },
        { text: 'Stagehand 文档', url: 'https://docs.stagehand.dev/' }
      ]
    },
    {
      title: '学习总结与进阶方向',
      background: `恭喜你完成了 7 天的前端学习之旅！让我们回顾一下学到的内容，并展望进阶方向。`,
      content: `**7 天学习内容回顾**

| 天数 | 主题 | 核心技能 |
|------|------|----------|
| Day 1 | TypeScript | 类型系统、泛型、模块化 |
| Day 2 | Next.js | App Router、SSR、API 路由 |
| Day 3 | 浏览器原理 | 多进程架构、渲染流程、CDP |
| Day 4 | Playwright | 元素定位、网络拦截、调试 |
| Day 5 | 高级自动化 | MCP 协议、复杂场景处理 |
| Day 6 | Stagehand | AI 驱动的自动化 |
| Day 7 | 综合项目 | 云端浏览器、工程化实践 |

**进阶学习方向**

1. **深入 AI Agent**：学习 LangChain、AutoGPT 等框架
2. **性能优化**：学习并行执行、资源管理
3. **安全与合规**：了解反爬虫、隐私保护
4. **生产部署**：学习 Docker、Kubernetes`,
      codeExample: `// ==========================================
// 学习总结与进阶资源
// ==========================================

/*
进阶学习资源：

1. AI Agent 开发
   - LangChain: https://js.langchain.com/
   - AutoGPT: https://github.com/Significant-Gravitas/AutoGPT
   - CrewAI: https://www.crewai.com/

2. 浏览器自动化进阶
   - Puppeteer: https://pptr.dev/
   - Selenium: https://www.selenium.dev/
   - Cypress: https://www.cypress.io/

3. 云端服务
   - Browserbase: https://www.browserbase.com/
   - Apify: https://apify.com/
   - Bright Data: https://brightdata.com/

4. 前端框架进阶
   - React 高级模式: https://react.dev/learn
   - Next.js 进阶: https://nextjs.org/docs/app/building-your-application
   - Vercel 部署: https://vercel.com/docs

5. 工程化工具
   - Turborepo: https://turbo.build/
   - pnpm: https://pnpm.io/
   - Vitest: https://vitest.dev/

6. 开源项目参考
   - Stagehand: https://github.com/browserbase/stagehand
   - Playwright MCP: https://github.com/anthropics/mcp-server-playwright
   - Steel: https://github.com/AskSteel/steel
*/

// ----- 持续学习建议 -----
/*
1. 实践为主
   - 每学一个新概念，立即动手实践
   - 构建自己的项目，解决实际问题
   - 参与开源项目，学习他人代码

2. 关注社区
   - 订阅技术博客和 Newsletter
   - 参加技术会议和 Meetup
   - 在 GitHub 上关注相关项目

3. 深入原理
   - 阅读源码，理解实现细节
   - 学习计算机基础知识
   - 理解设计模式和架构思想

4. 保持更新
   - AI 和自动化领域发展迅速
   - 定期学习新工具和框架
   - 关注行业趋势和最佳实践
*/`,
      keyPoints: [
        '7 天学习覆盖了前端自动化的核心技能',
        'TypeScript 和 Next.js 是现代前端开发的基础',
        'Playwright 和 Stagehand 是浏览器自动化的利器',
        'MCP 协议为 AI Agent 提供了标准化接口',
        '云端浏览器服务适合生产环境',
        '持续学习和实践是进步的关键'
      ],
      references: [
        { text: 'Awesome Browser Automation', url: 'https://github.com/nickmccurdy/awesome-browser-automation' },
        { text: 'Awesome AI Agents', url: 'https://github.com/e2b-dev/awesome-ai-agents' },
        { text: 'Frontend Roadmap', url: 'https://roadmap.sh/frontend' }
      ]
    }
  ],
  homework: [
    {
      title: '部署到云端',
      description: '将你的 AI 浏览器自动化服务部署到 Vercel，并配置 Browserbase 作为云端浏览器后端。测试在生产环境中的表现。',
      hints: ['使用 Vercel CLI 部署', '配置环境变量', '测试 API 端点']
    },
    {
      title: '扩展 Agent 功能',
      description: '为你的服务添加更多 Agent 类型，如：电商比价 Agent、新闻聚合 Agent、社交媒体监控 Agent。',
      hints: ['复用 BaseAgent 类', '定义合适的 Schema', '处理各网站的特殊情况']
    },
    {
      title: '构建完整的 Demo',
      description: '整合所有学到的知识，构建一个完整的演示项目。项目应该包括：用户界面、任务管理、结果展示、错误处理。',
      hints: ['使用 shadcn/ui 构建界面', '添加任务历史记录', '实现结果导出功能']
    }
  ]
};
