import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function About() {
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
              <p className="text-xs text-slate-600 dark:text-slate-400">关于本指南</p>
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
          {/* 介绍 */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                从后端到前端：7天全栈学习指南
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                为C++/Java后端开发者量身定制的完整前端学习方案
              </p>
            </div>

            <Card className="border-0 bg-white dark:bg-slate-800">
              <CardContent className="pt-6">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  对于拥有C++或Java等后端开发背景的工程师来说，转向前端开发既是机遇也是挑战。后端开发的严谨逻辑、分层架构思想和对系统性能的关注，都为学习现代前端技术栈奠定了坚实的基础。本指南旨在为您量身打造一个为期7天的学习路径，将您熟悉的后端概念与前端技术进行类比，帮助您快速、高效地掌握从浏览器自动化到全栈Web应用开发的核心技能。
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 学习目标 */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">学习目标</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                '理解现代浏览器的架构和工作原理',
                '掌握浏览器自动化的三个层次（CDP、Playwright、Stagehand）',
                '深入学习TypeScript的类型系统和最佳实践',
                '构建完整的Next.js全栈应用',
                '集成AI能力构建智能自动化系统',
                '部署和扩展Web应用到生产环境',
              ].map((goal, idx) => (
                <Card key={idx} className="border-0 bg-white dark:bg-slate-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700 dark:text-slate-300">{goal}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 核心内容 */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">7天学习路线</h2>
            <div className="space-y-3">
              {[
                {
                  day: 1,
                  title: '浏览器基础与自动化原理',
                  topics: ['浏览器进程模型', 'Chrome DevTools Protocol', '自动化框架对比'],
                },
                {
                  day: 2,
                  title: 'Playwright框架精通',
                  topics: ['自动等待机制', 'Web-first断言', 'Page Object模式'],
                },
                {
                  day: 3,
                  title: 'TypeScript核心实践',
                  topics: ['类型系统', '接口与泛型', '类型安全的自动化'],
                },
                {
                  day: 4,
                  title: '全栈应用开发 — Next.js框架',
                  topics: ['App Router', 'Server/Client组件', 'API路由'],
                },
                {
                  day: 5,
                  title: 'AI驱动自动化 — Stagehand',
                  topics: ['Act/Extract/Observe/Agent', '混合自动化', 'AI Agent设计'],
                },
                {
                  day: 6,
                  title: '云端部署与扩展',
                  topics: ['云端浏览器', 'Model Context Protocol', 'Vercel部署'],
                },
                {
                  day: 7,
                  title: '综合实战项目',
                  topics: ['完整项目架构', '异步任务处理', '生产部署'],
                },
              ].map((item) => (
                <Card key={item.day} className="border-0 bg-white dark:bg-slate-800 hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 flex-shrink-0">
                          第{item.day}天
                        </Badge>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{item.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-12">
                        {item.topics.map((topic, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 核心特性 */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">为什么选择这个学习指南</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: '针对性强',
                  description: '基于C++/Java后端背景，通过类比帮助快速理解前端概念，避免学习曲线陡峭。',
                },
                {
                  title: '代码驱动',
                  description: '30+个实战代码示例，每个概念都有可运行的代码，学以致用。',
                },
                {
                  title: '快速上手',
                  description: '7天从零到能独立开发生产级应用，高效利用时间。',
                },
                {
                  title: '完整体系',
                  description: '从底层原理到上层框架，从前端到后端，构建完整的知识体系。',
                },
                {
                  title: '实战导向',
                  description: '每天都有课后作业和实战项目，确保学以致用。',
                },
                {
                  title: '社区支持',
                  description: '完整的学习资源链接和活跃的开发者社区，不怕遇到问题。',
                },
              ].map((feature, idx) => (
                <Card key={idx} className="border-0 bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 学习资源 */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">学习资源</h2>
            <Card className="border-0 bg-white dark:bg-slate-800">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">官方文档</h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>• Playwright: <a href="https://playwright.dev/" className="text-blue-600 hover:underline">https://playwright.dev/</a></li>
                      <li>• Stagehand: <a href="https://docs.stagehand.dev/" className="text-blue-600 hover:underline">https://docs.stagehand.dev/</a></li>
                      <li>• TypeScript: <a href="https://www.typescriptlang.org/" className="text-blue-600 hover:underline">https://www.typescriptlang.org/</a></li>
                      <li>• Next.js: <a href="https://nextjs.org/" className="text-blue-600 hover:underline">https://nextjs.org/</a></li>
                      <li>• Chrome DevTools Protocol: <a href="https://chromedevtools.github.io/devtools-protocol/" className="text-blue-600 hover:underline">https://chromedevtools.github.io/devtools-protocol/</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">云端服务</h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>• Browserbase: <a href="https://www.browserbase.com/" className="text-blue-600 hover:underline">https://www.browserbase.com/</a></li>
                      <li>• Vercel: <a href="https://vercel.com/" className="text-blue-600 hover:underline">https://vercel.com/</a></li>
                      <li>• Model Context Protocol: <a href="https://modelcontextprotocol.io/" className="text-blue-600 hover:underline">https://modelcontextprotocol.io/</a></li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">准备好开始你的前端之旅了吗？</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                无论你是后端工程师还是全栈开发者，这份指南都能帮助你快速掌握现代前端开发的核心技能。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  立即开始学习 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  查看完整课程
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">关于</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-600">关于本指南</a></li>
                <li><a href="#" className="hover:text-blue-600">学习路线</a></li>
                <li><a href="#" className="hover:text-blue-600">常见问题</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">资源</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-600">官方文档</a></li>
                <li><a href="#" className="hover:text-blue-600">代码示例</a></li>
                <li><a href="#" className="hover:text-blue-600">社区讨论</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">技术栈</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-600">Playwright</a></li>
                <li><a href="#" className="hover:text-blue-600">Next.js</a></li>
                <li><a href="#" className="hover:text-blue-600">TypeScript</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">联系</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-600">GitHub</a></li>
                <li><a href="#" className="hover:text-blue-600">Discord</a></li>
                <li><a href="#" className="hover:text-blue-600">反馈</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>© 2025 前端学习指南. 由 Manus AI 精心打造。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
