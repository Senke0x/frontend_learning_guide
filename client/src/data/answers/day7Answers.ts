import type { DayAnswers } from '../answersTypes';

export const day7Answers: DayAnswers = {
  day: 7,
  title: '综合项目与云端部署',
  answers: [
    {
      homeworkIndex: 0,
      title: '部署到云端',
      explanation: `## 思路说明

1. 构建前后端：\`pnpm build\` 生成 Vite 静态与 server bundle。
2. Vercel 配置：设置环境变量（BROWSERBASE_API_KEY 等），添加 \`vercel.json\` 以使用 Node 入口。
3. 通过 curl 验证生产接口与健康检查。`,
      code: `// vercel.json 示例
{
  "version": 2,
  "builds": [
    { "src": "server/index.ts", "use": "@vercel/node" },
    { "src": "client/vite.config.ts", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/dist/index.js" },
    { "src": "/(.*)", "dest": "/dist/public/$1" }
  ]
}

# 部署命令
pnpm build
vercel --prod
`,
      language: 'typescript',
      testCases: [
        {
          input: 'curl https://your-app.vercel.app/api/health',
          expected: '返回 200 与 OK',
          code: `curl -i https://your-app.vercel.app/api/health`
        },
        {
          input: '静态资源',
          expected: 'index.html 可正常加载',
          code: `curl -I https://your-app.vercel.app/`
        },
      ],
      keyInsights: [
        '部署前本地先 pnpm build，确保无类型/打包错误',
        'Vercel 环境变量需在 Dashboard 配置',
        '健康检查接口便于监控上线状态',
      ],
      relatedConcepts: ['Vercel', '环境变量', '健康检查'],
    },
    {
      homeworkIndex: 1,
      title: '扩展 Agent 功能',
      explanation: `## 思路说明

1. 抽象 BaseAgent：封装上下文、日志、错误恢复；不同垂直场景继承扩展。
2. 通过策略模式把“站点适配”拆成独立类，便于扩展新的电商/新闻站点。
3. 输出统一 schema，方便前端消费和存储。`,
      code: `// base-agent.ts
export interface AgentResult<T> {
  data: T;
  steps: string[];
}

export abstract class BaseAgent<TInput, TOutput> {
  protected steps: string[] = [];
  constructor(protected readonly input: TInput) {}

  protected log(step: string) {
    this.steps.push(step);
  }

  abstract run(): Promise<AgentResult<TOutput>>;
}

// price-agent.ts
interface PriceInput { keyword: string; budget: number; }
interface PriceItem { title: string; price: number; url: string; }

export class PriceAgent extends BaseAgent<PriceInput, PriceItem[]> {
  async run(): Promise<AgentResult<PriceItem[]>> {
    this.log('search keyword');
    // 调用 Playwright/Stagehand 执行
    const results: PriceItem[] = []; // 省略真实实现
    return { data: results, steps: this.steps };
  }
}
`,
      language: 'typescript',
      testCases: [
        {
          input: 'PriceAgent.run()',
          expected: '返回 { data, steps }，steps 记录执行路径',
          code: `const agent = new PriceAgent({ keyword: 'laptop', budget: 800 });
await agent.run();`
        },
        {
          input: '新增站点',
          expected: '仅添加新的适配类，无需改动基类',
          code: '// 新建 AmazonAdapter，实现相同接口后注入 agent'
        },
      ],
      keyInsights: [
        'BaseAgent 负责通用流程与日志，子类聚焦站点逻辑',
        '统一输出 schema 便于前端/存储复用',
        '扩展新站点时遵循开闭原则，减少回归风险',
      ],
      relatedConcepts: ['基类/继承', '策略模式', '可扩展架构'],
    },
    {
      homeworkIndex: 2,
      title: '构建完整的 Demo',
      explanation: `## 思路说明

1. 前端：任务创建表单 + 任务列表 + 结果详情（使用 shadcn/ui）。
2. 后端：\`POST /api/tasks\` 创建任务并入队，\`GET /api/tasks/:id\` 查询状态。
3. Worker：消费队列，调用 Agent 执行并写回结果。`,
      code: `// server/task-routes.ts (示意)
import express from 'express';
import { enqueue, getTask } from './task-queue';

const router = express.Router();

router.post('/tasks', async (req, res) => {
  const id = await enqueue(req.body);
  res.json({ id, status: 'queued' });
});

router.get('/tasks/:id', async (req, res) => {
  const task = await getTask(req.params.id);
  if (!task) return res.status(404).end();
  res.json(task);
});

export default router;

// worker.ts (伪代码)
import { PriceAgent } from './price-agent';
import { consume } from './task-queue';

consume(async (job) => {
  const agent = new PriceAgent(job.payload);
  const result = await agent.run();
  await job.done({ status: 'done', result });
});`,
      language: 'typescript',
      testCases: [
        {
          input: 'POST /api/tasks',
          expected: '返回任务 id，状态 queued',
          code: `curl -X POST http://localhost:3000/api/tasks -d '{"keyword":"phone","budget":500}'`
        },
        {
          input: 'GET /api/tasks/:id',
          expected: '返回 status/result，或 404',
          code: `curl http://localhost:3000/api/tasks/<id>`
        },
      ],
      keyInsights: [
        '前端与后端通过任务队列解耦，避免长时间占用请求',
        'Worker 与 API 分离，易于水平扩展',
        '日志与状态字段（queued/processing/done/failed）便于观测',
      ],
      relatedConcepts: ['任务队列', 'API 设计', '前后端解耦'],
    },
  ],
};
