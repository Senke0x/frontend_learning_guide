import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Code, CheckCircle2, AlertCircle } from 'lucide-react';

interface DayContentProps {
  dayNumber: number;
}

const dayContents = {
  1: {
    title: '浏览器基础与自动化原理',
    subtitle: '深入浏览器底层，建立从后端到前端的思维桥梁',
    sections: [
      {
        title: '现代浏览器架构',
        content: '现代浏览器采用多进程架构，包括浏览器进程、渲染进程、GPU进程等。这与后端分布式系统的设计思想不谋而合。',
        topics: ['浏览器进程模型', '进程隔离', '渲染流水线'],
      },
      {
        title: 'Chrome DevTools Protocol',
        content: 'CDP是一个低级的JSON-RPC协议，允许开发工具对浏览器进行检测、调试和分析。它是所有高级自动化框架的基石。',
        topics: ['协议概念', '域和命令', '事件监听'],
      },
      {
        title: '自动化框架三层架构',
        content: '从底层CDP到中层Playwright再到上层Stagehand，每一层都提供了不同的抽象程度和易用性。',
        topics: ['CDP底层控制', 'Playwright高级API', 'Stagehand AI增强'],
      },
    ],
    homework: [
      '探索CDP通信：打开Chrome DevTools，启用Protocol Monitor，观察至少5个不同的CDP事件',
      '编写CDP脚本：使用CDP导航到GitHub，搜索Playwright，并截图保存',
    ],
  },
  2: {
    title: 'Playwright框架精通',
    subtitle: '现代Web自动化利器，掌握核心API和最佳实践',
    sections: [
      {
        title: 'Playwright核心设计',
        content: 'Browser、Context、Page三层结构确保了测试的隔离性和稳定性。自动等待机制从根本上消除了手动超时的需要。',
        topics: ['三层结构', '自动等待', 'Web-first断言'],
      },
      {
        title: 'Locators与Actions',
        content: 'Playwright通过Locator对象定位元素，支持自动等待和严格模式。这是推荐的元素定位方式。',
        topics: ['Locator定位', '自动等待机制', '严格模式'],
      },
      {
        title: '调试与追踪',
        content: 'Playwright Inspector和Trace Viewer提供了强大的可视化调试工具，帮助快速定位和解决问题。',
        topics: ['Inspector调试', 'Trace Viewer分析', '性能监控'],
      },
    ],
    homework: [
      '完善Airbnb搜索脚本：提取前5个房源的价格和评分，保存为JSON',
      '使用Page Object Model重构：创建HomePage和SearchPage类，实现代码复用',
    ],
  },
  3: {
    title: 'TypeScript核心实践',
    subtitle: '拥抱类型安全，为大型项目奠定基础',
    sections: [
      {
        title: '为什么选择TypeScript',
        content: 'TypeScript为JavaScript带来了静态类型系统，使得代码在编译阶段就能发现大量潜在错误，极大地提升了代码质量。',
        topics: ['类型检查', '编译时错误发现', 'IDE智能提示'],
      },
      {
        title: '接口与泛型',
        content: 'Interface定义对象的形状，Generics创建可重用的组件。这两个特性是构建复杂类型系统的基石。',
        topics: ['接口定义', '泛型函数', '类型约束'],
      },
      {
        title: '应用于自动化脚本',
        content: '将TypeScript应用于Playwright脚本，使得数据提取和类型转换变得更加安全和可靠。',
        topics: ['类型安全的提取', '数据验证', '错误处理'],
      },
    ],
    homework: [
      '创建类型定义文件：为Airbnb项目定义SearchParameters、Listing、Host等接口',
      '重构POM：使用TypeScript重写Page Object Model，添加完整的类型注解',
    ],
  },
  4: {
    title: '全栈应用开发 — Next.js框架入门',
    subtitle: '从前端到后端，构建完整的Web应用',
    sections: [
      {
        title: 'Next.js框架概览',
        content: 'Next.js是一个基于React的全栈框架，提供了SSR、SSG、API路由等功能，让你可以在同一个项目中编写前后端代码。',
        topics: ['框架特性', '服务器渲染', '静态生成'],
      },
      {
        title: 'Server vs Client Components',
        content: '服务器组件在服务器上渲染，可以直接访问数据库。客户端组件在浏览器中运行，可以处理交互。两者的结合提供了最大的灵活性。',
        topics: ['服务器组件', '客户端组件', '数据传递'],
      },
      {
        title: 'API路由与数据获取',
        content: '在Next.js中创建API路由就像编写后端API一样简单。支持所有HTTP方法，并可以轻松集成数据库。',
        topics: ['Route Handlers', 'HTTP方法', '数据库集成'],
      },
    ],
    homework: [
      '初始化Next.js项目：创建基础的项目结构和路由',
      '构建搜索功能：创建搜索表单、API端点和结果页面',
    ],
  },
  5: {
    title: 'AI驱动自动化 — Stagehand与智能工作流',
    subtitle: '引入AI能力，构建更智能的自动化系统',
    sections: [
      {
        title: 'Stagehand设计哲学',
        content: 'Stagehand在Playwright和纯AI Agent之间找到了平衡点，提供了四个核心原语让你灵活地引入AI。',
        topics: ['Act操作', 'Extract提取', 'Observe探索', 'Agent自主'],
      },
      {
        title: '四个核心原语',
        content: 'Act用自然语言执行操作，Extract提取结构化数据，Observe发现可能的操作，Agent完成整个工作流。',
        topics: ['自然语言指令', '结构化数据提取', '页面探索', '工作流自动化'],
      },
      {
        title: '混合使用与最佳实践',
        content: '将Playwright的精确控制与Stagehand的AI能力结合，可以构建既稳定又灵活的自动化系统。',
        topics: ['混合方案', 'Prompt设计', '错误处理'],
      },
    ],
    homework: [
      '使用Stagehand重写Airbnb脚本：使用Act和Extract API完成搜索和数据提取',
      '创建多步骤Agent：设计一个复杂的工作流，如搜索、比较、分析',
    ],
  },
  6: {
    title: '云端部署与扩展 — MCP与可扩展架构',
    subtitle: '从本地到云端，构建可扩展的自动化平台',
    sections: [
      {
        title: '云端浏览器服务',
        content: '云端浏览器服务（如Browserbase）提供了"浏览器即服务"，解决了本地资源消耗和扩展性问题。',
        topics: ['BaaS概念', '云端基础设施', '成本优化'],
      },
      {
        title: 'Model Context Protocol',
        content: 'MCP是一个开放标准，统一了AI模型与外部工具的通信方式，使得任何AI应用都能调用你的自动化工具。',
        topics: ['MCP标准', '工具定义', 'AI集成'],
      },
      {
        title: 'Vercel部署与无服务器',
        content: 'Vercel提供了无缝的Next.js部署体验，自动处理扩展和优化，让你专注于业务逻辑。',
        topics: ['无服务器函数', '边缘计算', '自动扩展'],
      },
    ],
    homework: [
      '注册云浏览器服务：获取API Key并配置环境变量',
      '部署到Vercel：将Next.js应用部署到Vercel并配置环境变量',
    ],
  },
  7: {
    title: '综合实战项目 — 构建生产级应用',
    subtitle: '整合所有知识，构建完整的Web自动化平台',
    sections: [
      {
        title: '项目架构设计',
        content: '设计一个可扩展的异步任务处理系统，包括前端界面、后端API、任务队列和后台Worker。',
        topics: ['系统设计', '异步处理', '任务队列'],
      },
      {
        title: '核心实现',
        content: '实现创建搜索任务的API、后台Worker处理任务、前端轮询任务状态等核心功能。',
        topics: ['API实现', 'Worker设计', '状态管理'],
      },
      {
        title: '部署与监控',
        content: '将完整的应用部署到生产环境，集成日志和监控服务，确保系统稳定运行。',
        topics: ['生产部署', '日志监控', '性能优化'],
      },
    ],
    homework: [
      '完成最终项目：构建一个完整的Airbnb房源搜索和分析平台',
      '部署到生产：将应用部署到Vercel或其他云平台',
    ],
  },
};

export default function DayContent({ dayNumber }: DayContentProps) {
  const content = dayContents[dayNumber as keyof typeof dayContents];

  if (!content) {
    return (
      <Card className="border-0 bg-white dark:bg-slate-800 p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">课程内容加载中...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge className="mb-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                第{dayNumber}天
              </Badge>
              <CardTitle className="text-2xl">{content.title}</CardTitle>
              <CardDescription className="text-base mt-2">{content.subtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">课程内容</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">代码示例</span>
          </TabsTrigger>
          <TabsTrigger value="homework" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">课后作业</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {content.sections.map((section, idx) => (
            <Card key={idx} className="border-0 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 dark:text-slate-300">{section.content}</p>
                <div className="flex flex-wrap gap-2">
                  {section.topics.map((topic, topicIdx) => (
                    <Badge key={topicIdx} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card className="border-0 bg-slate-900 text-slate-100 p-6 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              <code>{`// 第${dayNumber}天的代码示例
// 完整的代码示例请访问官方文档

// 示例：基础框架
async function example() {
  // 核心逻辑实现
  console.log('第${dayNumber}天学习内容');
}

example();`}</code>
            </pre>
          </Card>
          <Card className="border-0 bg-blue-50 dark:bg-blue-900/20 p-4 border-l-4 border-blue-500">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300">提示</p>
                <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                  点击下方的"查看完整课程"按钮可以访问详细的代码示例和完整的学习资料。
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="homework" className="space-y-4">
          {content.homework.map((task, idx) => (
            <Card key={idx} className="border-0 bg-white dark:bg-slate-800">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 flex-1">{task}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
