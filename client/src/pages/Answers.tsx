import { useMemo } from 'react';
import { allAnswers } from '@/data/answers';
import { courseContent, type DayContent } from '@/data/courseContent';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { CodeBlock } from '@/components/CodeBlock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle2, ClipboardList, Link as LinkIcon, ShieldCheck, FileCode2, Lightbulb, ListChecks } from 'lucide-react';

const courseByDay = Object.fromEntries(courseContent.map((day) => [day.day, day])) as Record<number, DayContent>;

const safeSteps = [
  {
    title: '本地预览',
    command: 'pnpm install && pnpm dev --host',
    note: '打开 http://localhost:3000 浏览答案与课程内容',
  },
  {
    title: '类型检查',
    command: 'pnpm check',
    note: '保证 TS/路径别名配置无误',
  },
  {
    title: '生产构建',
    command: 'pnpm build',
    note: '生成 dist/ 静态文件与 server bundle，用 pnpm start 预览',
  },
];

export default function Answers() {
  const dayAnchors = useMemo(
    () => allAnswers.map((item) => ({ href: `#day-${item.day}`, label: `Day ${item.day}: ${item.title}` })),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">前端学习指南</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">答案参考与调试指引</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <a href="/">回到课程</a>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <a href="/resources">学习资源</a>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container py-12 space-y-8">
        {/* 介绍 */}
        <section className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">每日作业答案</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                覆盖 Day 0–7 的思路讲解、注释代码、测试用例与关键要点，方便对照自查。
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <a href="/#course">返回课程目录</a>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <a href="#safe-run">安全运行指引</a>
              </Button>
            </div>
          </div>
          <Card className="border-0 bg-white/90 dark:bg-slate-800/80 shadow-sm">
            <CardContent className="pt-6">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {dayAnchors.map((anchor) => (
                  <a
                    key={anchor.href}
                    href={anchor.href}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-blue-500 hover:shadow transition-colors bg-white dark:bg-slate-800"
                  >
                    <LinkIcon className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-200">{anchor.label}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 安全运行/调试 */}
        <section id="safe-run" className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">安全编译 / 调试 / 使用</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {safeSteps.map((item) => (
              <Card key={item.title} className="border-0 bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.note}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={item.command} language="bash" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 答案列表 */}
        <section className="space-y-6">
          {allAnswers.map((day) => {
            const meta = courseByDay[day.day];
            return (
              <Card key={day.day} id={`day-${day.day}`} className="border-0 bg-white dark:bg-slate-800 shadow-sm">
                <CardHeader className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      第 {day.day} 天
                    </Badge>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{day.title}</h3>
                    {meta ? (
                      <span className="text-sm text-slate-600 dark:text-slate-400">{meta.subtitle}</span>
                    ) : null}
                  </div>
                  {meta?.overview ? (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <MarkdownRenderer content={meta.overview.split('\n').slice(0, 2).join('\n')} />
                    </div>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-6">
                  {day.answers.map((answer, idx) => {
                    const homework = meta?.homework?.[answer.homeworkIndex];
                    return (
                      <div
                        key={`${day.day}-${answer.homeworkIndex}-${idx}`}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3"
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                            作业 {answer.homeworkIndex + 1}
                          </Badge>
                          <p className="font-semibold text-slate-900 dark:text-white">{answer.title}</p>
                          {homework ? (
                            <span className="text-sm text-slate-600 dark:text-slate-400">题目：{homework.title}</span>
                          ) : null}
                        </div>
                        {homework?.description ? (
                          <p className="text-sm text-slate-600 dark:text-slate-400">要求：{homework.description}</p>
                        ) : null}

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            思路讲解
                          </div>
                          <MarkdownRenderer content={answer.explanation} />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                            <FileCode2 className="w-4 h-4 text-blue-500" />
                            注释代码
                          </div>
                          <CodeBlock code={answer.code} language={answer.language} showLineNumbers />
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                              <ClipboardList className="w-4 h-4 text-emerald-500" />
                              测试用例
                            </div>
                            <div className="space-y-2">
                              {answer.testCases.map((tc, tcIdx) => (
                                <Card key={tcIdx} className="border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                      <ListChecks className="w-4 h-4 text-emerald-500" />
                                      {tc.input}
                                    </CardTitle>
                                    <CardDescription>期望：{tc.expected}</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <CodeBlock code={tc.code} language={answer.language} />
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                关键要点
                              </div>
                              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                                {answer.keyInsights.map((point, pointIdx) => (
                                  <li key={pointIdx}>{point}</li>
                                ))}
                              </ul>
                            </div>
                            {answer.relatedConcepts && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                  <BookOpen className="w-4 h-4 text-indigo-500" />
                                  相关概念
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {answer.relatedConcepts.map((concept, cIdx) => (
                                    <Badge key={cIdx} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                      {concept}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
}
