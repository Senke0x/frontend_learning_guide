export const day5Content = {
  day: 5,
  title: '高级浏览器自动化',
  subtitle: 'MCP 协议与复杂场景处理',
  overview: `在掌握了 Playwright 基础之后，本章将深入探讨更高级的自动化技术。我们将学习 Model Context Protocol (MCP) 这一新兴的 AI 与工具集成协议，以及如何处理复杂的自动化场景。

MCP 是由 Anthropic 提出的开放协议，旨在标准化 AI 模型与外部工具的交互方式。通过 MCP，AI 可以安全地控制浏览器、访问文件系统、调用 API 等。这为构建 AI Agent 提供了基础设施。

本章还将介绍如何处理验证码、登录状态、动态内容等复杂场景，这些是实际项目中经常遇到的挑战。`,
  sections: [
    {
      title: 'Model Context Protocol (MCP) 简介',
      background: `Model Context Protocol (MCP) 是 Anthropic 在 2024 年底发布的开放协议，旨在解决 AI 模型与外部工具集成的标准化问题。在 MCP 之前，每个 AI 应用都需要自己实现工具调用的逻辑，导致大量重复工作和不一致的实现。

MCP 的核心思想是将"工具提供者"和"工具使用者"分离：
- **MCP Server**：提供工具能力（如浏览器控制、文件操作）
- **MCP Client**：使用工具能力（如 AI 助手、自动化脚本）

这种架构使得工具可以被复用，AI 应用可以轻松接入各种能力。目前已有多个 MCP Server 实现，包括浏览器自动化、数据库访问、文件系统操作等。`,
      content: `**MCP 架构概览**

| 组件 | 职责 | 示例 |
|------|------|------|
| MCP Host | 运行 AI 模型的应用 | Claude Desktop, VS Code |
| MCP Client | 与 Server 通信的客户端 | 内置于 Host 中 |
| MCP Server | 提供工具能力的服务 | Playwright Server, Filesystem Server |

**MCP 通信协议**

MCP 使用 JSON-RPC 2.0 协议进行通信，支持三种传输方式：
- **stdio**：通过标准输入输出（本地进程）
- **HTTP + SSE**：通过 HTTP 请求和 Server-Sent Events
- **WebSocket**：双向实时通信`,
      codeExample: `// ==========================================
// Model Context Protocol (MCP) 详解
// ==========================================

// ----- MCP 协议基础 -----
/*
MCP 消息格式（JSON-RPC 2.0）：

请求：
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "browser_navigate",
    "arguments": {
      "url": "https://example.com"
    }
  }
}

响应：
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Successfully navigated to https://example.com"
      }
    ]
  }
}
*/

// ----- 安装 MCP 相关包 -----
/*
npm install @anthropic-ai/sdk
npm install @modelcontextprotocol/sdk
*/

// ----- MCP Server 示例（简化版）-----
// mcp-server.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { chromium, Browser, Page } from 'playwright';

class BrowserMCPServer {
  private server: Server;
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'browser-automation',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // 列出可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'browser_navigate',
            description: '导航到指定 URL',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: '要访问的 URL'
                }
              },
              required: ['url']
            }
          },
          {
            name: 'browser_click',
            description: '点击页面元素',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS 选择器或文本'
                }
              },
              required: ['selector']
            }
          },
          {
            name: 'browser_fill',
            description: '填写表单输入框',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: '输入框选择器'
                },
                value: {
                  type: 'string',
                  description: '要填写的值'
                }
              },
              required: ['selector', 'value']
            }
          },
          {
            name: 'browser_screenshot',
            description: '截取页面截图',
            inputSchema: {
              type: 'object',
              properties: {
                fullPage: {
                  type: 'boolean',
                  description: '是否截取整个页面'
                }
              }
            }
          },
          {
            name: 'browser_get_content',
            description: '获取页面内容',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: '元素选择器（可选，默认获取整个页面）'
                }
              }
            }
          }
        ]
      };
    });

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'browser_navigate':
            return await this.navigate(args.url);
          case 'browser_click':
            return await this.click(args.selector);
          case 'browser_fill':
            return await this.fill(args.selector, args.value);
          case 'browser_screenshot':
            return await this.screenshot(args.fullPage);
          case 'browser_get_content':
            return await this.getContent(args.selector);
          default:
            throw new Error(\`Unknown tool: \${name}\`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: \`Error: \${error.message}\`
            }
          ],
          isError: true
        };
      }
    });
  }

  private async ensureBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: false });
      this.page = await this.browser.newPage();
    }
    return this.page!;
  }

  private async navigate(url: string) {
    const page = await this.ensureBrowser();
    await page.goto(url);
    return {
      content: [
        {
          type: 'text',
          text: \`Successfully navigated to \${url}. Page title: \${await page.title()}\`
        }
      ]
    };
  }

  private async click(selector: string) {
    const page = await this.ensureBrowser();
    
    // 尝试多种定位方式
    try {
      await page.click(selector, { timeout: 5000 });
    } catch {
      // 如果 CSS 选择器失败，尝试文本匹配
      await page.getByText(selector).click();
    }
    
    return {
      content: [
        {
          type: 'text',
          text: \`Clicked element: \${selector}\`
        }
      ]
    };
  }

  private async fill(selector: string, value: string) {
    const page = await this.ensureBrowser();
    await page.fill(selector, value);
    return {
      content: [
        {
          type: 'text',
          text: \`Filled "\${value}" into \${selector}\`
        }
      ]
    };
  }

  private async screenshot(fullPage: boolean = false) {
    const page = await this.ensureBrowser();
    const buffer = await page.screenshot({ fullPage });
    const base64 = buffer.toString('base64');
    
    return {
      content: [
        {
          type: 'image',
          data: base64,
          mimeType: 'image/png'
        }
      ]
    };
  }

  private async getContent(selector?: string) {
    const page = await this.ensureBrowser();
    
    let content: string;
    if (selector) {
      content = await page.locator(selector).textContent() || '';
    } else {
      content = await page.content();
    }
    
    return {
      content: [
        {
          type: 'text',
          text: content.substring(0, 10000) // 限制长度
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Browser MCP Server running...');
  }
}

// 启动服务器
const server = new BrowserMCPServer();
server.run().catch(console.error);

// ----- MCP Client 示例 -----
// mcp-client.ts

import Anthropic from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

async function main() {
  // 启动 MCP Server 进程
  const serverProcess = spawn('node', ['mcp-server.js'], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  // 创建 MCP Client
  const transport = new StdioClientTransport({
    reader: serverProcess.stdout!,
    writer: serverProcess.stdin!,
  });

  const mcpClient = new Client(
    { name: 'mcp-client', version: '1.0.0' },
    { capabilities: {} }
  );

  await mcpClient.connect(transport);

  // 获取可用工具
  const { tools } = await mcpClient.listTools();
  console.log('Available tools:', tools.map(t => t.name));

  // 创建 Anthropic 客户端
  const anthropic = new Anthropic();

  // 与 Claude 对话，让它使用工具
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema
    })),
    messages: [
      {
        role: 'user',
        content: '请打开 Airbnb 网站，搜索纽约的房源'
      }
    ]
  });

  // 处理工具调用
  for (const block of response.content) {
    if (block.type === 'tool_use') {
      console.log(\`Calling tool: \${block.name}\`);
      console.log(\`Arguments: \${JSON.stringify(block.input)}\`);
      
      const result = await mcpClient.callTool({
        name: block.name,
        arguments: block.input
      });
      
      console.log(\`Result: \${JSON.stringify(result)}\`);
    }
  }

  // 清理
  serverProcess.kill();
}

main().catch(console.error);`,
      keyPoints: [
        'MCP 是 AI 与工具集成的标准化协议',
        'MCP Server 提供工具能力，MCP Client 使用工具',
        '使用 JSON-RPC 2.0 协议通信',
        '支持 stdio、HTTP+SSE、WebSocket 三种传输方式',
        'Claude Desktop 原生支持 MCP',
        '可以构建自定义 MCP Server 扩展 AI 能力'
      ],
      references: [
        { text: 'MCP 官方文档', url: 'https://modelcontextprotocol.io/' },
        { text: 'MCP GitHub', url: 'https://github.com/modelcontextprotocol' },
        { text: 'Anthropic MCP 介绍', url: 'https://www.anthropic.com/news/model-context-protocol' }
      ]
    },
    {
      title: '处理复杂自动化场景',
      background: `在实际的浏览器自动化项目中，经常会遇到各种复杂场景：
- 验证码和反爬虫机制
- 登录状态管理
- 动态加载的内容
- 弹窗和对话框
- 文件上传下载
- 多标签页和窗口

这些场景需要特殊的处理技巧。本节将介绍常见的解决方案和最佳实践。`,
      content: `**常见复杂场景及解决方案**

| 场景 | 挑战 | 解决方案 |
|------|------|----------|
| 验证码 | 机器难以识别 | 第三方服务、人工介入、Cookie 复用 |
| 动态内容 | 内容异步加载 | 等待网络请求、等待元素出现 |
| 无限滚动 | 内容按需加载 | 模拟滚动、监听网络请求 |
| 登录状态 | Session 过期 | 保存 Cookie、定期刷新 |
| 反爬虫 | 行为检测 | 模拟真实用户、使用代理 |`,
      codeExample: `// ==========================================
// 处理复杂自动化场景
// ==========================================

import { test, expect, Page, BrowserContext } from '@playwright/test';

// ----- 处理动态加载内容 -----

async function waitForDynamicContent(page: Page) {
  // 方法1：等待特定元素出现
  await page.waitForSelector('.content-loaded');
  
  // 方法2：等待网络请求完成
  await page.waitForResponse(response => 
    response.url().includes('/api/data') && response.status() === 200
  );
  
  // 方法3：等待网络空闲
  await page.waitForLoadState('networkidle');
  
  // 方法4：等待自定义条件
  await page.waitForFunction(() => {
    const items = document.querySelectorAll('.list-item');
    return items.length > 0;
  });
}

// ----- 处理无限滚动 -----

async function handleInfiniteScroll(page: Page, maxItems: number = 100) {
  const items: string[] = [];
  
  while (items.length < maxItems) {
    // 获取当前可见的项目
    const currentItems = await page.locator('.item').allTextContents();
    
    // 添加新项目
    for (const item of currentItems) {
      if (!items.includes(item)) {
        items.push(item);
      }
    }
    
    // 检查是否已经到底
    const hasMore = await page.locator('.load-more').isVisible();
    if (!hasMore) break;
    
    // 滚动到底部
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // 等待新内容加载
    await page.waitForTimeout(1000);
    
    // 或者等待网络请求
    try {
      await page.waitForResponse(
        response => response.url().includes('/api/items'),
        { timeout: 5000 }
      );
    } catch {
      // 没有新请求，可能已经加载完毕
      break;
    }
  }
  
  return items;
}

// ----- 处理登录状态 -----

// 保存登录状态
async function saveAuthState(page: Page, path: string) {
  await page.context().storageState({ path });
}

// 加载登录状态
async function loadAuthState(context: BrowserContext, path: string) {
  // 在创建 context 时指定 storageState
  // 或者手动加载 cookies
  const fs = require('fs');
  const state = JSON.parse(fs.readFileSync(path, 'utf-8'));
  
  for (const cookie of state.cookies) {
    await context.addCookies([cookie]);
  }
}

// 检查登录状态
async function checkLoginStatus(page: Page): Promise<boolean> {
  try {
    // 检查登录后才有的元素
    await page.waitForSelector('.user-avatar', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

// 自动登录流程
async function autoLogin(page: Page, credentials: { email: string; password: string }) {
  const isLoggedIn = await checkLoginStatus(page);
  
  if (isLoggedIn) {
    console.log('Already logged in');
    return;
  }
  
  // 执行登录
  await page.goto('/login');
  await page.getByLabel('邮箱').fill(credentials.email);
  await page.getByLabel('密码').fill(credentials.password);
  await page.getByRole('button', { name: '登录' }).click();
  
  // 等待登录成功
  await page.waitForURL('**/dashboard');
  
  // 保存状态
  await saveAuthState(page, 'auth.json');
}

// ----- 处理验证码 -----

// 方法1：使用第三方验证码识别服务
async function solveCaptchaWithService(imageBase64: string): Promise<string> {
  // 调用第三方 API（如 2Captcha）
  const response = await fetch('https://2captcha.com/in.php', {
    method: 'POST',
    body: JSON.stringify({
      key: process.env.CAPTCHA_API_KEY,
      method: 'base64',
      body: imageBase64
    })
  });
  
  const { request } = await response.json();
  
  // 轮询获取结果
  while (true) {
    await new Promise(r => setTimeout(r, 5000));
    
    const result = await fetch(
      \`https://2captcha.com/res.php?key=\${process.env.CAPTCHA_API_KEY}&action=get&id=\${request}\`
    );
    const text = await result.text();
    
    if (text.startsWith('OK|')) {
      return text.split('|')[1];
    }
  }
}

// 方法2：人工介入
async function waitForManualCaptcha(page: Page) {
  console.log('请手动完成验证码...');
  
  // 暂停执行，等待人工操作
  await page.pause();
  
  // 或者等待特定元素消失
  await page.waitForSelector('.captcha-container', { state: 'hidden', timeout: 300000 });
}

// 方法3：绕过验证码（使用已登录的 Cookie）
async function bypassCaptchaWithCookies(context: BrowserContext) {
  // 从文件加载预先保存的 cookies
  const cookies = require('./cookies.json');
  await context.addCookies(cookies);
}

// ----- 处理弹窗和对话框 -----

async function handleDialogs(page: Page) {
  // 处理 alert/confirm/prompt
  page.on('dialog', async dialog => {
    console.log('Dialog type:', dialog.type());
    console.log('Dialog message:', dialog.message());
    
    if (dialog.type() === 'confirm') {
      await dialog.accept();
    } else if (dialog.type() === 'prompt') {
      await dialog.accept('user input');
    } else {
      await dialog.dismiss();
    }
  });
  
  // 处理页面内的模态框
  const modal = page.locator('.modal');
  if (await modal.isVisible()) {
    await modal.locator('.close-button').click();
  }
}

// ----- 处理文件下载 -----

async function handleDownload(page: Page) {
  // 监听下载事件
  const downloadPromise = page.waitForEvent('download');
  
  // 触发下载
  await page.getByRole('button', { name: '下载' }).click();
  
  // 等待下载完成
  const download = await downloadPromise;
  
  // 保存文件
  const path = await download.path();
  console.log('Downloaded to:', path);
  
  // 或者保存到指定位置
  await download.saveAs('./downloads/' + download.suggestedFilename());
  
  return download.suggestedFilename();
}

// ----- 处理多标签页 -----

async function handleMultipleTabs(page: Page) {
  // 等待新标签页打开
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    page.getByRole('link', { name: '新窗口打开' }).click()
  ]);
  
  // 等待新页面加载
  await newPage.waitForLoadState();
  
  // 在新页面操作
  console.log('New page title:', await newPage.title());
  await newPage.getByRole('button', { name: '确认' }).click();
  
  // 关闭新页面
  await newPage.close();
  
  // 返回原页面继续操作
  await page.getByRole('button', { name: '继续' }).click();
}

// ----- 模拟真实用户行为 -----

async function simulateRealUser(page: Page) {
  // 随机延迟
  const randomDelay = () => Math.random() * 1000 + 500;
  
  // 模拟鼠标移动
  await page.mouse.move(100, 100);
  await page.waitForTimeout(randomDelay());
  await page.mouse.move(200, 150);
  
  // 模拟滚动
  await page.evaluate(() => {
    window.scrollBy({
      top: Math.random() * 300 + 100,
      behavior: 'smooth'
    });
  });
  await page.waitForTimeout(randomDelay());
  
  // 模拟打字速度
  await page.getByLabel('搜索').type('search query', {
    delay: Math.random() * 100 + 50
  });
}

// ----- 使用代理 -----

import { chromium } from 'playwright';

async function useProxy() {
  const browser = await chromium.launch({
    proxy: {
      server: 'http://proxy.example.com:8080',
      username: 'user',
      password: 'pass'
    }
  });
  
  const page = await browser.newPage();
  await page.goto('https://example.com');
  
  await browser.close();
}

// ----- 处理 iframe -----

async function handleIframe(page: Page) {
  // 定位 iframe
  const frame = page.frameLocator('#payment-iframe');
  
  // 在 iframe 中操作
  await frame.locator('#card-number').fill('4242424242424242');
  await frame.locator('#expiry').fill('12/25');
  await frame.locator('#cvc').fill('123');
  
  // 嵌套 iframe
  const nestedFrame = page
    .frameLocator('#outer-frame')
    .frameLocator('#inner-frame');
  await nestedFrame.locator('button').click();
}

// ----- 完整示例：Airbnb 搜索 -----

async function searchAirbnb(page: Page) {
  await page.goto('https://www.airbnb.com');
  
  // 等待页面加载
  await page.waitForLoadState('networkidle');
  
  // 处理可能的弹窗
  const closeButton = page.locator('[aria-label="Close"]');
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
  
  // 输入目的地
  await page.getByTestId('structured-search-input-field-query').click();
  await page.getByTestId('structured-search-input-field-query').fill('New York');
  
  // 等待搜索建议
  await page.waitForSelector('[data-testid="option-0"]');
  await page.getByTestId('option-0').click();
  
  // 选择日期
  await page.getByTestId('structured-search-input-field-split-dates-0').click();
  
  // 选择下周的日期
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const checkOut = new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  // 点击日期（需要根据实际 DOM 结构调整）
  await page.locator(\`[data-testid="calendar-day-\${nextWeek.toISOString().split('T')[0]}"]\`).click();
  await page.locator(\`[data-testid="calendar-day-\${checkOut.toISOString().split('T')[0]}"]\`).click();
  
  // 搜索
  await page.getByTestId('structured-search-input-search-button').click();
  
  // 等待结果加载
  await page.waitForSelector('[data-testid="card-container"]');
  
  // 提取结果
  const listings = await page.locator('[data-testid="card-container"]').all();
  
  const results = [];
  for (const listing of listings.slice(0, 10)) {
    const title = await listing.locator('[data-testid="listing-card-title"]').textContent();
    const price = await listing.locator('[data-testid="price-availability-row"]').textContent();
    results.push({ title, price });
  }
  
  return results;
}`,
      keyPoints: [
        '使用 waitForSelector、waitForResponse 等方法处理动态内容',
        '通过 storageState 保存和复用登录状态',
        '验证码可以通过第三方服务、人工介入或 Cookie 复用解决',
        '使用 frameLocator 处理 iframe',
        '模拟真实用户行为可以降低被检测的风险',
        '使用代理可以绕过 IP 限制'
      ],
      references: [
        { text: '处理动态内容', url: 'https://playwright.dev/docs/navigations' },
        { text: '认证状态', url: 'https://playwright.dev/docs/auth' },
        { text: '处理 iframe', url: 'https://playwright.dev/docs/frames' }
      ]
    },
    {
      title: 'Playwright MCP Server 实战',
      background: `Microsoft 官方提供了 Playwright MCP Server，可以让 AI 模型（如 Claude）直接控制浏览器。这为构建智能自动化 Agent 提供了基础。

通过 Playwright MCP Server，你可以：
- 让 AI 理解网页内容并做出决策
- 构建能够自主完成任务的 Agent
- 实现自然语言驱动的浏览器自动化

本节将介绍如何配置和使用 Playwright MCP Server。`,
      content: `**Playwright MCP Server 功能**

| 工具 | 功能 |
|------|------|
| browser_navigate | 导航到 URL |
| browser_click | 点击元素 |
| browser_fill | 填写输入框 |
| browser_screenshot | 截取截图 |
| browser_get_text | 获取文本内容 |
| browser_execute_js | 执行 JavaScript |`,
      codeExample: `// ==========================================
// Playwright MCP Server 配置与使用
// ==========================================

// ----- 安装 Playwright MCP Server -----
/*
npm install -g @anthropic-ai/mcp-server-playwright

或者使用 npx：
npx @anthropic-ai/mcp-server-playwright
*/

// ----- Claude Desktop 配置 -----
/*
编辑 Claude Desktop 配置文件：

macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
Windows: %APPDATA%\\Claude\\claude_desktop_config.json

{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false"
      }
    }
  }
}

重启 Claude Desktop 后，就可以使用浏览器自动化功能了。
*/

// ----- 自定义 Playwright MCP Server -----
// custom-playwright-server.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { chromium, Browser, Page } from 'playwright';

interface Tool {
  name: string;
  description: string;
  inputSchema: object;
}

class CustomPlaywrightServer {
  private server: Server;
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor() {
    this.server = new Server(
      { name: 'custom-playwright', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );
    
    this.setupTools();
  }

  private getTools(): Tool[] {
    return [
      {
        name: 'navigate',
        description: '导航到指定的网页 URL',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: '要访问的完整 URL' }
          },
          required: ['url']
        }
      },
      {
        name: 'click',
        description: '点击页面上的元素。可以使用文本内容、CSS 选择器或 XPath',
        inputSchema: {
          type: 'object',
          properties: {
            target: { type: 'string', description: '要点击的元素（文本、选择器或 XPath）' }
          },
          required: ['target']
        }
      },
      {
        name: 'type',
        description: '在输入框中输入文本',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: '输入框的选择器' },
            text: { type: 'string', description: '要输入的文本' }
          },
          required: ['selector', 'text']
        }
      },
      {
        name: 'screenshot',
        description: '截取当前页面的截图',
        inputSchema: {
          type: 'object',
          properties: {
            fullPage: { type: 'boolean', description: '是否截取整个页面' }
          }
        }
      },
      {
        name: 'extract',
        description: '从页面提取结构化数据',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: '要提取的元素选择器' },
            attributes: { 
              type: 'array', 
              items: { type: 'string' },
              description: '要提取的属性列表' 
            }
          },
          required: ['selector']
        }
      },
      {
        name: 'wait',
        description: '等待页面上的元素出现',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: '要等待的元素选择器' },
            timeout: { type: 'number', description: '超时时间（毫秒）' }
          },
          required: ['selector']
        }
      },
      {
        name: 'scroll',
        description: '滚动页面',
        inputSchema: {
          type: 'object',
          properties: {
            direction: { 
              type: 'string', 
              enum: ['up', 'down', 'top', 'bottom'],
              description: '滚动方向' 
            },
            amount: { type: 'number', description: '滚动距离（像素）' }
          },
          required: ['direction']
        }
      },
      {
        name: 'get_page_content',
        description: '获取页面的文本内容或 HTML',
        inputSchema: {
          type: 'object',
          properties: {
            format: { 
              type: 'string', 
              enum: ['text', 'html'],
              description: '返回格式' 
            },
            selector: { type: 'string', description: '特定元素的选择器（可选）' }
          }
        }
      }
    ];
  }

  private setupTools() {
    // 列出工具
    this.server.setRequestHandler('tools/list', async () => ({
      tools: this.getTools()
    }));

    // 调用工具
    this.server.setRequestHandler('tools/call', async (request: any) => {
      const { name, arguments: args } = request.params;
      
      try {
        const result = await this.executeTool(name, args);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      } catch (error: any) {
        return { 
          content: [{ type: 'text', text: \`Error: \${error.message}\` }],
          isError: true 
        };
      }
    });
  }

  private async ensurePage(): Promise<Page> {
    if (!this.browser) {
      this.browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
      });
      const context = await this.browser.newContext({
        viewport: null // 使用最大化窗口
      });
      this.page = await context.newPage();
    }
    return this.page!;
  }

  private async executeTool(name: string, args: any): Promise<any> {
    const page = await this.ensurePage();

    switch (name) {
      case 'navigate':
        await page.goto(args.url, { waitUntil: 'networkidle' });
        return { 
          success: true, 
          title: await page.title(),
          url: page.url()
        };

      case 'click':
        // 尝试多种定位方式
        const target = args.target;
        try {
          // 首先尝试作为文本
          await page.getByText(target, { exact: false }).first().click({ timeout: 3000 });
        } catch {
          try {
            // 然后尝试作为角色
            await page.getByRole('button', { name: target }).click({ timeout: 3000 });
          } catch {
            try {
              // 尝试作为链接
              await page.getByRole('link', { name: target }).click({ timeout: 3000 });
            } catch {
              // 最后尝试作为选择器
              await page.click(target);
            }
          }
        }
        return { success: true, clicked: target };

      case 'type':
        await page.fill(args.selector, args.text);
        return { success: true, typed: args.text };

      case 'screenshot':
        const buffer = await page.screenshot({ 
          fullPage: args.fullPage || false 
        });
        return { 
          success: true, 
          image: buffer.toString('base64'),
          mimeType: 'image/png'
        };

      case 'extract':
        const elements = await page.locator(args.selector).all();
        const data = [];
        for (const el of elements) {
          const item: any = { text: await el.textContent() };
          if (args.attributes) {
            for (const attr of args.attributes) {
              item[attr] = await el.getAttribute(attr);
            }
          }
          data.push(item);
        }
        return { success: true, data };

      case 'wait':
        await page.waitForSelector(args.selector, { 
          timeout: args.timeout || 30000 
        });
        return { success: true, found: args.selector };

      case 'scroll':
        switch (args.direction) {
          case 'down':
            await page.evaluate((amount) => window.scrollBy(0, amount), args.amount || 500);
            break;
          case 'up':
            await page.evaluate((amount) => window.scrollBy(0, -amount), args.amount || 500);
            break;
          case 'top':
            await page.evaluate(() => window.scrollTo(0, 0));
            break;
          case 'bottom':
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            break;
        }
        return { success: true, scrolled: args.direction };

      case 'get_page_content':
        if (args.selector) {
          const el = page.locator(args.selector);
          const content = args.format === 'html' 
            ? await el.innerHTML()
            : await el.textContent();
          return { success: true, content };
        } else {
          const content = args.format === 'html'
            ? await page.content()
            : await page.evaluate(() => document.body.innerText);
          return { success: true, content: content?.substring(0, 50000) };
        }

      default:
        throw new Error(\`Unknown tool: \${name}\`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Custom Playwright MCP Server is running...');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// 启动服务器
const server = new CustomPlaywrightServer();

process.on('SIGINT', async () => {
  await server.cleanup();
  process.exit(0);
});

server.run().catch(console.error);

// ----- 使用示例：与 Claude 集成 -----
/*
配置好 MCP Server 后，你可以在 Claude 中这样使用：

用户: "请帮我打开 Airbnb，搜索纽约下周的房源，并告诉我前5个结果的价格"

Claude 会自动：
1. 调用 navigate 工具打开 Airbnb
2. 调用 click 和 type 工具进行搜索
3. 调用 wait 工具等待结果加载
4. 调用 extract 工具提取房源信息
5. 返回结构化的结果给用户
*/`,
      keyPoints: [
        'Playwright MCP Server 让 AI 可以直接控制浏览器',
        '通过 Claude Desktop 配置文件启用 MCP Server',
        '可以自定义 MCP Server 添加更多功能',
        'AI 可以根据任务自主决定使用哪些工具',
        'MCP 协议标准化了 AI 与工具的交互',
        '适合构建智能自动化 Agent'
      ],
      references: [
        { text: 'Playwright MCP Server', url: 'https://github.com/anthropics/mcp-server-playwright' },
        { text: 'MCP Server 开发指南', url: 'https://modelcontextprotocol.io/docs/server' },
        { text: 'Claude Desktop MCP 配置', url: 'https://modelcontextprotocol.io/docs/quickstart' }
      ]
    }
  ],
  homework: [
    {
      title: '实现自定义 MCP Server',
      description: '基于本章的示例代码，实现一个自定义的 MCP Server，添加至少 3 个新的工具（如表单提交、Cookie 管理、网络请求拦截等）。',
      hints: ['参考 MCP SDK 文档', '处理好错误情况', '添加详细的工具描述']
    },
    {
      title: '处理复杂登录流程',
      description: '选择一个需要登录的网站，实现完整的自动化登录流程，包括：处理验证码（可以使用人工介入）、保存登录状态、检测登录过期并自动重新登录。',
      hints: ['使用 storageState 保存状态', '实现登录状态检测', '处理可能的弹窗']
    },
    {
      title: 'Airbnb 搜索 Agent',
      description: '使用 Playwright 和 MCP 协议，构建一个可以通过自然语言控制的 Airbnb 搜索 Agent。用户可以说"帮我找纽约下周的房源，预算 200 美元以内"，Agent 自动完成搜索并返回结果。',
      hints: ['集成 Claude API', '实现结果过滤逻辑', '处理各种边界情况']
    }
  ]
};
