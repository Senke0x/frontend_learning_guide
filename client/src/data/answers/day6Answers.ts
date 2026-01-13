import type { DayAnswers } from '../answersTypes';

export const day6Answers: DayAnswers = {
  day: 6,
  title: 'Stagehand 与 AI 驱动自动化',
  answers: [
    {
      homeworkIndex: 0,
      title: 'Stagehand 基础练习',
      explanation: `## 思路说明

1. 使用 \`Stagehand\` 创建本地实例，model 选择 Claude 3.5 或 GPT-4o。
2. act() 输入自然语言描述操作；extract() 定义 schema 提取前 5 个结果。`,
      code: `// stagehand-search.ts
import { Stagehand } from '@browserbasehq/stagehand';

async function run() {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: { apiKey: process.env.ANTHROPIC_API_KEY },
  });
  await stagehand.init();
  const page = stagehand.page;

  await page.goto('https://www.google.com');
  await stagehand.act({ action: '在搜索框输入 Playwright vs Selenium 然后回车' });

  const results = await stagehand.extract({
    description: '提取前 5 个搜索结果标题和链接',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: { type: 'string' },
        },
        required: ['title', 'url'],
      },
    },
  });

  console.log(results);
  await stagehand.close();
}

run();`,
      language: 'typescript',
      testCases: [
        {
          input: '执行脚本',
          expected: '输出包含 5 条 { title, url }',
          code: `ANTHROPIC_API_KEY=xxx node stagehand-search.ts`
        },
        {
          input: '缺少 API key',
          expected: '初始化报错，需设置 ANTHROPIC_API_KEY',
          code: 'unset ANTHROPIC_API_KEY && node stagehand-search.ts'
        },
      ],
      keyInsights: [
        'act/extract 提供语义化操作与结构化提取，减少 selector 维护',
        'schema 明确定义输出格式，避免 LLM 漂移',
        '初始化要处理好 API Key 与超时',
      ],
      relatedConcepts: ['act', 'extract', 'schema'],
    },
    {
      homeworkIndex: 1,
      title: 'Airbnb 搜索 Agent',
      explanation: `## 思路说明

1. 用 act 填写目的地/日期/预算，使用 extract 拉取卡片数据。
2. 提取后在本地按预算再次过滤，保证准确性。`,
      code: `// stagehand-airbnb.ts
import { Stagehand } from '@browserbasehq/stagehand';

export async function searchAirbnb(city: string, budget: number) {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: { apiKey: process.env.ANTHROPIC_API_KEY },
  });
  await stagehand.init();
  const page = stagehand.page;

  await page.goto('https://www.airbnb.com/', { waitUntil: 'domcontentloaded' });
  await stagehand.act({ action: \`在搜索框输入 \${city} 并提交\` });

  const raw = await stagehand.extract({
    description: '提取前 8 条房源标题/价格/链接',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          price: { type: 'string' },
          url: { type: 'string' },
        },
        required: ['title', 'price', 'url'],
      },
    },
  });

  const parsed = raw.map((item) => ({
    ...item,
    nightly: parseInt(item.price.replace(/[^0-9]/g, ''), 10),
  }));

  await stagehand.close();
  return parsed.filter((r) => r.nightly <= budget);
}
`,
      language: 'typescript',
      testCases: [
        {
          input: 'budget 150',
          expected: '返回 nightly <= 150 的列表',
          code: `await searchAirbnb('Tokyo', 150);`
        },
        {
          input: 'LLM 提取错误',
          expected: '解析数字失败时 nightly 变 NaN，需要过滤',
          code: '过滤掉 !Number.isFinite(nightly)'
        },
      ],
      keyInsights: [
        '提取后本地再校验/过滤，保证数字准确',
        'act 可以用自然语言描述，而非硬编码选择器',
        'LLM 可能提取为空需加兜底逻辑',
      ],
      relatedConcepts: ['提取校验', '价格过滤', '自然语言操作'],
    },
    {
      homeworkIndex: 2,
      title: '自主 Agent 开发',
      explanation: `## 思路说明

1. 基于 observe 决策：循环“观察 -> 生成下一步动作 -> 执行动作 -> 终止条件”。
2. 记录历史步骤，遇到错误回退或重试。`,
      code: `// mini-agent.ts
import { Stagehand } from '@browserbasehq/stagehand';

interface Step {
  observation: string;
  action: string;
  done: boolean;
}

async function runTask(goal: string) {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: { apiKey: process.env.ANTHROPIC_API_KEY },
  });
  await stagehand.init();

  const history: Step[] = [];
  for (let i = 0; i < 6; i++) {
    const observation = await stagehand.observe({ prompt: \`目标: \${goal}. 当前页面有什么可操作的元素？\` });
    const action = await stagehand.plan({ prompt: \`根据观察，下一步如何更接近目标？\` });

    history.push({ observation, action, done: /完成|done/i.test(action) });
    if (history.at(-1)?.done) break;

    await stagehand.act({ action });
  }

  await stagehand.close();
  return history;
}
`,
      language: 'typescript',
      testCases: [
        {
          input: 'goal: 打开 example.com 并读取标题',
          expected: '历史中包含 observe->act 步骤，最后 done',
          code: `await runTask('打开 example.com 并读取标题');`
        },
        {
          input: '循环超过上限',
          expected: 'i < 6 防止无限循环',
          code: '调整上限或检测重复 observation'
        },
      ],
      keyInsights: [
        'Agent 循环需有步数上限避免跑飞',
        '记录 observation/action 便于调试与回放',
        '遇到不可预测 UI 时可插入人工介入或回退',
      ],
      relatedConcepts: ['observe', 'agent loop', '错误恢复'],
    },
  ],
};
