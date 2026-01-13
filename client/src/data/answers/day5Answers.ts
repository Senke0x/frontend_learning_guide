import type { DayAnswers } from '../answersTypes';

export const day5Answers: DayAnswers = {
  day: 5,
  title: 'MCP 与复杂场景处理',
  answers: [
    {
      homeworkIndex: 0,
      title: '实现自定义 MCP Server',
      explanation: `## 思路说明

1. 基于 \`@modelcontextprotocol/sdk\` 创建 StdioServer，注册工具。
2. 每个工具描述清晰的参数与返回值，做好错误处理。
3. 在 Host（如 Claude Desktop）中通过 config 引用 server。`,
      code: `// mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  {
    name: 'custom-tools',
    version: '0.1.0',
    description: 'Browser helper tools',
  },
  {
    tools: {
      'http_get': {
        description: 'Fetch a JSON endpoint',
        inputSchema: {
          type: 'object',
          properties: { url: { type: 'string' } },
          required: ['url'],
        },
        handler: async ({ url }) => {
          const res = await fetch(url);
          return { content: [{ type: 'text', text: await res.text() }] };
        },
      },
      'parse_cookies': {
        description: 'Parse Set-Cookie string',
        inputSchema: {
          type: 'object',
          properties: { header: { type: 'string' } },
          required: ['header'],
        },
        handler: async ({ header }) => {
          const parts = header.split(';').map((s) => s.trim());
          const [nameValue, ...rest] = parts;
          return { content: [{ type: 'text', text: JSON.stringify({ nameValue, attributes: rest }) }] };
        },
      },
    },
  }
);

await server.connect(new StdioServerTransport());`,
      language: 'typescript',
      testCases: [
        {
          input: '调用 http_get',
          expected: '返回 HTTP 响应正文',
          code: '在 Host 中执行 tools/call name=http_get url=https://example.com'
        },
        {
          input: '无 url 参数',
          expected: 'schema 校验失败',
          code: '调用时缺少 url，应返回 400/validation error'
        },
      ],
      keyInsights: [
        '工具定义需包含 description 与 inputSchema，便于模型理解',
        'Stdio 传输方便本地开发，生产可换 HTTP/WebSocket',
        '务必捕获错误并返回可读消息，避免让模型拿到栈信息',
      ],
      relatedConcepts: ['MCP Server', '工具定义', 'Stdio transport'],
    },
    {
      homeworkIndex: 1,
      title: '处理复杂登录流程',
      explanation: `## 思路说明

1. 使用 \`storageState\` 复用已登录状态；若失效则自动重新登录。
2. 登录流程中加人机验证占位，支持手动介入或调用第三方解码。
3. 抽象出 \`ensureLoggedIn(page)\`，下游脚本可复用。`,
      code: `// login-helper.ts
import { chromium, Page } from 'playwright';
import fs from 'node:fs';

const STATE_PATH = 'state.json';

export async function ensureLoggedIn(page: Page) {
  await page.goto('https://target.example.com/login');

  if (await page.getByText(/dashboard/i).isVisible()) return;

  await page.getByLabel('Email').fill(process.env.USER_EMAIL || '');
  await page.getByLabel('Password').fill(process.env.USER_PASSWORD || '');

  // 如果有验证码，暂停等待人工输入
  if (await page.getByPlaceholder(/captcha/i).isVisible()) {
    console.log('请输入验证码后按 Enter...');
    await page.keyboard.press('Enter');
  }

  await page.getByRole('button', { name: /登录|sign in/i }).click();
  await page.waitForURL('**/dashboard');
}

export async function main() {
  const context = await chromium.launchPersistentContext('./.auth', {
    headless: true,
    storageState: fs.existsSync(STATE_PATH) ? STATE_PATH : undefined,
  });

  const page = context.pages()[0] ?? await context.newPage();
  await ensureLoggedIn(page);
  await context.storageState({ path: STATE_PATH });
  await context.close();
}

main();`,
      language: 'typescript',
      testCases: [
        {
          input: '已有 state.json',
          expected: '直接进入 dashboard，无需输入',
          code: '运行 main() 时检测 state.json 存在'
        },
        {
          input: '登录失效',
          expected: '重新填充表单并刷新 state.json',
          code: '删除 cookies 或故意失效后再次运行'
        },
      ],
      keyInsights: [
        'storageState 适合持久化登录态，注意敏感信息存储位置',
        '将登录逻辑封装为 ensureLoggedIn 便于多脚本复用',
        '验证码最好支持人工 fallback，避免卡死',
      ],
      relatedConcepts: ['storageState', '持久化登录', '错误恢复'],
    },
    {
      homeworkIndex: 2,
      title: 'Airbnb 搜索 Agent',
      explanation: `## 思路说明

1. 结合 Playwright 控制与 MCP/LLM 执行：自然语言解析需求，转换成结构化参数。
2. 使用过滤器确保价格/日期条件正确，再返回 JSON 结果。
3. 将 Agent 结果封装为工具，供聊天端调用。`,
      code: `// agent.ts（简化版）
import { chromium } from 'playwright';

export async function search(params: { city: string; checkIn: string; checkOut: string; budget: number }) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.airbnb.com/', { waitUntil: 'domcontentloaded' });

  await page.getByPlaceholder(/search destinations/i).fill(params.city);
  await page.getByPlaceholder(/search destinations/i).press('Enter');

  const cards = page.locator('[data-testid="property-card"]');
  await cards.first().waitFor();

  const results = await cards.evaluateAll((nodes, budget) =>
    nodes.slice(0, 10).map((n) => {
      const priceText = n.querySelector('[data-testid="price"]')?.textContent ?? '';
      const nightly = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
      return {
        title: n.querySelector('[data-testid="listing-card-title"]')?.textContent?.trim() ?? '',
        price: nightly,
        url: n.querySelector('a')?.href ?? '',
        fitsBudget: nightly <= budget,
      };
    }),
    params.budget
  );

  await browser.close();
  return results.filter((r) => r.fitsBudget);
}`,
      language: 'typescript',
      testCases: [
        {
          input: 'budget 200',
          expected: '返回 price <= 200 的房源列表',
          code: `await search({ city: 'New York', checkIn: '2025-01-10', checkOut: '2025-01-12', budget: 200 });`
        },
        {
          input: '空结果',
          expected: '返回 [] 而非抛错',
          code: '如果价格都大于预算，filter 后为空数组'
        },
      ],
      keyInsights: [
        'LLM 解析用户意图 -> 结构化参数 -> Playwright 执行',
        '提取后再次按预算过滤，保证结果可靠',
        '通过工具封装输出 JSON，便于上层聊天端消费',
      ],
      relatedConcepts: ['Agent', '参数解析', '结果过滤'],
    },
  ],
};
