export const day3Content = {
  day: 3,
  title: '浏览器原理与自动化基础',
  subtitle: '理解浏览器架构和自动化技术栈',
  overview: `浏览器是现代 Web 应用的运行环境，理解浏览器的工作原理对于前端开发和自动化测试都至关重要。本章将深入探讨现代浏览器的多进程架构、渲染流程、以及 Chrome DevTools Protocol (CDP) 这一浏览器自动化的底层协议。

对于后端开发者来说，浏览器可以类比为一个复杂的分布式系统：多个进程协同工作，通过 IPC（进程间通信）交换消息，共同完成页面的加载、渲染和交互。理解这些概念将帮助你更好地进行性能优化和自动化开发。`,
  sections: [
    {
      title: '现代浏览器架构',
      background: `早期的浏览器（如 IE6）采用单进程架构，所有功能都在一个进程中运行。这种架构的问题是：一个页面崩溃会导致整个浏览器崩溃，而且安全性也很差。

2008 年，Google Chrome 引入了多进程架构，这是浏览器发展史上的重要里程碑。多进程架构将不同的功能隔离到不同的进程中，提高了稳定性、安全性和性能。

Chrome 的多进程架构经过多年演进，目前主要包括：Browser 进程、Renderer 进程、GPU 进程、Network 进程、Plugin 进程等。每个进程都有明确的职责，通过 IPC 机制进行通信。`,
      content: `**Chrome 主要进程类型**

| 进程类型 | 职责 | 特点 |
|---------|------|------|
| Browser 进程 | 地址栏、书签、前进后退、网络请求、文件访问 | 只有一个，是主进程 |
| Renderer 进程 | 页面渲染、JavaScript 执行、DOM 操作 | 每个标签页一个（站点隔离） |
| GPU 进程 | 图形渲染、CSS 动画、Canvas、WebGL | 只有一个，所有页面共享 |
| Network 进程 | 网络请求处理 | 只有一个 |
| Plugin 进程 | 浏览器插件（如 Flash） | 每个插件一个 |
| Utility 进程 | 音视频解码、PDF 渲染等 | 按需创建 |

**站点隔离（Site Isolation）**

Chrome 67 引入了站点隔离功能，确保不同站点的页面运行在不同的 Renderer 进程中。这是对 Spectre 漏洞的重要防御措施，防止恶意网站通过侧信道攻击读取其他网站的数据。`,
      codeExample: `// ==========================================
// 浏览器进程架构示意
// ==========================================

/*
┌─────────────────────────────────────────────────────────────┐
│                     Browser 进程（主进程）                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   UI 线程   │  │ Network 线程 │  │    Storage 线程     │  │
│  │ (地址栏/书签)│  │  (网络请求)  │  │ (Cookie/LocalStorage)│ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ IPC (进程间通信)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Renderer 进程（每个标签页）                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Main 线程  │  │ Worker 线程  │  │   Compositor 线程   │  │
│  │ (JS/DOM/CSS)│  │(Web Workers) │  │    (合成/滚动)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ IPC
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        GPU 进程                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              图形渲染 / WebGL / Canvas               │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
*/

// ----- 查看 Chrome 进程 -----
// 方法1：Chrome 任务管理器
// 菜单 → 更多工具 → 任务管理器
// 或者快捷键 Shift + Esc

// 方法2：命令行查看
// macOS/Linux:
// ps aux | grep -i chrome

// Windows:
// tasklist | findstr chrome

// ----- 理解进程通信 -----
// 当你在地址栏输入 URL 并按回车时：

/*
1. Browser 进程的 UI 线程接收输入
2. UI 线程判断是搜索还是 URL
3. Network 线程发起网络请求
4. 收到响应后，Network 线程检查 Content-Type
5. 如果是 HTML，Browser 进程通知 Renderer 进程
6. Renderer 进程开始解析 HTML、加载资源
7. Renderer 进程完成渲染后，通知 Browser 进程
8. Browser 进程更新 UI（如标签页标题、图标）
*/

// ----- 使用 Performance API 观察渲染 -----
// 在浏览器控制台中运行

// 获取页面加载性能数据
const timing = performance.timing;

console.log('DNS 查询时间:', timing.domainLookupEnd - timing.domainLookupStart, 'ms');
console.log('TCP 连接时间:', timing.connectEnd - timing.connectStart, 'ms');
console.log('请求响应时间:', timing.responseEnd - timing.requestStart, 'ms');
console.log('DOM 解析时间:', timing.domComplete - timing.domLoading, 'ms');
console.log('页面完全加载:', timing.loadEventEnd - timing.navigationStart, 'ms');

// 使用 Performance Observer 监听性能事件
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(\`\${entry.name}: \${entry.startTime.toFixed(2)}ms\`);
  }
});

observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });`,
      keyPoints: [
        'Chrome 采用多进程架构，提高稳定性和安全性',
        'Browser 进程是主进程，负责 UI 和协调其他进程',
        'Renderer 进程负责页面渲染，每个标签页通常有独立的进程',
        '站点隔离确保不同站点的页面在不同进程中运行',
        '进程间通过 IPC 机制通信',
        '理解进程架构有助于性能优化和问题排查'
      ],
      references: [
        { text: 'Inside look at modern web browser (Google)', url: 'https://developer.chrome.com/blog/inside-browser-part1' },
        { text: 'How Browsers Work (MDN)', url: 'https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work' },
        { text: 'Chrome 架构演进', url: 'https://www.chromium.org/developers/design-documents/multi-process-architecture/' }
      ]
    },
    {
      title: '页面渲染流程',
      background: `当浏览器接收到 HTML 文档后，需要经过一系列复杂的步骤才能将其转换为用户看到的像素。这个过程称为"渲染流水线"（Rendering Pipeline）或"关键渲染路径"（Critical Rendering Path）。

理解渲染流程对于前端性能优化至关重要。不同的 CSS 属性变化会触发不同阶段的重新计算，了解这些可以帮助你写出更高效的代码。

渲染流程主要在 Renderer 进程的主线程中执行，但合成和绘制可以在其他线程中进行，这也是为什么 CSS 动画可以很流畅的原因。`,
      content: `**渲染流水线的主要阶段**

1. **解析（Parse）**: HTML → DOM 树，CSS → CSSOM 树
2. **样式计算（Style）**: DOM + CSSOM → 计算每个元素的最终样式
3. **布局（Layout）**: 计算每个元素的位置和大小
4. **分层（Layer）**: 将页面分成多个图层
5. **绘制（Paint）**: 记录绘制指令（不是真正绘制）
6. **合成（Composite）**: 将图层合成为最终图像

**重排（Reflow）vs 重绘（Repaint）**

- **重排**: 元素的几何属性变化（位置、大小），需要重新布局
- **重绘**: 元素的外观变化（颜色、背景），不需要重新布局
- **合成**: 只改变合成属性（transform、opacity），最高效`,
      codeExample: `// ==========================================
// 页面渲染流程详解
// ==========================================

/*
渲染流水线：

HTML ──→ DOM Tree
              │
              ▼
CSS ───→ CSSOM Tree ──→ Render Tree ──→ Layout ──→ Paint ──→ Composite
              │              │            │          │           │
              │              │            │          │           │
           样式解析      样式计算      布局计算    绘制记录     图层合成
*/

// ----- 1. DOM 树构建 -----
// 浏览器逐字节解析 HTML，构建 DOM 树

/*
<html>
  <body>
    <div class="container">
      <h1>Hello</h1>
      <p>World</p>
    </div>
  </body>
</html>

转换为 DOM 树：

Document
└── html
    └── body
        └── div.container
            ├── h1
            │   └── "Hello"
            └── p
                └── "World"
*/

// 使用 JavaScript 访问 DOM
console.log(document.body.children); // HTMLCollection
console.log(document.querySelector('.container')); // Element

// ----- 2. CSSOM 树构建 -----
// CSS 也被解析成树形结构

/*
.container {
  width: 100%;
  padding: 20px;
}

h1 {
  color: blue;
  font-size: 24px;
}

转换为 CSSOM 树，包含所有样式规则
*/

// 使用 JavaScript 访问样式
const element = document.querySelector('h1');
const styles = window.getComputedStyle(element);
console.log(styles.color); // rgb(0, 0, 255)
console.log(styles.fontSize); // 24px

// ----- 3. 布局计算 -----
// 计算每个元素的精确位置和大小

// 获取元素的布局信息
const rect = element.getBoundingClientRect();
console.log('位置:', rect.x, rect.y);
console.log('大小:', rect.width, rect.height);

// 这些属性会触发强制布局（Layout Thrashing）
// 应该避免在循环中读取
const elements = document.querySelectorAll('.item');
elements.forEach(el => {
  // ❌ 不好：每次循环都触发布局
  // el.style.width = el.offsetWidth + 10 + 'px';
});

// ✅ 好：批量读取，批量写入
const widths = Array.from(elements).map(el => el.offsetWidth);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + 'px';
});

// ----- 4. 分层 -----
// 浏览器将页面分成多个图层，便于独立更新

// 这些属性会创建新的图层
/*
- transform: translateZ(0) 或 translate3d()
- will-change: transform
- position: fixed
- video, canvas, iframe 元素
- opacity 动画
*/

// 使用 will-change 提示浏览器创建图层
const animatedElement = document.querySelector('.animated');
// animatedElement.style.willChange = 'transform';

// ----- 5. 绘制 -----
// 记录绘制指令，但不实际绘制

// 在 DevTools 中查看绘制：
// 1. 打开 DevTools → Rendering → Paint flashing
// 2. 绿色区域表示正在重绘的区域

// ----- 6. 合成 -----
// GPU 将各图层合成为最终图像

// 只触发合成的属性（最高效）
/*
- transform
- opacity
*/

// 动画性能对比
// ❌ 触发重排的动画（性能差）
function animateBad() {
  let left = 0;
  setInterval(() => {
    element.style.left = left++ + 'px'; // 触发重排
  }, 16);
}

// ✅ 只触发合成的动画（性能好）
function animateGood() {
  let x = 0;
  function frame() {
    element.style.transform = \`translateX(\${x++}px)\`; // 只触发合成
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ----- 使用 DevTools 分析渲染性能 -----
/*
1. 打开 DevTools → Performance 面板
2. 点击录制按钮
3. 执行要分析的操作
4. 停止录制
5. 查看火焰图，分析各阶段耗时

关键指标：
- Scripting: JavaScript 执行时间
- Rendering: 样式计算和布局时间
- Painting: 绘制时间
- System: 系统开销
- Idle: 空闲时间
*/

// ----- 强制同步布局示例 -----
// 这是一个常见的性能问题

function badLayout() {
  const boxes = document.querySelectorAll('.box');
  
  boxes.forEach(box => {
    // 读取 offsetHeight 会强制浏览器立即计算布局
    const height = box.offsetHeight;
    // 然后修改样式又会使布局失效
    box.style.height = height * 2 + 'px';
    // 下一次循环又要重新计算...
  });
}

function goodLayout() {
  const boxes = document.querySelectorAll('.box');
  
  // 先批量读取
  const heights = Array.from(boxes).map(box => box.offsetHeight);
  
  // 再批量写入
  boxes.forEach((box, i) => {
    box.style.height = heights[i] * 2 + 'px';
  });
}`,
      keyPoints: [
        '渲染流水线：解析 → 样式 → 布局 → 分层 → 绘制 → 合成',
        '重排（Layout）比重绘（Paint）更耗性能',
        'transform 和 opacity 只触发合成，性能最好',
        '避免强制同步布局（Layout Thrashing）',
        '使用 will-change 提示浏览器创建独立图层',
        '使用 DevTools Performance 面板分析渲染性能'
      ],
      references: [
        { text: '渲染性能', url: 'https://web.dev/rendering-performance/' },
        { text: 'CSS Triggers', url: 'https://csstriggers.com/' },
        { text: '避免大型复杂的布局', url: 'https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/' }
      ]
    },
    {
      title: 'Chrome DevTools Protocol (CDP)',
      background: `Chrome DevTools Protocol (CDP) 是 Chrome 浏览器提供的一套调试协议。它允许外部程序通过 WebSocket 连接到浏览器，发送命令和接收事件，从而实现对浏览器的程序化控制。

CDP 是所有高级浏览器自动化工具（如 Playwright、Puppeteer）的底层基础。理解 CDP 可以帮助你：
- 理解自动化工具的工作原理
- 实现自动化工具不支持的高级功能
- 排查自动化脚本的问题

CDP 采用 JSON-RPC 风格的协议，分为多个"域"（Domain），每个域负责特定的功能，如 Page、DOM、Network、Runtime 等。`,
      content: `**CDP 核心概念**

| 概念 | 说明 |
|------|------|
| Domain | 功能域，如 Page、DOM、Network |
| Command | 客户端发送的指令，如 Page.navigate |
| Event | 浏览器发送的通知，如 Page.loadEventFired |
| Session | 与特定 Target 的连接会话 |
| Target | 可调试的目标，如页面、Worker |

**常用 Domain**

- **Page**: 页面导航、截图、PDF 生成
- **DOM**: DOM 树操作、节点查询
- **Network**: 网络请求拦截、修改
- **Runtime**: JavaScript 执行、对象检查
- **Input**: 键盘、鼠标事件模拟
- **Debugger**: 断点、单步执行`,
      codeExample: `// ==========================================
// Chrome DevTools Protocol (CDP) 详解
// ==========================================

// ----- 启动带调试端口的 Chrome -----
/*
macOS:
/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \\
  --remote-debugging-port=9222

Windows:
chrome.exe --remote-debugging-port=9222

Linux:
google-chrome --remote-debugging-port=9222

启动后访问 http://localhost:9222/json 查看可用的调试目标
*/

// ----- 使用 WebSocket 连接 CDP -----
// 这是最底层的连接方式

async function connectCDP() {
  // 获取调试目标列表
  const response = await fetch('http://localhost:9222/json');
  const targets = await response.json();
  
  // 找到页面类型的目标
  const pageTarget = targets.find(t => t.type === 'page');
  
  // 建立 WebSocket 连接
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  
  let messageId = 1;
  
  // 发送命令的辅助函数
  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = messageId++;
      
      const handler = (event) => {
        const message = JSON.parse(event.data);
        if (message.id === id) {
          ws.removeEventListener('message', handler);
          if (message.error) {
            reject(new Error(message.error.message));
          } else {
            resolve(message.result);
          }
        }
      };
      
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  
  ws.onopen = async () => {
    console.log('已连接到 Chrome');
    
    // 启用 Page 域
    await sendCommand('Page.enable');
    
    // 导航到页面
    await sendCommand('Page.navigate', {
      url: 'https://example.com'
    });
    
    // 等待页面加载完成
    // ...
    
    // 执行 JavaScript
    const result = await sendCommand('Runtime.evaluate', {
      expression: 'document.title'
    });
    console.log('页面标题:', result.result.value);
    
    // 截图
    const screenshot = await sendCommand('Page.captureScreenshot', {
      format: 'png'
    });
    console.log('截图 Base64:', screenshot.data.substring(0, 50) + '...');
  };
  
  // 监听事件
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.method) {
      console.log('收到事件:', message.method);
    }
  };
}

// ----- 使用 chrome-remote-interface 库 -----
// 这是一个更方便的 CDP 客户端库

/*
npm install chrome-remote-interface
*/

const CDP = require('chrome-remote-interface');

async function example() {
  // 连接到 Chrome
  const client = await CDP();
  
  // 解构需要的域
  const { Page, Runtime, DOM, Network } = client;
  
  try {
    // 启用需要的域
    await Promise.all([
      Page.enable(),
      Network.enable(),
      DOM.enable(),
    ]);
    
    // 监听网络请求
    Network.requestWillBeSent((params) => {
      console.log('请求:', params.request.url);
    });
    
    // 监听页面加载
    Page.loadEventFired(() => {
      console.log('页面加载完成');
    });
    
    // 导航到页面
    await Page.navigate({ url: 'https://example.com' });
    await Page.loadEventFired();
    
    // 获取 DOM 文档
    const { root } = await DOM.getDocument();
    
    // 查询元素
    const { nodeId } = await DOM.querySelector({
      nodeId: root.nodeId,
      selector: 'h1'
    });
    
    // 获取元素文本
    const { outerHTML } = await DOM.getOuterHTML({ nodeId });
    console.log('H1 内容:', outerHTML);
    
    // 执行 JavaScript
    const result = await Runtime.evaluate({
      expression: \`
        Array.from(document.querySelectorAll('a'))
          .map(a => ({ text: a.textContent, href: a.href }))
      \`,
      returnByValue: true
    });
    console.log('所有链接:', result.result.value);
    
    // 截图
    const { data } = await Page.captureScreenshot({ format: 'png' });
    require('fs').writeFileSync('screenshot.png', Buffer.from(data, 'base64'));
    
  } finally {
    await client.close();
  }
}

// ----- CDP 常用命令示例 -----

// 1. 页面导航
// Page.navigate({ url: 'https://example.com' })

// 2. 等待页面加载
// Page.loadEventFired()

// 3. 执行 JavaScript
// Runtime.evaluate({ expression: 'document.title' })

// 4. 获取 DOM
// DOM.getDocument()
// DOM.querySelector({ nodeId, selector })

// 5. 模拟点击
// Input.dispatchMouseEvent({
//   type: 'mousePressed',
//   x: 100,
//   y: 100,
//   button: 'left',
//   clickCount: 1
// })

// 6. 模拟键盘输入
// Input.dispatchKeyEvent({
//   type: 'keyDown',
//   key: 'Enter'
// })

// 7. 网络拦截
// Network.setRequestInterception({ patterns: [{ urlPattern: '*' }] })
// Network.requestIntercepted((params) => {
//   // 修改或阻止请求
// })

// 8. 截图
// Page.captureScreenshot({ format: 'png', fullPage: true })

// 9. 生成 PDF
// Page.printToPDF({ landscape: false, printBackground: true })

// 10. 设置设备模拟
// Emulation.setDeviceMetricsOverride({
//   width: 375,
//   height: 812,
//   deviceScaleFactor: 3,
//   mobile: true
// })

// ----- 在 Playwright 中使用 CDP -----
import { chromium } from '@playwright/test';

async function playwrightCDP() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 获取 CDP Session
  const cdpSession = await page.context().newCDPSession(page);
  
  // 使用 CDP 命令
  await cdpSession.send('Page.enable');
  
  // 监听 CDP 事件
  cdpSession.on('Page.loadEventFired', () => {
    console.log('CDP: 页面加载完成');
  });
  
  // 执行 CDP 命令
  const { data } = await cdpSession.send('Page.captureScreenshot', {
    format: 'jpeg',
    quality: 80
  });
  
  await browser.close();
}`,
      keyPoints: [
        'CDP 是浏览器自动化的底层协议，Playwright/Puppeteer 都基于它',
        '通过 --remote-debugging-port 启动 Chrome 以启用 CDP',
        'CDP 分为多个 Domain，每个 Domain 负责特定功能',
        'Command 是客户端发送的指令，Event 是浏览器发送的通知',
        '可以在 Playwright 中通过 newCDPSession 访问 CDP',
        '理解 CDP 有助于实现高级自动化功能和问题排查'
      ],
      references: [
        { text: 'CDP 官方文档', url: 'https://chromedevtools.github.io/devtools-protocol/' },
        { text: 'chrome-remote-interface', url: 'https://github.com/cyrus-and/chrome-remote-interface' },
        { text: 'Playwright CDP Session', url: 'https://playwright.dev/docs/api/class-cdpsession' }
      ]
    },
    {
      title: 'DOM 与事件系统',
      background: `DOM（Document Object Model）是 HTML 文档的编程接口，它将文档表示为节点树，允许程序动态访问和修改文档的内容、结构和样式。

对于浏览器自动化来说，理解 DOM 结构和事件系统至关重要。自动化脚本需要：
- 定位页面元素（通过选择器）
- 读取元素内容和属性
- 触发用户交互（点击、输入等）

JavaScript 的事件系统采用"事件冒泡"和"事件捕获"机制，理解这些机制可以帮助你更好地模拟用户交互。`,
      content: `**DOM 节点类型**

| 类型 | nodeType | 说明 |
|------|----------|------|
| Element | 1 | HTML 元素节点 |
| Text | 3 | 文本节点 |
| Comment | 8 | 注释节点 |
| Document | 9 | 文档节点 |
| DocumentFragment | 11 | 文档片段 |

**元素选择器**

- **ID 选择器**: #myId
- **类选择器**: .myClass
- **标签选择器**: div
- **属性选择器**: [data-id="123"]
- **伪类选择器**: :first-child, :nth-child(2)
- **组合选择器**: div.container > p.text`,
      codeExample: `// ==========================================
// DOM 与事件系统详解
// ==========================================

// ----- DOM 树遍历 -----
const element = document.querySelector('.container');

// 父节点
element.parentNode;      // 父节点（可能是任何节点类型）
element.parentElement;   // 父元素节点

// 子节点
element.childNodes;      // 所有子节点（包括文本节点）
element.children;        // 所有子元素节点
element.firstChild;      // 第一个子节点
element.firstElementChild; // 第一个子元素
element.lastChild;       // 最后一个子节点
element.lastElementChild;  // 最后一个子元素

// 兄弟节点
element.previousSibling;        // 前一个兄弟节点
element.previousElementSibling; // 前一个兄弟元素
element.nextSibling;            // 后一个兄弟节点
element.nextElementSibling;     // 后一个兄弟元素

// ----- 元素选择 -----
// 单个元素
document.getElementById('myId');           // 通过 ID
document.querySelector('.myClass');        // 通过 CSS 选择器（第一个匹配）
document.querySelector('[data-id="123"]'); // 通过属性选择器

// 多个元素
document.getElementsByClassName('myClass'); // HTMLCollection（实时）
document.getElementsByTagName('div');       // HTMLCollection（实时）
document.querySelectorAll('.myClass');      // NodeList（静态）

// 复杂选择器
document.querySelector('div.container > ul > li:first-child');
document.querySelectorAll('input[type="text"]:not(:disabled)');

// ----- 元素属性和内容 -----
const el = document.querySelector('#myElement');

// 内容
el.textContent;  // 纯文本内容
el.innerHTML;    // HTML 内容
el.outerHTML;    // 包含元素本身的 HTML

// 属性
el.getAttribute('data-id');        // 获取属性
el.setAttribute('data-id', '123'); // 设置属性
el.removeAttribute('data-id');     // 删除属性
el.hasAttribute('data-id');        // 检查属性

// dataset（data-* 属性）
el.dataset.id;      // 获取 data-id
el.dataset.userId;  // 获取 data-user-id（驼峰命名）

// 类名
el.className;                    // 类名字符串
el.classList.add('active');      // 添加类
el.classList.remove('active');   // 删除类
el.classList.toggle('active');   // 切换类
el.classList.contains('active'); // 检查类

// 样式
el.style.color = 'red';          // 设置内联样式
el.style.backgroundColor = 'blue';
getComputedStyle(el).color;      // 获取计算后的样式

// ----- 事件系统 -----

/*
事件传播的三个阶段：

1. 捕获阶段（Capturing）: 从 window 向下到目标元素
2. 目标阶段（Target）: 到达目标元素
3. 冒泡阶段（Bubbling）: 从目标元素向上到 window

        window
          │
          ▼ 捕获
       document
          │
          ▼
        <html>
          │
          ▼
        <body>
          │
          ▼
        <div>
          │
          ▼
       <button>  ← 目标
          │
          ▲
        <div>
          │
          ▲ 冒泡
        <body>
          │
          ▲
        <html>
          │
          ▲
       document
          │
          ▲
        window
*/

// 添加事件监听器
const button = document.querySelector('button');

// 冒泡阶段监听（默认）
button.addEventListener('click', (event) => {
  console.log('按钮被点击');
  console.log('目标元素:', event.target);
  console.log('当前元素:', event.currentTarget);
});

// 捕获阶段监听
button.addEventListener('click', (event) => {
  console.log('捕获阶段');
}, true); // 第三个参数为 true 表示捕获阶段

// 阻止事件传播
button.addEventListener('click', (event) => {
  event.stopPropagation(); // 阻止冒泡
});

// 阻止默认行为
const link = document.querySelector('a');
link.addEventListener('click', (event) => {
  event.preventDefault(); // 阻止跳转
});

// 事件委托（利用冒泡）
const list = document.querySelector('ul');
list.addEventListener('click', (event) => {
  // 检查点击的是否是 li 元素
  if (event.target.tagName === 'LI') {
    console.log('点击了:', event.target.textContent);
  }
});

// ----- 模拟用户事件 -----

// 创建和触发事件
const clickEvent = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
  clientX: 100,
  clientY: 100
});
element.dispatchEvent(clickEvent);

// 模拟键盘事件
const keyEvent = new KeyboardEvent('keydown', {
  key: 'Enter',
  code: 'Enter',
  bubbles: true
});
element.dispatchEvent(keyEvent);

// 模拟输入
const inputElement = document.querySelector('input');
inputElement.value = 'Hello World';
inputElement.dispatchEvent(new Event('input', { bubbles: true }));
inputElement.dispatchEvent(new Event('change', { bubbles: true }));

// ----- 常用事件类型 -----
/*
鼠标事件:
- click: 点击
- dblclick: 双击
- mousedown/mouseup: 按下/释放
- mousemove: 移动
- mouseenter/mouseleave: 进入/离开（不冒泡）
- mouseover/mouseout: 进入/离开（冒泡）

键盘事件:
- keydown: 按下
- keyup: 释放
- keypress: 按键（已废弃）

表单事件:
- input: 输入变化
- change: 值改变（失焦后）
- submit: 表单提交
- focus/blur: 获得/失去焦点

触摸事件:
- touchstart: 触摸开始
- touchmove: 触摸移动
- touchend: 触摸结束

其他:
- scroll: 滚动
- resize: 窗口大小变化
- load: 加载完成
- DOMContentLoaded: DOM 解析完成
*/

// ----- MutationObserver 监听 DOM 变化 -----
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log('DOM 变化类型:', mutation.type);
    console.log('变化的节点:', mutation.target);
    
    if (mutation.type === 'childList') {
      console.log('添加的节点:', mutation.addedNodes);
      console.log('删除的节点:', mutation.removedNodes);
    }
    
    if (mutation.type === 'attributes') {
      console.log('变化的属性:', mutation.attributeName);
    }
  });
});

// 开始观察
observer.observe(document.body, {
  childList: true,      // 监听子节点变化
  subtree: true,        // 监听所有后代节点
  attributes: true,     // 监听属性变化
  characterData: true,  // 监听文本内容变化
});

// 停止观察
// observer.disconnect();`,
      keyPoints: [
        'DOM 是 HTML 文档的树形编程接口',
        '使用 querySelector/querySelectorAll 进行元素选择',
        '事件传播分为捕获、目标、冒泡三个阶段',
        '事件委托利用冒泡机制提高性能',
        '使用 dispatchEvent 可以模拟用户事件',
        'MutationObserver 用于监听 DOM 变化'
      ],
      references: [
        { text: 'DOM 介绍 (MDN)', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction' },
        { text: '事件参考 (MDN)', url: 'https://developer.mozilla.org/zh-CN/docs/Web/Events' },
        { text: 'MutationObserver', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver' }
      ]
    }
  ],
  homework: [
    {
      title: '观察浏览器进程',
      description: '打开 Chrome 任务管理器，访问多个不同网站，观察进程的创建和资源使用情况。记录你的发现。',
      hints: ['使用 Shift+Esc 打开任务管理器', '注意观察 Renderer 进程的数量变化', '比较不同网站的内存使用']
    },
    {
      title: '使用 CDP 截图',
      description: '使用 chrome-remote-interface 库连接到 Chrome，实现自动导航到指定网站并截图保存的功能。',
      hints: ['先启动带调试端口的 Chrome', '使用 Page.navigate 和 Page.captureScreenshot', '将 Base64 数据保存为图片文件']
    },
    {
      title: '分析页面渲染性能',
      description: '使用 Chrome DevTools 的 Performance 面板，分析一个复杂网页的渲染性能，找出性能瓶颈。',
      hints: ['录制页面加载过程', '查看 Main 线程的活动', '识别长任务（Long Tasks）']
    }
  ]
};
