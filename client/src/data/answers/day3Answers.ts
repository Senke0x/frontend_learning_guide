import type { DayAnswers } from '../answersTypes';

export const day3Answers: DayAnswers = {
  day: 3,
  title: '浏览器架构与 CDP 基础',
  answers: [
    {
      homeworkIndex: 0,
      title: '观察浏览器进程',
      explanation: `## 思路说明

1. 打开 Chrome 任务管理器（Shift+Esc），在新开/关闭标签页、打开 DevTools 时观察 Renderer/Utility/Extension 进程变化。
2. 记录 CPU/内存数字，理解同站点隔离、跨站点多进程策略。`,
      code: `// 记录要点（示例）
- 访问 https://example.com 与 https://google.com 会产生不同 Renderer 进程。
- 打开 DevTools 会新增 Utility/DevTools 进程。
- 使用 iframe 跨站时，会看到额外的 Renderer（站点隔离）。`,
      language: 'typescript',
      testCases: [
        {
          input: '多标签页同域',
          expected: '大概率复用同一 Renderer（同站点隔离策略）',
          code: '打开同一域名的多个标签页，观察 Renderer PID 是否一致'
        },
        {
          input: '跨站 iframe',
          expected: '出现额外 Renderer，体现站点隔离',
          code: '在 example.com 中嵌入 youtube iframe，再观察任务管理器'
        },
      ],
      keyInsights: [
        'Chrome 采用多进程架构，站点隔离保障安全',
        'DevTools/扩展各自占进程，避免互相干扰',
        '观察 PID 变化有助于理解资源开销与隔离模型',
      ],
      relatedConcepts: ['Renderer 进程', '站点隔离', '任务管理器'],
    },
    {
      homeworkIndex: 1,
      title: '使用 CDP 截图',
      explanation: `## 思路说明

1. 先启动带远程调试端口的 Chrome：\`google-chrome --remote-debugging-port=9222\`
2. 使用 chrome-remote-interface 连接，开启 Page 域，导航并截图。`,
      code: `// screenshot.mjs
import CDP from 'chrome-remote-interface';
import { writeFileSync } from 'node:fs';

async function main() {
  const client = await CDP({ target: 'ws://localhost:9222' });
  const { Page, Runtime } = client;

  await Page.enable();
  await Page.navigate({ url: 'https://github.com' });
  await Page.loadEventFired();

  // 等待一点时间确保渲染完成
  await Runtime.evaluate({ expression: 'new Promise(r => setTimeout(r, 1000))' });

  const { data } = await Page.captureScreenshot({ format: 'png', fullPage: true });
  writeFileSync('github.png', Buffer.from(data, 'base64'));

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});`,
      language: 'typescript',
      testCases: [
        {
          input: '运行脚本',
          expected: '生成 github.png',
          code: `node screenshot.mjs`
        },
        {
          input: '目标未启动',
          expected: '连接失败，提示 ECONNREFUSED',
          code: `node screenshot.mjs # 未启动 --remote-debugging 时`
        },
      ],
      keyInsights: [
        'CDP 是底层协议，需先启用远程调试端口',
        'Page.enable + Page.navigate + Page.captureScreenshot 是最小闭环',
        'Runtime.evaluate 可用于等待或注入脚本',
      ],
      relatedConcepts: ['CDP', 'chrome-remote-interface', '截图'],
    },
    {
      homeworkIndex: 2,
      title: '分析页面渲染性能',
      explanation: `## 思路说明

1. 使用 Performance 面板录制页面加载，关注 Main 线程长任务和 Layout/Style 时间。
2. 查找大的 JS bundle、强制同步布局或无意义的 reflow。`,
      code: `// 检查项清单
- 录制后查看 Summary，关注 Scripting/Rendering/Painting 占比
- 在 Main 线程查找 >50ms 的长任务，定位来源文件
- 打开 Screenshots 与 Flame Chart 对齐关键帧
- 利用 Coverage 面板找出未使用的 CSS/JS`,
      language: 'typescript',
      testCases: [
        {
          input: '录制复杂页面',
          expected: '识别至少 1 个长任务 >50ms',
          code: 'Performance 录制后在 Flame Chart 过滤 Duration >50ms'
        },
        {
          input: '开启 Screenshots',
          expected: '关键帧与渲染时间线同步',
          code: '在 Performance 右上角勾选 Screenshots 再录制'
        },
      ],
      keyInsights: [
        '长任务是卡顿根源，需切分或延迟',
        'CSS/JS 体积过大可用 Coverage 与 code-splitting 解决',
        '结合 Screenshots 可定位视觉卡顿点',
      ],
      relatedConcepts: ['Performance 面板', '长任务', '覆盖率'],
    },
  ],
};
