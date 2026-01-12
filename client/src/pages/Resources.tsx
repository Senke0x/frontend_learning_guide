import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Code, Link as LinkIcon } from 'lucide-react';

const resources = [
  {
    category: '浏览器自动化',
    icon: '🌐',
    items: [
      {
        title: 'Playwright官方文档',
        description: '完整的Playwright API文档和最佳实践指南',
        url: 'https://playwright.dev/docs/intro',
        tags: ['官方文档', 'API参考'],
      },
      {
        title: 'Stagehand官方文档',
        description: 'AI驱动的浏览器自动化框架文档',
        url: 'https://docs.stagehand.dev/',
        tags: ['官方文档', 'AI自动化'],
      },
      {
        title: 'Chrome DevTools Protocol',
        description: '浏览器底层协议的官方文档',
        url: 'https://chromedevtools.github.io/devtools-protocol/',
        tags: ['官方文档', '底层协议'],
      },
      {
        title: 'Browserbase - 云端浏览器',
        description: '云端浏览器服务，支持Stagehand集成',
        url: 'https://www.browserbase.com/',
        tags: ['云服务', 'BaaS'],
      },
    ],
  },
  {
    category: 'TypeScript与前端',
    icon: '📘',
    items: [
      {
        title: 'TypeScript官方手册',
        description: '完整的TypeScript语言文档',
        url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
        tags: ['官方文档', '类型系统'],
      },
      {
        title: '5分钟入门TypeScript',
        description: '快速学习TypeScript基础概念',
        url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html',
        tags: ['快速入门', '基础'],
      },
      {
        title: 'React官方文档',
        description: 'React框架的完整文档',
        url: 'https://react.dev/',
        tags: ['官方文档', '框架'],
      },
    ],
  },
  {
    category: 'Next.js与全栈开发',
    icon: '⚡',
    items: [
      {
        title: 'Next.js官方学习课程',
        description: '从零开始学习Next.js的完整课程',
        url: 'https://nextjs.org/learn',
        tags: ['官方教程', '全栈'],
      },
      {
        title: 'Next.js App Router文档',
        description: '新一代路由系统的完整文档',
        url: 'https://nextjs.org/docs/app',
        tags: ['官方文档', '路由'],
      },
      {
        title: 'Vercel官方文档',
        description: 'Vercel部署平台的完整文档',
        url: 'https://vercel.com/docs',
        tags: ['官方文档', '部署'],
      },
      {
        title: '在Vercel上部署Next.js',
        description: '部署Next.js应用的详细指南',
        url: 'https://nextjs.org/docs/deployment',
        tags: ['部署指南', '最佳实践'],
      },
    ],
  },
  {
    category: 'AI与Model Context Protocol',
    icon: '🤖',
    items: [
      {
        title: 'Model Context Protocol官网',
        description: 'MCP标准的官方网站和文档',
        url: 'https://modelcontextprotocol.io/',
        tags: ['官方文档', 'AI标准'],
      },
      {
        title: 'Browser MCP项目',
        description: '浏览器自动化的MCP实现',
        url: 'https://browsermcp.io/',
        tags: ['开源项目', 'MCP实现'],
      },
      {
        title: 'Stagehand与Playwright的演进',
        description: '深入了解AI驱动自动化的发展',
        url: 'https://www.browserbase.com/blog/stagehand-playwright-evolution-browser-automation',
        tags: ['博客文章', '技术分析'],
      },
    ],
  },
  {
    category: '云端浏览器服务',
    icon: '☁️',
    items: [
      {
        title: 'HyperBrowser',
        description: '高性能的云端浏览器服务',
        url: 'https://www.hyperbrowser.ai/',
        tags: ['云服务', 'BaaS'],
      },
      {
        title: 'OnKernel',
        description: '云端浏览器自动化平台',
        url: 'https://www.onkernel.com/',
        tags: ['云服务', 'BaaS'],
      },
    ],
  },
  {
    category: '开源项目与工具',
    icon: '🛠️',
    items: [
      {
        title: 'Playwright GitHub仓库',
        description: '查看Playwright源代码和贡献',
        url: 'https://github.com/microsoft/playwright',
        tags: ['开源', 'GitHub'],
      },
      {
        title: 'shadcn/ui',
        description: '高质量的React组件库',
        url: 'https://ui.shadcn.com/',
        tags: ['组件库', 'React'],
      },
      {
        title: 'Tailwind CSS',
        description: '实用优先的CSS框架',
        url: 'https://tailwindcss.com/',
        tags: ['CSS框架', '样式'],
      },
    ],
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">前端学习指南</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">学习资源</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">文档</Button>
            <Button variant="ghost" size="sm">资源</Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
              开始学习
            </Button>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <section className="container py-20">
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">学习资源汇总</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">精选的官方文档、教程和工具链接</p>
          </div>

          {resources.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{section.icon}</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{section.category}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item, itemIdx) => (
                  <Card key={itemIdx} className="border-0 bg-white dark:bg-slate-800 hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription className="mt-2">{item.description}</CardDescription>
                        </div>
                        <ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, tagIdx) => (
                          <Badge key={tagIdx} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        访问链接
                        <LinkIcon className="w-4 h-4" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 学习建议 */}
      <section className="container py-20">
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl">💡 学习建议</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">1. 按照学习路线进行</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  按照7天的学习计划循序渐进，每天深入一个主题，确保基础扎实。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">2. 多查阅官方文档</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  官方文档是最权威的学习资源，遇到问题时首先查阅官方文档。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">3. 动手实践代码示例</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  每个概念都要通过代码实践来加深理解，不要只是阅读。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">4. 完成课后作业</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  课后作业是检验学习效果的最好方式，务必认真完成。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">5. 加入社区讨论</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  在GitHub、Discord等社区中与其他开发者交流，分享经验和问题。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950">
        <div className="container text-center text-sm text-slate-600 dark:text-slate-400">
          <p>© 2025 前端学习指南. 由 Manus AI 精心打造。</p>
        </div>
      </footer>
    </div>
  );
}
