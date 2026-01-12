export const day4Content = {
  day: 4,
  title: 'Playwright 自动化框架',
  subtitle: '现代化的端到端测试与浏览器自动化',
  overview: `Playwright 是由 Microsoft 开发的现代浏览器自动化框架，支持 Chromium、Firefox 和 WebKit 三大浏览器引擎。它提供了统一的 API 来控制浏览器，执行自动化测试和网页爬取任务。

相比于 Selenium 等传统工具，Playwright 具有以下优势：
- 自动等待机制，无需手动添加 sleep
- 原生支持现代 Web 特性（Shadow DOM、iframe 等）
- 内置网络拦截和修改能力
- 支持移动端模拟
- 强大的调试工具（Trace Viewer、Codegen）

对于后端开发者来说，Playwright 的 API 设计非常直观，类似于操作数据库的 ORM——你描述"想要什么"，框架负责"如何实现"。`,
  sections: [
    {
      title: 'Playwright 安装与配置',
      background: `Playwright 支持 Node.js、Python、Java 和 .NET 四种语言。本教程使用 TypeScript/Node.js 版本，因为它与前端开发技术栈一致，且有最好的类型支持。

Playwright 的安装非常简单，它会自动下载所需的浏览器二进制文件。你也可以选择只安装特定的浏览器以节省空间。

Playwright 提供了两种使用方式：
1. **Playwright Test**：完整的测试框架，包含测试运行器、断言库等
2. **Playwright Library**：纯库模式，用于脚本和爬虫`,
      content: `**安装选项**

| 命令 | 说明 |
|------|------|
| npm init playwright@latest | 创建新项目（推荐） |
| npm install playwright | 安装库（不含测试框架） |
| npm install @playwright/test | 安装测试框架 |
| npx playwright install | 安装浏览器 |
| npx playwright install chromium | 只安装 Chromium |

**项目结构**

创建项目后，你会得到以下结构：
- playwright.config.ts：配置文件
- tests/：测试文件目录
- tests-examples/：示例测试`,
      codeExample: `// ==========================================
// Playwright 安装与配置
// ==========================================

// ----- 创建新项目 -----
/*
终端命令：
npm init playwright@latest

交互式选项：
- 选择 TypeScript 或 JavaScript
- 选择测试目录名称
- 是否添加 GitHub Actions
- 是否安装浏览器
*/

// ----- playwright.config.ts -----
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 测试目录
  testDir: './tests',
  
  // 并行执行
  fullyParallel: true,
  
  // CI 环境下禁止 .only
  forbidOnly: !!process.env.CI,
  
  // 失败重试次数
  retries: process.env.CI ? 2 : 0,
  
  // 并行 worker 数量
  workers: process.env.CI ? 1 : undefined,
  
  // 报告器
  reporter: [
    ['html'],           // HTML 报告
    ['list'],           // 控制台列表
    ['json', { outputFile: 'test-results.json' }]
  ],
  
  // 全局配置
  use: {
    // 基础 URL
    baseURL: 'http://localhost:3000',
    
    // 收集 Trace（用于调试）
    trace: 'on-first-retry',
    
    // 截图
    screenshot: 'only-on-failure',
    
    // 视频录制
    video: 'retain-on-failure',
    
    // 浏览器上下文选项
    viewport: { width: 1280, height: 720 },
    
    // 忽略 HTTPS 错误
    ignoreHTTPSErrors: true,
    
    // 地理位置
    geolocation: { longitude: 116.4074, latitude: 39.9042 },
    
    // 权限
    permissions: ['geolocation'],
    
    // 语言
    locale: 'zh-CN',
    
    // 时区
    timezoneId: 'Asia/Shanghai',
  },
  
  // 项目配置（多浏览器测试）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 移动端测试
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  // 开发服务器
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

// ----- 基本测试示例 -----
// tests/example.spec.ts

import { test, expect } from '@playwright/test';

test.describe('首页测试', () => {
  test.beforeEach(async ({ page }) => {
    // 每个测试前导航到首页
    await page.goto('/');
  });

  test('页面标题正确', async ({ page }) => {
    await expect(page).toHaveTitle(/My App/);
  });

  test('导航链接可用', async ({ page }) => {
    // 点击导航链接
    await page.click('text=关于我们');
    
    // 验证 URL
    await expect(page).toHaveURL(/.*about/);
    
    // 验证页面内容
    await expect(page.locator('h1')).toContainText('关于我们');
  });
});

// ----- 运行测试 -----
/*
# 运行所有测试
npx playwright test

# 运行特定文件
npx playwright test tests/example.spec.ts

# 运行特定浏览器
npx playwright test --project=chromium

# 运行带标签的测试
npx playwright test --grep @smoke

# 调试模式
npx playwright test --debug

# UI 模式（推荐）
npx playwright test --ui

# 查看报告
npx playwright show-report
*/`,
      keyPoints: [
        '使用 npm init playwright@latest 快速创建项目',
        'playwright.config.ts 是核心配置文件',
        '支持多浏览器、多设备的并行测试',
        '内置 HTML 报告、Trace 和视频录制',
        '使用 --ui 模式可以交互式调试测试',
        'webServer 配置可以自动启动开发服务器'
      ],
      references: [
        { text: 'Playwright 安装指南', url: 'https://playwright.dev/docs/intro' },
        { text: '配置文件详解', url: 'https://playwright.dev/docs/test-configuration' },
        { text: '命令行选项', url: 'https://playwright.dev/docs/test-cli' }
      ]
    },
    {
      title: '元素定位与交互',
      background: `Playwright 提供了强大的元素定位器（Locator）系统。与传统的 Selenium 不同，Playwright 的 Locator 是"惰性"的——它不会立即查找元素，而是在需要交互时才执行查找，并且会自动等待元素可用。

Playwright 推荐使用"用户可见"的定位方式，如文本内容、角色（role）、标签（label）等，而不是依赖 CSS 选择器或 XPath。这样的测试更加稳定，也更接近真实用户的行为。

Locator 的自动等待机制是 Playwright 的核心优势之一。它会自动等待元素：
- 附加到 DOM
- 可见
- 稳定（没有动画）
- 可接收事件
- 启用（非 disabled）`,
      content: `**推荐的定位策略（按优先级）**

| 策略 | 方法 | 示例 |
|------|------|------|
| 角色 | getByRole | getByRole('button', { name: '提交' }) |
| 标签 | getByLabel | getByLabel('用户名') |
| 占位符 | getByPlaceholder | getByPlaceholder('请输入邮箱') |
| 文本 | getByText | getByText('登录') |
| 测试 ID | getByTestId | getByTestId('submit-btn') |
| CSS | locator | locator('.submit-button') |
| XPath | locator | locator('xpath=//button') |

**自动等待的操作**

所有交互操作都会自动等待元素就绪：
- click()、fill()、type()
- check()、uncheck()
- selectOption()
- hover()、focus()`,
      codeExample: `// ==========================================
// 元素定位与交互
// ==========================================

import { test, expect, Page } from '@playwright/test';

// ----- 推荐的定位方式 -----

test('元素定位示例', async ({ page }) => {
  await page.goto('https://example.com/login');
  
  // 1. 通过角色定位（最推荐）
  // 角色来自 ARIA 规范，如 button, link, textbox, checkbox 等
  await page.getByRole('button', { name: '登录' }).click();
  await page.getByRole('link', { name: '注册' }).click();
  await page.getByRole('textbox', { name: '用户名' }).fill('admin');
  await page.getByRole('checkbox', { name: '记住我' }).check();
  
  // 2. 通过标签定位（表单元素推荐）
  // 匹配 <label> 关联的表单元素
  await page.getByLabel('邮箱地址').fill('user@example.com');
  await page.getByLabel('密码').fill('password123');
  
  // 3. 通过占位符定位
  await page.getByPlaceholder('请输入搜索关键词').fill('Playwright');
  
  // 4. 通过文本定位
  // 默认匹配子字符串，使用 exact: true 精确匹配
  await page.getByText('欢迎回来').click();
  await page.getByText('登录', { exact: true }).click();
  
  // 5. 通过 alt 文本定位（图片）
  await page.getByAltText('公司 Logo').click();
  
  // 6. 通过 title 属性定位
  await page.getByTitle('关闭').click();
  
  // 7. 通过测试 ID 定位
  // 需要在 HTML 中添加 data-testid 属性
  await page.getByTestId('submit-button').click();
});

// ----- CSS 和 XPath 选择器 -----

test('CSS 和 XPath 选择器', async ({ page }) => {
  await page.goto('https://example.com');
  
  // CSS 选择器
  await page.locator('.login-form input[type="email"]').fill('user@example.com');
  await page.locator('#submit-btn').click();
  await page.locator('[data-action="submit"]').click();
  
  // XPath 选择器
  await page.locator('xpath=//button[contains(text(), "提交")]').click();
  await page.locator('xpath=//div[@class="container"]//input').fill('text');
  
  // 组合选择器
  await page.locator('div.form-group').locator('input').fill('value');
});

// ----- 过滤和链式定位 -----

test('过滤和链式定位', async ({ page }) => {
  await page.goto('https://example.com/products');
  
  // 链式定位
  const productCard = page.locator('.product-card');
  await productCard.locator('.add-to-cart').first().click();
  
  // 使用 filter 过滤
  const activeItem = page.locator('.menu-item').filter({ hasText: '首页' });
  await activeItem.click();
  
  // 过滤包含特定子元素的元素
  const cardWithImage = page.locator('.card').filter({
    has: page.locator('img')
  });
  
  // 过滤不包含特定内容的元素
  const cardWithoutSoldOut = page.locator('.card').filter({
    hasNot: page.locator('.sold-out')
  });
  
  // 组合过滤
  const targetCard = page.locator('.product-card')
    .filter({ hasText: 'iPhone' })
    .filter({ has: page.locator('.in-stock') });
});

// ----- 处理多个元素 -----

test('处理多个元素', async ({ page }) => {
  await page.goto('https://example.com/list');
  
  const items = page.locator('.list-item');
  
  // 获取元素数量
  const count = await items.count();
  console.log(\`共有 \${count} 个元素\`);
  
  // 获取第 N 个元素（0-indexed）
  await items.nth(0).click();  // 第一个
  await items.nth(-1).click(); // 最后一个
  
  // 快捷方法
  await items.first().click();
  await items.last().click();
  
  // 遍历所有元素
  for (let i = 0; i < await items.count(); i++) {
    const text = await items.nth(i).textContent();
    console.log(\`第 \${i + 1} 项: \${text}\`);
  }
  
  // 使用 all() 获取所有元素
  const allItems = await items.all();
  for (const item of allItems) {
    console.log(await item.textContent());
  }
});

// ----- 交互操作 -----

test('交互操作示例', async ({ page }) => {
  await page.goto('https://example.com/form');
  
  // 点击
  await page.getByRole('button', { name: '提交' }).click();
  await page.getByRole('button').click({ button: 'right' }); // 右键
  await page.getByRole('button').dblclick(); // 双击
  await page.getByRole('button').click({ modifiers: ['Shift'] }); // Shift+点击
  
  // 输入文本
  await page.getByLabel('用户名').fill('admin'); // 清空后填入
  await page.getByLabel('备注').type('Hello', { delay: 100 }); // 逐字输入
  await page.getByLabel('搜索').press('Enter'); // 按键
  
  // 清空输入框
  await page.getByLabel('用户名').clear();
  
  // 复选框和单选框
  await page.getByLabel('同意条款').check();
  await page.getByLabel('同意条款').uncheck();
  await page.getByLabel('男').check(); // 单选框
  
  // 下拉选择
  await page.getByLabel('国家').selectOption('china');
  await page.getByLabel('国家').selectOption({ label: '中国' });
  await page.getByLabel('技能').selectOption(['js', 'ts', 'python']); // 多选
  
  // 文件上传
  await page.getByLabel('上传头像').setInputFiles('avatar.png');
  await page.getByLabel('上传文件').setInputFiles(['file1.pdf', 'file2.pdf']);
  await page.getByLabel('上传').setInputFiles([]); // 清空
  
  // 拖放
  await page.locator('#source').dragTo(page.locator('#target'));
  
  // 悬停
  await page.getByText('菜单').hover();
  
  // 聚焦
  await page.getByLabel('搜索').focus();
  
  // 滚动
  await page.getByText('底部内容').scrollIntoViewIfNeeded();
});

// ----- 等待和超时 -----

test('等待和超时', async ({ page }) => {
  await page.goto('https://example.com');
  
  // 等待元素可见
  await page.locator('.loading').waitFor({ state: 'hidden' });
  await page.locator('.content').waitFor({ state: 'visible' });
  
  // 等待元素附加到 DOM
  await page.locator('.dynamic-element').waitFor({ state: 'attached' });
  
  // 自定义超时
  await page.getByRole('button').click({ timeout: 10000 });
  
  // 等待特定条件
  await page.waitForFunction(() => {
    return document.querySelectorAll('.item').length > 5;
  });
  
  // 等待 URL 变化
  await page.waitForURL('**/success');
  await page.waitForURL(/\\/dashboard/);
  
  // 等待网络请求
  const responsePromise = page.waitForResponse('**/api/users');
  await page.getByRole('button', { name: '加载' }).click();
  const response = await responsePromise;
  console.log('响应状态:', response.status());
});

// ----- 处理特殊元素 -----

test('处理特殊元素', async ({ page }) => {
  await page.goto('https://example.com');
  
  // iframe
  const frame = page.frameLocator('#my-iframe');
  await frame.locator('button').click();
  
  // 嵌套 iframe
  const nestedFrame = page.frameLocator('#outer').frameLocator('#inner');
  await nestedFrame.locator('input').fill('text');
  
  // Shadow DOM
  // Playwright 自动穿透 Shadow DOM
  await page.locator('my-component').locator('button').click();
  
  // 对话框（alert, confirm, prompt）
  page.on('dialog', async dialog => {
    console.log('对话框消息:', dialog.message());
    await dialog.accept(); // 或 dialog.dismiss()
  });
  await page.getByRole('button', { name: '显示对话框' }).click();
  
  // 新窗口/标签页
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: '新窗口打开' }).click()
  ]);
  await newPage.waitForLoadState();
  console.log('新页面标题:', await newPage.title());
});`,
      keyPoints: [
        '优先使用 getByRole、getByLabel 等语义化定位器',
        'Locator 是惰性的，会自动等待元素就绪',
        '使用 filter() 进行复杂的元素过滤',
        '所有交互操作都内置自动等待机制',
        '使用 frameLocator 处理 iframe',
        'Playwright 自动穿透 Shadow DOM'
      ],
      references: [
        { text: 'Locator 文档', url: 'https://playwright.dev/docs/locators' },
        { text: '操作指南', url: 'https://playwright.dev/docs/input' },
        { text: '自动等待', url: 'https://playwright.dev/docs/actionability' }
      ]
    },
    {
      title: '网络拦截与 Mock',
      background: `Playwright 提供了强大的网络拦截能力，可以监听、修改甚至阻止网络请求。这在测试中非常有用：
- Mock API 响应，不依赖后端服务
- 模拟网络错误和超时
- 修改请求头或响应数据
- 录制和回放网络请求

网络拦截使用 route() 方法，它可以匹配 URL 模式、正则表达式或自定义函数。被拦截的请求可以继续执行、修改后执行、或直接返回 Mock 数据。`,
      content: `**路由匹配模式**

| 模式 | 示例 | 说明 |
|------|------|------|
| 字符串 | '**/api/users' | 匹配 URL 路径 |
| 正则 | /\\.png$/ | 匹配 PNG 图片 |
| 函数 | (url) => url.includes('api') | 自定义匹配 |

**路由处理选项**

- route.fulfill()：返回 Mock 响应
- route.continue()：继续请求（可修改）
- route.abort()：中止请求`,
      codeExample: `// ==========================================
// 网络拦截与 Mock
// ==========================================

import { test, expect } from '@playwright/test';

// ----- 基础路由拦截 -----

test('Mock API 响应', async ({ page }) => {
  // 拦截 API 请求并返回 Mock 数据
  await page.route('**/api/users', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: '张三', email: 'zhangsan@example.com' },
        { id: 2, name: '李四', email: 'lisi@example.com' },
      ])
    });
  });
  
  await page.goto('https://example.com/users');
  
  // 验证 Mock 数据被正确显示
  await expect(page.getByText('张三')).toBeVisible();
  await expect(page.getByText('李四')).toBeVisible();
});

// ----- 修改请求 -----

test('修改请求头', async ({ page }) => {
  await page.route('**/api/**', async route => {
    // 获取原始请求
    const headers = {
      ...route.request().headers(),
      'Authorization': 'Bearer mock-token',
      'X-Custom-Header': 'custom-value'
    };
    
    // 继续请求，但使用修改后的头
    await route.continue({ headers });
  });
  
  await page.goto('https://example.com');
});

// ----- 修改响应 -----

test('修改 API 响应', async ({ page }) => {
  await page.route('**/api/products', async route => {
    // 先获取真实响应
    const response = await route.fetch();
    const json = await response.json();
    
    // 修改响应数据
    json.products = json.products.map(product => ({
      ...product,
      price: product.price * 0.8 // 打八折
    }));
    
    // 返回修改后的响应
    await route.fulfill({
      response,
      body: JSON.stringify(json)
    });
  });
  
  await page.goto('https://example.com/products');
});

// ----- 模拟网络错误 -----

test('模拟网络错误', async ({ page }) => {
  // 模拟请求失败
  await page.route('**/api/data', async route => {
    await route.abort('failed');
  });
  
  await page.goto('https://example.com');
  
  // 验证错误处理
  await expect(page.getByText('加载失败')).toBeVisible();
});

test('模拟超时', async ({ page }) => {
  await page.route('**/api/slow', async route => {
    // 延迟响应
    await new Promise(resolve => setTimeout(resolve, 30000));
    await route.fulfill({ body: 'delayed' });
  });
  
  await page.goto('https://example.com');
  // 测试超时处理逻辑
});

// ----- 阻止资源加载 -----

test('阻止图片和字体加载', async ({ page }) => {
  // 阻止图片加载（加速测试）
  await page.route('**/*.{png,jpg,jpeg,gif,webp}', route => route.abort());
  
  // 阻止字体加载
  await page.route('**/*.{woff,woff2,ttf}', route => route.abort());
  
  // 阻止第三方脚本
  await page.route('**/analytics.js', route => route.abort());
  await page.route('**/ads/**', route => route.abort());
  
  await page.goto('https://example.com');
});

// ----- 监听网络请求 -----

test('监听和记录请求', async ({ page }) => {
  const requests: string[] = [];
  const responses: { url: string; status: number }[] = [];
  
  // 监听请求
  page.on('request', request => {
    requests.push(request.url());
    console.log('请求:', request.method(), request.url());
  });
  
  // 监听响应
  page.on('response', response => {
    responses.push({
      url: response.url(),
      status: response.status()
    });
    console.log('响应:', response.status(), response.url());
  });
  
  await page.goto('https://example.com');
  
  // 分析请求
  console.log(\`共发起 \${requests.length} 个请求\`);
  const failedResponses = responses.filter(r => r.status >= 400);
  console.log(\`失败的请求: \${failedResponses.length}\`);
});

// ----- 等待特定请求 -----

test('等待 API 请求完成', async ({ page }) => {
  await page.goto('https://example.com');
  
  // 等待请求发出
  const requestPromise = page.waitForRequest('**/api/users');
  await page.getByRole('button', { name: '加载用户' }).click();
  const request = await requestPromise;
  console.log('请求 URL:', request.url());
  
  // 等待响应返回
  const responsePromise = page.waitForResponse(
    response => response.url().includes('/api/users') && response.status() === 200
  );
  await page.getByRole('button', { name: '刷新' }).click();
  const response = await responsePromise;
  const data = await response.json();
  console.log('响应数据:', data);
});

// ----- HAR 文件录制和回放 -----

test('录制 HAR 文件', async ({ page }) => {
  // 开始录制
  await page.routeFromHAR('recordings/example.har', {
    update: true, // 更新模式：录制新请求
  });
  
  await page.goto('https://example.com');
  await page.getByRole('button', { name: '加载数据' }).click();
  
  // HAR 文件会自动保存
});

test('回放 HAR 文件', async ({ page }) => {
  // 从 HAR 文件回放（不发起真实请求）
  await page.routeFromHAR('recordings/example.har', {
    update: false, // 回放模式
  });
  
  await page.goto('https://example.com');
  // 所有匹配的请求都会从 HAR 文件返回
});

// ----- 高级：请求拦截器类 -----

class APIInterceptor {
  private page: Page;
  private mocks: Map<string, any> = new Map();
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async setup() {
    await this.page.route('**/api/**', async route => {
      const url = route.request().url();
      
      // 检查是否有 Mock 数据
      for (const [pattern, data] of this.mocks) {
        if (url.includes(pattern)) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(data)
          });
          return;
        }
      }
      
      // 没有 Mock，继续真实请求
      await route.continue();
    });
  }
  
  mock(urlPattern: string, data: any) {
    this.mocks.set(urlPattern, data);
  }
  
  clearMocks() {
    this.mocks.clear();
  }
}

// 使用示例
test('使用拦截器类', async ({ page }) => {
  const interceptor = new APIInterceptor(page);
  await interceptor.setup();
  
  interceptor.mock('/api/users', [
    { id: 1, name: 'Mock User' }
  ]);
  
  await page.goto('https://example.com/users');
  await expect(page.getByText('Mock User')).toBeVisible();
});`,
      keyPoints: [
        '使用 page.route() 拦截网络请求',
        'route.fulfill() 返回 Mock 响应',
        'route.continue() 继续请求（可修改）',
        'route.abort() 中止请求',
        '使用 HAR 文件录制和回放网络请求',
        '监听 request 和 response 事件分析网络活动'
      ],
      references: [
        { text: '网络拦截', url: 'https://playwright.dev/docs/network' },
        { text: 'Mock API', url: 'https://playwright.dev/docs/mock' },
        { text: 'HAR 文件', url: 'https://playwright.dev/docs/mock#recording-a-har-file' }
      ]
    },
    {
      title: '调试与代码生成',
      background: `Playwright 提供了多种强大的调试工具，可以大大提高开发效率：

1. **Codegen**：自动录制用户操作并生成代码
2. **Playwright Inspector**：交互式调试器
3. **Trace Viewer**：查看测试执行的详细记录
4. **UI Mode**：可视化的测试运行界面

这些工具对于新手特别有用——你可以通过 Codegen 快速生成测试代码，然后在 Inspector 中调试和优化。`,
      content: `**调试工具对比**

| 工具 | 用途 | 启动命令 |
|------|------|----------|
| Codegen | 录制操作生成代码 | npx playwright codegen |
| Inspector | 交互式调试 | npx playwright test --debug |
| Trace Viewer | 查看执行记录 | npx playwright show-trace |
| UI Mode | 可视化测试 | npx playwright test --ui |

**调试技巧**

- 使用 page.pause() 在代码中设置断点
- 使用 --headed 模式查看浏览器操作
- 使用 slowMo 选项减慢执行速度`,
      codeExample: `// ==========================================
// 调试与代码生成
// ==========================================

// ----- Codegen 代码生成器 -----
/*
启动命令：
npx playwright codegen https://example.com

选项：
--target javascript    # 生成 JavaScript 代码
--target python        # 生成 Python 代码
--device "iPhone 12"   # 模拟设备
--viewport-size 1280,720  # 设置视口
--save-storage auth.json  # 保存认证状态
--load-storage auth.json  # 加载认证状态

Codegen 会打开两个窗口：
1. 浏览器窗口：进行操作
2. 代码窗口：显示生成的代码

操作完成后，复制生成的代码到测试文件中
*/

// ----- 在代码中设置断点 -----

import { test, expect } from '@playwright/test';

test('调试示例', async ({ page }) => {
  await page.goto('https://example.com');
  
  // 方法1：使用 page.pause() 暂停执行
  // 会打开 Playwright Inspector
  await page.pause();
  
  await page.getByRole('button', { name: '登录' }).click();
  
  // 在特定条件下暂停
  const items = await page.locator('.item').count();
  if (items === 0) {
    await page.pause(); // 调试为什么没有元素
  }
});

// ----- 调试配置 -----

// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // 显示浏览器窗口
    headless: false,
    
    // 减慢操作速度（毫秒）
    launchOptions: {
      slowMo: 500,
    },
    
    // 收集 Trace
    trace: 'on', // 'on' | 'off' | 'on-first-retry' | 'retain-on-failure'
    
    // 截图
    screenshot: 'on', // 'on' | 'off' | 'only-on-failure'
    
    // 视频
    video: 'on', // 'on' | 'off' | 'retain-on-failure'
  },
});

// ----- Trace Viewer -----
/*
Trace 是测试执行的详细记录，包含：
- 每个操作的截图
- DOM 快照
- 网络请求
- 控制台日志
- 操作时间线

查看 Trace：
npx playwright show-trace trace.zip

在测试中手动创建 Trace：
*/

test('手动 Trace', async ({ page, context }) => {
  // 开始 Trace
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true
  });
  
  await page.goto('https://example.com');
  await page.getByRole('button').click();
  
  // 停止并保存 Trace
  await context.tracing.stop({
    path: 'trace.zip'
  });
});

// ----- UI Mode -----
/*
UI Mode 是最强大的调试工具，提供：
- 可视化的测试列表
- 实时查看测试执行
- 时间旅行调试（查看每一步的状态）
- 元素选择器
- 监视模式（文件变化自动重跑）

启动命令：
npx playwright test --ui
*/

// ----- 调试技巧 -----

test('调试技巧', async ({ page }) => {
  await page.goto('https://example.com');
  
  // 1. 打印元素信息
  const button = page.getByRole('button', { name: '提交' });
  console.log('按钮是否可见:', await button.isVisible());
  console.log('按钮文本:', await button.textContent());
  console.log('按钮属性:', await button.getAttribute('class'));
  
  // 2. 截图调试
  await page.screenshot({ path: 'debug-screenshot.png' });
  await button.screenshot({ path: 'button-screenshot.png' });
  
  // 3. 获取页面内容
  const html = await page.content();
  console.log('页面 HTML:', html.substring(0, 500));
  
  // 4. 在浏览器中执行 JavaScript
  const result = await page.evaluate(() => {
    return {
      url: window.location.href,
      title: document.title,
      elementCount: document.querySelectorAll('*').length
    };
  });
  console.log('页面信息:', result);
  
  // 5. 监听控制台消息
  page.on('console', msg => {
    console.log('浏览器控制台:', msg.type(), msg.text());
  });
  
  // 6. 监听页面错误
  page.on('pageerror', error => {
    console.error('页面错误:', error.message);
  });
});

// ----- 测试报告 -----
/*
HTML 报告：
npx playwright test --reporter=html
npx playwright show-report

JSON 报告：
npx playwright test --reporter=json

JUnit 报告（CI 集成）：
npx playwright test --reporter=junit

多个报告器：
在 playwright.config.ts 中配置：
reporter: [
  ['html'],
  ['json', { outputFile: 'results.json' }],
  ['junit', { outputFile: 'results.xml' }]
]
*/

// ----- 保存认证状态 -----

// 登录并保存状态
test('登录并保存状态', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.getByLabel('邮箱').fill('user@example.com');
  await page.getByLabel('密码').fill('password');
  await page.getByRole('button', { name: '登录' }).click();
  
  // 等待登录成功
  await page.waitForURL('**/dashboard');
  
  // 保存认证状态
  await page.context().storageState({ path: 'auth.json' });
});

// 使用保存的状态
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /.*\\.setup\\.ts/,
    },
    {
      name: 'tests',
      dependencies: ['setup'],
      use: {
        storageState: 'auth.json',
      },
    },
  ],
});`,
      keyPoints: [
        'Codegen 可以录制操作并生成测试代码',
        'page.pause() 在代码中设置断点',
        'Trace Viewer 提供详细的执行记录和时间旅行调试',
        'UI Mode 是最强大的可视化调试工具',
        '使用 storageState 保存和复用认证状态',
        '多种报告格式支持 CI/CD 集成'
      ],
      references: [
        { text: 'Codegen', url: 'https://playwright.dev/docs/codegen' },
        { text: 'Trace Viewer', url: 'https://playwright.dev/docs/trace-viewer' },
        { text: 'UI Mode', url: 'https://playwright.dev/docs/test-ui-mode' },
        { text: '调试测试', url: 'https://playwright.dev/docs/debug' }
      ]
    }
  ],
  homework: [
    {
      title: '使用 Codegen 录制测试',
      description: '使用 Playwright Codegen 录制一个完整的用户流程：访问电商网站、搜索商品、添加到购物车。将生成的代码整理成测试文件。',
      hints: ['使用 npx playwright codegen', '录制后整理代码结构', '添加适当的断言']
    },
    {
      title: '实现 API Mock',
      description: '为一个前端应用编写测试，Mock 所有 API 请求。测试应该覆盖成功、失败、加载状态等场景。',
      hints: ['使用 page.route() 拦截请求', '测试错误处理逻辑', '使用 HAR 文件简化 Mock']
    },
    {
      title: 'Airbnb 搜索自动化',
      description: '编写 Playwright 脚本，自动打开 Airbnb，搜索纽约下周的房源，并提取搜索结果信息。',
      hints: ['处理日期选择器', '等待搜索结果加载', '提取房源名称和价格']
    }
  ]
};
