export const day6Content = {
  day: 6,
  title: 'Stagehand 与 AI 驱动的自动化',
  subtitle: '使用大语言模型实现智能浏览器自动化',
  overview: `Stagehand 是由 Browserbase 开发的 AI 驱动的浏览器自动化框架。它建立在 Playwright 之上，通过集成大语言模型（LLM）实现了更智能、更灵活的网页自动化。

传统的浏览器自动化依赖精确的选择器，一旦网页结构变化就会失效。Stagehand 通过 AI 理解页面内容，可以用自然语言描述操作意图，由 AI 自动找到正确的元素并执行操作。

这种方式的优势在于：
- 更强的鲁棒性：不依赖特定的 DOM 结构
- 更简洁的代码：用自然语言描述意图
- 更好的可维护性：页面变化时无需修改代码
- 更智能的决策：AI 可以处理复杂的判断逻辑`,
  sections: [
    {
      title: 'Stagehand 简介与安装',
      background: `Stagehand 由 Browserbase 公司开发，于 2024 年开源。它的核心理念是将浏览器自动化从"精确匹配"转变为"语义理解"。

Stagehand 提供了三个核心 API：
- **act()**：执行操作（点击、输入等）
- **extract()**：从页面提取结构化数据
- **observe()**：观察页面状态并做出决策

这些 API 都接受自然语言描述，由 AI 模型（默认使用 Claude 或 GPT-4）理解意图并执行相应的操作。`,
      content: `**Stagehand vs 传统自动化**

| 特性 | 传统自动化 | Stagehand |
|------|-----------|-----------|
| 元素定位 | CSS/XPath 选择器 | 自然语言描述 |
| 页面变化 | 需要更新选择器 | 自动适应 |
| 复杂判断 | 手动编写逻辑 | AI 自动决策 |
| 代码可读性 | 依赖选择器知识 | 接近自然语言 |
| 学习曲线 | 需要了解 DOM | 更低门槛 |

**支持的 LLM 模型**

- Claude 3.5 Sonnet（推荐）
- GPT-4o
- GPT-4o-mini
- 其他 OpenAI 兼容模型`,
      codeExample: `// ==========================================
// Stagehand 安装与基础配置
// ==========================================

// ----- 安装 -----
/*
npm install @browserbasehq/stagehand
npm install playwright  # 如果还没安装

# 设置环境变量
export ANTHROPIC_API_KEY="your-api-key"
# 或
export OPENAI_API_KEY="your-api-key"
*/

// ----- 基础示例 -----
import { Stagehand } from '@browserbasehq/stagehand';

async function basicExample() {
  // 创建 Stagehand 实例
  const stagehand = new Stagehand({
    env: 'LOCAL',  // 'LOCAL' 或 'BROWSERBASE'
    modelName: 'claude-3-5-sonnet-20241022',  // 或 'gpt-4o'
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
    enableCaching: true,  // 启用缓存以减少 API 调用
    verbose: 1,  // 日志级别：0=静默, 1=信息, 2=调试
  });

  // 初始化
  await stagehand.init();

  // 获取 Playwright page 对象
  const page = stagehand.page;

  // 导航到页面
  await page.goto('https://www.google.com');

  // 使用 act() 执行操作
  await stagehand.act({
    action: '在搜索框中输入 "Playwright automation"'
  });

  await stagehand.act({
    action: '点击搜索按钮或按回车键'
  });

  // 使用 extract() 提取数据
  const results = await stagehand.extract({
    instruction: '提取搜索结果的标题和链接',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: '搜索结果标题' },
          url: { type: 'string', description: '链接地址' },
          description: { type: 'string', description: '结果描述' }
        }
      }
    }
  });

  console.log('搜索结果:', JSON.stringify(results, null, 2));

  // 关闭
  await stagehand.close();
}

basicExample().catch(console.error);

// ----- 配置选项详解 -----
const stagehand = new Stagehand({
  // 运行环境
  env: 'LOCAL',  // 'LOCAL': 本地浏览器, 'BROWSERBASE': 云端浏览器
  
  // AI 模型配置
  modelName: 'claude-3-5-sonnet-20241022',
  modelClientOptions: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    // 对于 OpenAI
    // baseURL: 'https://api.openai.com/v1',
  },
  
  // 浏览器配置（仅 LOCAL 模式）
  headless: false,  // 是否无头模式
  
  // 缓存配置
  enableCaching: true,  // 缓存 AI 响应以减少 API 调用
  
  // 日志配置
  verbose: 1,  // 0: 静默, 1: 信息, 2: 调试
  
  // DOM 处理配置
  domSettleTimeoutMs: 30000,  // DOM 稳定超时时间
});

// ----- 使用 Browserbase 云端浏览器 -----
/*
Browserbase 提供云端浏览器服务，适合：
- 大规模并行执行
- 绕过 IP 限制
- 无需管理浏览器基础设施

设置环境变量：
export BROWSERBASE_API_KEY="your-api-key"
export BROWSERBASE_PROJECT_ID="your-project-id"
*/

const cloudStagehand = new Stagehand({
  env: 'BROWSERBASE',
  modelName: 'claude-3-5-sonnet-20241022',
  modelClientOptions: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  browserbaseSessionCreateParams: {
    projectId: process.env.BROWSERBASE_PROJECT_ID,
  },
});`,
      keyPoints: [
        'Stagehand 是 AI 驱动的浏览器自动化框架',
        '基于 Playwright，添加了 AI 理解能力',
        '支持 Claude 和 GPT-4 等大语言模型',
        '三个核心 API：act()、extract()、observe()',
        '支持本地浏览器和 Browserbase 云端浏览器',
        '启用缓存可以减少 API 调用成本'
      ],
      references: [
        { text: 'Stagehand 官方文档', url: 'https://docs.stagehand.dev/' },
        { text: 'Stagehand GitHub', url: 'https://github.com/browserbase/stagehand' },
        { text: 'Browserbase', url: 'https://www.browserbase.com/' }
      ]
    },
    {
      title: 'act() - 执行操作',
      background: `act() 是 Stagehand 最常用的 API，用于执行页面操作。你只需要用自然语言描述想要执行的操作，AI 会自动理解意图并找到正确的元素执行。

act() 的工作流程：
1. 接收自然语言指令
2. AI 分析当前页面 DOM
3. 识别目标元素
4. 执行相应的操作（点击、输入、选择等）
5. 返回操作结果

这种方式的优势是代码更加简洁和可读，而且对页面结构变化有更好的适应性。`,
      content: `**act() 支持的操作类型**

| 操作 | 示例描述 |
|------|----------|
| 点击 | "点击登录按钮" |
| 输入 | "在用户名输入框中输入 admin" |
| 选择 | "从下拉菜单中选择中国" |
| 勾选 | "勾选同意条款复选框" |
| 滚动 | "向下滚动页面" |
| 悬停 | "将鼠标悬停在用户头像上" |
| 按键 | "按下回车键" |

**最佳实践**

- 描述要清晰具体
- 避免歧义的表述
- 可以提供上下文信息
- 复杂操作分步执行`,
      codeExample: `// ==========================================
// act() - 执行操作详解
// ==========================================

import { Stagehand } from '@browserbasehq/stagehand';

async function actExamples() {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
  });

  await stagehand.init();
  const page = stagehand.page;

  // ----- 基础点击操作 -----
  await page.goto('https://example.com/login');

  // 简单点击
  await stagehand.act({
    action: '点击登录按钮'
  });

  // 带上下文的点击
  await stagehand.act({
    action: '点击页面右上角的注册链接'
  });

  // 点击特定文本
  await stagehand.act({
    action: '点击包含"了解更多"文字的按钮'
  });

  // ----- 输入操作 -----
  await page.goto('https://example.com/search');

  // 基础输入
  await stagehand.act({
    action: '在搜索框中输入 "Playwright 教程"'
  });

  // 清空后输入
  await stagehand.act({
    action: '清空搜索框并输入新的关键词 "Stagehand AI"'
  });

  // 带标签的输入
  await stagehand.act({
    action: '在标签为"邮箱地址"的输入框中输入 user@example.com'
  });

  // ----- 表单操作 -----
  await page.goto('https://example.com/form');

  // 下拉选择
  await stagehand.act({
    action: '从国家下拉菜单中选择"中国"'
  });

  // 复选框
  await stagehand.act({
    action: '勾选"我同意服务条款"复选框'
  });

  await stagehand.act({
    action: '取消勾选"订阅新闻通讯"选项'
  });

  // 单选按钮
  await stagehand.act({
    action: '选择性别为"男"的单选按钮'
  });

  // 日期选择
  await stagehand.act({
    action: '在日期选择器中选择明天的日期'
  });

  // ----- 滚动操作 -----
  await page.goto('https://example.com/long-page');

  // 基础滚动
  await stagehand.act({
    action: '向下滚动页面'
  });

  // 滚动到特定元素
  await stagehand.act({
    action: '滚动到页面底部的"联系我们"部分'
  });

  // 滚动到顶部
  await stagehand.act({
    action: '滚动到页面顶部'
  });

  // ----- 键盘操作 -----
  
  // 按键
  await stagehand.act({
    action: '按下回车键提交表单'
  });

  // 组合键
  await stagehand.act({
    action: '按下 Ctrl+A 全选文本'
  });

  // ----- 悬停操作 -----
  
  await stagehand.act({
    action: '将鼠标悬停在导航菜单的"产品"选项上'
  });

  // ----- 复杂操作示例 -----

  // 登录流程
  await page.goto('https://example.com/login');
  
  await stagehand.act({
    action: '在用户名或邮箱输入框中输入 testuser@example.com'
  });
  
  await stagehand.act({
    action: '在密码输入框中输入 SecurePassword123'
  });
  
  await stagehand.act({
    action: '点击登录按钮'
  });

  // ----- 处理操作结果 -----
  
  const result = await stagehand.act({
    action: '点击提交按钮'
  });

  // act() 返回操作是否成功
  if (result.success) {
    console.log('操作成功');
  } else {
    console.log('操作失败:', result.message);
  }

  // ----- 带变量的操作 -----
  
  const username = 'admin';
  const password = 'password123';

  await stagehand.act({
    action: \`在用户名输入框中输入 \${username}\`
  });

  await stagehand.act({
    action: \`在密码输入框中输入 \${password}\`
  });

  // ----- 条件操作 -----
  
  // 如果存在弹窗则关闭
  await stagehand.act({
    action: '如果页面上有弹窗或模态框，点击关闭按钮'
  });

  // ----- 等待后操作 -----
  
  // 等待元素出现后点击
  await stagehand.act({
    action: '等待加载完成后，点击第一个搜索结果'
  });

  await stagehand.close();
}

// ----- Airbnb 搜索示例 -----
async function airbnbSearch() {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
    headless: false,
  });

  await stagehand.init();
  const page = stagehand.page;

  await page.goto('https://www.airbnb.com');

  // 关闭可能的弹窗
  await stagehand.act({
    action: '如果有弹窗或对话框，关闭它'
  });

  // 输入目的地
  await stagehand.act({
    action: '点击搜索栏中的目的地输入框'
  });

  await stagehand.act({
    action: '输入 "New York" 作为目的地'
  });

  await stagehand.act({
    action: '从搜索建议中选择 "New York, United States"'
  });

  // 选择日期
  await stagehand.act({
    action: '点击入住日期选择器'
  });

  await stagehand.act({
    action: '选择下周一作为入住日期'
  });

  await stagehand.act({
    action: '选择下周五作为退房日期'
  });

  // 选择人数
  await stagehand.act({
    action: '点击客人数量选择器'
  });

  await stagehand.act({
    action: '将成人数量设置为 2'
  });

  // 搜索
  await stagehand.act({
    action: '点击搜索按钮开始搜索'
  });

  // 等待结果加载
  await page.waitForLoadState('networkidle');

  console.log('搜索完成，当前 URL:', page.url());

  await stagehand.close();
}

actExamples().catch(console.error);`,
      keyPoints: [
        'act() 使用自然语言描述操作意图',
        'AI 自动识别目标元素并执行操作',
        '支持点击、输入、选择、滚动等各种操作',
        '描述要清晰具体，避免歧义',
        '复杂操作建议分步执行',
        '可以使用变量动态构建操作描述'
      ],
      references: [
        { text: 'Stagehand act() API', url: 'https://docs.stagehand.dev/reference/act' },
        { text: 'Stagehand 示例', url: 'https://github.com/browserbase/stagehand/tree/main/examples' }
      ]
    },
    {
      title: 'extract() - 数据提取',
      background: `extract() 是 Stagehand 的数据提取 API，可以从页面中提取结构化数据。你只需要描述想要提取的信息和数据结构（Schema），AI 会自动从页面中找到并提取相关数据。

extract() 的强大之处在于：
- 自动理解页面结构
- 支持复杂的嵌套数据
- 可以处理动态内容
- 返回类型安全的数据

这对于网页爬虫和数据采集任务特别有用。`,
      content: `**extract() 参数说明**

| 参数 | 类型 | 说明 |
|------|------|------|
| instruction | string | 提取指令，描述要提取什么数据 |
| schema | object | JSON Schema，定义数据结构 |
| modelName | string | 可选，覆盖默认模型 |

**Schema 支持的类型**

- string：字符串
- number：数字
- boolean：布尔值
- array：数组
- object：对象（可嵌套）`,
      codeExample: `// ==========================================
// extract() - 数据提取详解
// ==========================================

import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';  // 用于类型安全的 schema

async function extractExamples() {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
  });

  await stagehand.init();
  const page = stagehand.page;

  // ----- 基础提取 -----
  await page.goto('https://news.ycombinator.com');

  // 提取简单数据
  const pageTitle = await stagehand.extract({
    instruction: '提取页面标题',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: '页面标题' }
      }
    }
  });

  console.log('页面标题:', pageTitle);

  // ----- 提取列表数据 -----
  
  // 提取新闻列表
  const newsItems = await stagehand.extract({
    instruction: '提取首页的新闻标题和链接，最多10条',
    schema: {
      type: 'object',
      properties: {
        news: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', description: '新闻标题' },
              url: { type: 'string', description: '新闻链接' },
              points: { type: 'number', description: '点赞数' },
              comments: { type: 'number', description: '评论数' }
            }
          }
        }
      }
    }
  });

  console.log('新闻列表:', JSON.stringify(newsItems, null, 2));

  // ----- 提取复杂结构 -----
  await page.goto('https://example.com/product/123');

  const productInfo = await stagehand.extract({
    instruction: '提取产品的详细信息',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: '产品名称' },
        price: { type: 'number', description: '价格（数字）' },
        currency: { type: 'string', description: '货币单位' },
        rating: { type: 'number', description: '评分（1-5）' },
        reviewCount: { type: 'number', description: '评价数量' },
        inStock: { type: 'boolean', description: '是否有货' },
        description: { type: 'string', description: '产品描述' },
        specifications: {
          type: 'object',
          properties: {
            brand: { type: 'string' },
            model: { type: 'string' },
            weight: { type: 'string' },
            dimensions: { type: 'string' }
          }
        },
        images: {
          type: 'array',
          items: { type: 'string', description: '图片 URL' }
        }
      }
    }
  });

  console.log('产品信息:', JSON.stringify(productInfo, null, 2));

  // ----- 使用 Zod 定义类型安全的 Schema -----
  
  // 定义 Schema
  const ArticleSchema = z.object({
    title: z.string().describe('文章标题'),
    author: z.string().describe('作者名称'),
    publishDate: z.string().describe('发布日期'),
    content: z.string().describe('文章内容摘要'),
    tags: z.array(z.string()).describe('文章标签'),
  });

  type Article = z.infer<typeof ArticleSchema>;

  await page.goto('https://example.com/blog/article');

  const article: Article = await stagehand.extract({
    instruction: '提取文章的详细信息',
    schema: ArticleSchema,
  });

  // TypeScript 类型安全
  console.log('文章标题:', article.title);
  console.log('作者:', article.author);

  // ----- 条件提取 -----
  await page.goto('https://example.com/search?q=laptop');

  const searchResults = await stagehand.extract({
    instruction: '提取价格低于 1000 美元的笔记本电脑',
    schema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              price: { type: 'number' },
              brand: { type: 'string' },
              rating: { type: 'number' }
            }
          }
        },
        totalCount: { type: 'number', description: '符合条件的产品总数' }
      }
    }
  });

  // ----- 提取表格数据 -----
  await page.goto('https://example.com/data-table');

  const tableData = await stagehand.extract({
    instruction: '提取表格中的所有数据',
    schema: {
      type: 'object',
      properties: {
        headers: {
          type: 'array',
          items: { type: 'string' },
          description: '表头列名'
        },
        rows: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: { type: 'string' }
          },
          description: '数据行'
        }
      }
    }
  });

  // ----- 提取联系信息 -----
  await page.goto('https://example.com/contact');

  const contactInfo = await stagehand.extract({
    instruction: '提取页面上的所有联系方式',
    schema: {
      type: 'object',
      properties: {
        emails: {
          type: 'array',
          items: { type: 'string' },
          description: '邮箱地址列表'
        },
        phones: {
          type: 'array',
          items: { type: 'string' },
          description: '电话号码列表'
        },
        address: { type: 'string', description: '地址' },
        socialMedia: {
          type: 'object',
          properties: {
            twitter: { type: 'string' },
            linkedin: { type: 'string' },
            facebook: { type: 'string' }
          }
        }
      }
    }
  });

  await stagehand.close();
}

// ----- Airbnb 房源提取示例 -----
async function extractAirbnbListings() {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
  });

  await stagehand.init();
  const page = stagehand.page;

  // 假设已经完成搜索，在结果页面
  await page.goto('https://www.airbnb.com/s/New-York/homes');
  await page.waitForLoadState('networkidle');

  // 提取房源列表
  const listings = await stagehand.extract({
    instruction: '提取页面上显示的房源信息，包括名称、价格、评分等',
    schema: {
      type: 'object',
      properties: {
        listings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: '房源名称' },
              type: { type: 'string', description: '房源类型（整套公寓、独立房间等）' },
              pricePerNight: { type: 'number', description: '每晚价格（数字）' },
              currency: { type: 'string', description: '货币单位' },
              rating: { type: 'number', description: '评分（1-5）' },
              reviewCount: { type: 'number', description: '评价数量' },
              amenities: {
                type: 'array',
                items: { type: 'string' },
                description: '主要设施（如 WiFi、厨房等）'
              },
              imageUrl: { type: 'string', description: '主图 URL' },
              isSuperhost: { type: 'boolean', description: '是否是超赞房东' }
            }
          }
        },
        totalResults: { type: 'string', description: '搜索结果总数' }
      }
    }
  });

  console.log(\`找到 \${listings.listings?.length || 0} 个房源\`);
  
  for (const listing of listings.listings || []) {
    console.log(\`
房源: \${listing.name}
类型: \${listing.type}
价格: \${listing.currency} \${listing.pricePerNight}/晚
评分: \${listing.rating} (\${listing.reviewCount} 条评价)
超赞房东: \${listing.isSuperhost ? '是' : '否'}
---\`);
  }

  await stagehand.close();
  return listings;
}

extractExamples().catch(console.error);`,
      keyPoints: [
        'extract() 从页面提取结构化数据',
        '使用 JSON Schema 定义数据结构',
        '支持复杂的嵌套数据和数组',
        '可以使用 Zod 获得类型安全',
        'AI 自动理解页面结构并提取数据',
        '适合网页爬虫和数据采集任务'
      ],
      references: [
        { text: 'Stagehand extract() API', url: 'https://docs.stagehand.dev/reference/extract' },
        { text: 'JSON Schema 规范', url: 'https://json-schema.org/' },
        { text: 'Zod 文档', url: 'https://zod.dev/' }
      ]
    },
    {
      title: 'observe() - 页面观察',
      background: `observe() 是 Stagehand 的页面观察 API，用于分析页面状态并获取可执行的操作建议。它可以帮助 AI Agent 理解当前页面的状态，并决定下一步应该做什么。

observe() 的主要用途：
- 分析页面上可执行的操作
- 获取元素的详细信息
- 帮助 AI 做出决策
- 调试和理解页面结构

这在构建自主 Agent 时特别有用，Agent 可以先观察页面，然后根据观察结果决定下一步操作。`,
      content: `**observe() 返回的信息**

| 字段 | 说明 |
|------|------|
| actions | 可执行的操作列表 |
| elements | 页面上的交互元素 |
| state | 页面当前状态 |

**使用场景**

- 不确定页面上有哪些可操作元素
- 需要 AI 自主决定下一步操作
- 调试自动化脚本
- 构建自主 Agent`,
      codeExample: `// ==========================================
// observe() - 页面观察详解
// ==========================================

import { Stagehand } from '@browserbasehq/stagehand';

async function observeExamples() {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
    verbose: 2,  // 开启详细日志
  });

  await stagehand.init();
  const page = stagehand.page;

  // ----- 基础观察 -----
  await page.goto('https://www.google.com');

  // 观察页面上可执行的操作
  const observations = await stagehand.observe({
    instruction: '观察页面上可以执行的操作'
  });

  console.log('可执行的操作:');
  for (const action of observations) {
    console.log(\`- \${action.description}\`);
    console.log(\`  选择器: \${action.selector}\`);
  }

  // ----- 带目标的观察 -----
  await page.goto('https://example.com/login');

  // 观察与登录相关的元素
  const loginObservations = await stagehand.observe({
    instruction: '找出所有与登录相关的输入框和按钮'
  });

  console.log('登录相关元素:');
  for (const obs of loginObservations) {
    console.log(\`- \${obs.description}\`);
  }

  // ----- 在 Agent 循环中使用 -----
  await page.goto('https://example.com/dashboard');

  // Agent 决策循环
  async function agentLoop(goal: string, maxSteps: number = 10) {
    for (let step = 0; step < maxSteps; step++) {
      console.log(\`\\n=== 步骤 \${step + 1} ===\`);

      // 1. 观察当前页面
      const observations = await stagehand.observe({
        instruction: \`我的目标是: \${goal}。观察当前页面，告诉我可以执行哪些操作来达成目标。\`
      });

      if (observations.length === 0) {
        console.log('没有找到可执行的操作');
        break;
      }

      console.log('可执行的操作:');
      observations.forEach((obs, i) => {
        console.log(\`  \${i + 1}. \${obs.description}\`);
      });

      // 2. 选择最相关的操作（这里简单选择第一个）
      const selectedAction = observations[0];
      console.log(\`\\n执行: \${selectedAction.description}\`);

      // 3. 执行操作
      await stagehand.act({
        action: selectedAction.description
      });

      // 4. 检查是否达成目标
      const status = await stagehand.extract({
        instruction: \`检查是否已经完成目标: \${goal}\`,
        schema: {
          type: 'object',
          properties: {
            completed: { type: 'boolean', description: '目标是否已完成' },
            reason: { type: 'string', description: '判断原因' }
          }
        }
      });

      if (status.completed) {
        console.log(\`\\n目标已完成: \${status.reason}\`);
        break;
      }

      // 等待页面稳定
      await page.waitForTimeout(1000);
    }
  }

  // 运行 Agent
  await agentLoop('登录到系统并查看个人资料');

  await stagehand.close();
}

// ----- 构建完整的 AI Agent -----
async function buildAIAgent() {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-3-5-sonnet-20241022',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
  });

  await stagehand.init();
  const page = stagehand.page;

  class BrowserAgent {
    private stagehand: Stagehand;
    private history: string[] = [];

    constructor(stagehand: Stagehand) {
      this.stagehand = stagehand;
    }

    async executeTask(task: string) {
      console.log(\`\\n开始执行任务: \${task}\`);
      this.history = [];

      const maxSteps = 15;
      
      for (let step = 0; step < maxSteps; step++) {
        console.log(\`\\n--- 步骤 \${step + 1} ---\`);

        // 获取当前页面状态
        const currentUrl = this.stagehand.page.url();
        const pageTitle = await this.stagehand.page.title();
        
        console.log(\`当前页面: \${pageTitle} (\${currentUrl})\`);

        // 观察可用操作
        const observations = await this.stagehand.observe({
          instruction: \`
任务: \${task}
已执行的操作: \${this.history.join(' -> ') || '无'}
当前页面: \${pageTitle}

请观察当前页面，找出可以帮助完成任务的操作。
          \`
        });

        if (observations.length === 0) {
          console.log('没有找到可执行的操作，任务可能已完成或遇到障碍');
          break;
        }

        // 显示可用操作
        console.log('可用操作:');
        observations.slice(0, 5).forEach((obs, i) => {
          console.log(\`  \${i + 1}. \${obs.description}\`);
        });

        // 选择并执行操作
        const action = observations[0];
        console.log(\`\\n执行: \${action.description}\`);

        try {
          await this.stagehand.act({
            action: action.description
          });
          this.history.push(action.description);
        } catch (error) {
          console.error(\`操作失败: \${error}\`);
          continue;
        }

        // 等待页面更新
        await this.stagehand.page.waitForTimeout(2000);

        // 检查任务是否完成
        const status = await this.stagehand.extract({
          instruction: \`
任务: \${task}
已执行的操作: \${this.history.join(' -> ')}

判断任务是否已经完成。
          \`,
          schema: {
            type: 'object',
            properties: {
              isComplete: { type: 'boolean' },
              confidence: { type: 'number', description: '置信度 0-1' },
              reason: { type: 'string' },
              nextStep: { type: 'string', description: '如果未完成，建议的下一步' }
            }
          }
        });

        console.log(\`任务状态: \${status.isComplete ? '已完成' : '进行中'} (置信度: \${status.confidence})\`);
        console.log(\`原因: \${status.reason}\`);

        if (status.isComplete && status.confidence > 0.8) {
          console.log('\\n任务成功完成！');
          return { success: true, history: this.history };
        }
      }

      console.log('\\n达到最大步骤数，任务未完成');
      return { success: false, history: this.history };
    }
  }

  // 使用 Agent
  const agent = new BrowserAgent(stagehand);

  // 执行任务
  await stagehand.page.goto('https://www.airbnb.com');
  
  const result = await agent.executeTask(
    '搜索纽约下周的房源，找到评分最高的前3个房源'
  );

  console.log('\\n执行历史:', result.history);

  await stagehand.close();
}

observeExamples().catch(console.error);`,
      keyPoints: [
        'observe() 分析页面状态并返回可执行操作',
        '适合构建自主决策的 AI Agent',
        '返回操作描述和元素选择器',
        '可以结合 act() 和 extract() 构建完整的 Agent 循环',
        '帮助 AI 理解页面并做出决策',
        '适用于复杂的、需要动态决策的自动化任务'
      ],
      references: [
        { text: 'Stagehand observe() API', url: 'https://docs.stagehand.dev/reference/observe' },
        { text: 'AI Agent 设计模式', url: 'https://www.anthropic.com/research/building-effective-agents' }
      ]
    }
  ],
  homework: [
    {
      title: 'Stagehand 基础练习',
      description: '使用 Stagehand 实现一个自动化脚本，完成以下任务：打开 Google，搜索 "Playwright vs Selenium"，提取前 5 个搜索结果的标题和链接。',
      hints: ['使用 act() 执行搜索操作', '使用 extract() 提取结果', '定义合适的 Schema']
    },
    {
      title: 'Airbnb 搜索 Agent',
      description: '使用 Stagehand 构建一个 Airbnb 搜索 Agent，可以根据用户输入的目的地、日期和预算，自动搜索并返回符合条件的房源列表。',
      hints: ['处理日期选择器', '实现价格过滤', '提取完整的房源信息']
    },
    {
      title: '自主 Agent 开发',
      description: '基于 observe() API，构建一个可以自主完成任务的 Agent。Agent 应该能够：观察页面状态、决定下一步操作、执行操作、判断任务是否完成。',
      hints: ['实现 Agent 循环', '添加错误处理', '记录执行历史']
    }
  ]
};
