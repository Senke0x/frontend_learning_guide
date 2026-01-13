import type { DayAnswers } from '../answersTypes';

export const day4Answers: DayAnswers = {
  day: 4,
  title: 'Playwright 测试与脚本实战',
  answers: [
    {
      homeworkIndex: 0,
      title: '使用 Codegen 录制测试',
      explanation: `## 思路说明

1. \`npx playwright codegen <url>\` 录制核心流程，保存成测试文件。
2. 清理录制结果：提取 selectors，增加断言与等待。
3. 将重复片段提到 helper，提高可读性。`,
      code: `# 录制
npx playwright codegen https://demo.playwright.dev/todomvc

# 保存为 tests/todo.spec.ts
import { test, expect } from '@playwright/test';

test('todo flow', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await page.getByPlaceholder('What needs to be done?').fill('Buy milk');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await expect(page.getByText('Buy milk')).toBeVisible();
});`,
      language: 'typescript',
      testCases: [
        {
          input: 'pnpm dlx playwright test',
          expected: '测试通过，截图/视频可选',
          code: `pnpm dlx playwright test`
        },
        {
          input: '头less=false 调试',
          expected: '可视化运行录制的步骤',
          code: `npx playwright test --headed --debug`
        },
      ],
      keyInsights: [
        '录制只是起点，需要手动清理与加断言',
        'getByRole/getByText 比硬编码 CSS 选择器更稳',
        '保留 data-testid 方便测试定位',
      ],
      relatedConcepts: ['codegen', 'Playwright Test', '断言'],
    },
    {
      homeworkIndex: 1,
      title: '实现 API Mock',
      explanation: `## 思路说明

1. 在测试中使用 \`page.route\` 拦截目标 API，返回固定 JSON。
2. 模拟成功/失败/加载三种状态，验证 UI 处理。`,
      code: `// tests/users.mock.spec.ts
import { test, expect } from '@playwright/test';

test('users list handles success & error', async ({ page }) => {
  await page.route('**/api/users', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [{ id: 1, name: 'Ada' }] }),
    })
  );

  await page.goto('http://localhost:3000');
  await expect(page.getByText('Ada')).toBeVisible();
});

test('users list handles error', async ({ page }) => {
  await page.route('**/api/users', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'boom' }),
    })
  );

  await page.goto('http://localhost:3000');
  await expect(page.getByText(/加载失败/i)).toBeVisible();
});`,
      language: 'typescript',
      testCases: [
        {
          input: '成功响应',
          expected: '列表展示模拟数据',
          code: '运行 users.mock.spec.ts 第一条用例'
        },
        {
          input: '500 响应',
          expected: 'UI 展示错误提示而非崩溃',
          code: '运行 users.mock.spec.ts 第二条用例'
        },
      ],
      keyInsights: [
        'page.route 可按 URL 通配符拦截',
        '成功与失败都要覆盖，验证 loading/error 状态',
        'HAR 录制也可用于复用真实响应',
      ],
      relatedConcepts: ['路由拦截', 'Mock', '错误处理'],
    },
    {
      homeworkIndex: 2,
      title: 'Airbnb 搜索自动化',
      explanation: `## 思路说明

1. 处理 cookie 弹窗后填充目的地/日期/人数。
2. 等待搜索结果列表渲染，再提取标题与价格。
3. 使用 \`locator.filter({ hasText })\` 和 \`nth\` 稳定提取。`,
      code: `// scripts/airbnb-search.ts
import { chromium } from 'playwright';
import fs from 'node:fs';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.airbnb.com/', { waitUntil: 'domcontentloaded' });

  // 关闭 cookie 弹窗（选择器可能需要根据地区调整）
  const accept = page.getByRole('button', { name: /accept all|同意/i });
  if (await accept.isVisible()) await accept.click();

  await page.getByPlaceholder(/search destinations/i).fill('New York');
  await page.getByPlaceholder(/search destinations/i).press('Enter');

  // 简化处理：等待结果卡片
  const cards = page.locator('[data-testid="property-card"]');
  await cards.first().waitFor();

  const results = await cards.evaluateAll((nodes) =>
    nodes.slice(0, 5).map((n) => ({
      title: n.querySelector('[data-testid="listing-card-title"]')?.textContent?.trim() ?? '',
      price: n.querySelector('[data-testid="price"]')?.textContent?.trim() ?? '',
    }))
  );

  fs.writeFileSync('airbnb.json', JSON.stringify(results, null, 2));
  await browser.close();
}

main();`,
      language: 'typescript',
      testCases: [
        {
          input: 'node scripts/airbnb-search.ts',
          expected: '生成 airbnb.json，包含前 5 条结果',
          code: `node scripts/airbnb-search.ts`
        },
        {
          input: '网络缓慢',
          expected: 'cards.first().waitFor() 避免超时',
          code: '确保有 waitFor，或增加超时时间'
        },
      ],
      keyInsights: [
        '处理同意弹窗是稳定性的关键',
        '尽量使用 data-testid 或语义化定位',
        '提取数据前等待列表稳定，避免空数组',
      ],
      relatedConcepts: ['定位器', '等待策略', '数据提取'],
    },
  ],
};
