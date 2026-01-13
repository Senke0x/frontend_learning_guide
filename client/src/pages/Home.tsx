'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink, BookOpen, Code, Lightbulb, CheckCircle2 } from 'lucide-react';
import { courseContent, courseOverview } from '@/data/courseContent';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { CodeBlock } from '@/components/CodeBlock';

export default function Home() {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">前端学习指南</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">从后端到全栈 AI Agent 开发</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                {courseOverview.title}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                {courseOverview.subtitle}
              </p>
            </div>
            <div className="max-w-3xl">
              <MarkdownRenderer content={courseOverview.description} />
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {courseOverview.highlights.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{item.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 pt-2">
              {courseOverview.techStack.map((tech, idx) => (
                <Badge key={idx} variant="secondary" className="px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Course Content */}
          <div id="course" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">课程内容</h2>
            
            {courseContent.map((day) => (
              <Card 
                key={day.day} 
                className="border-0 bg-white dark:bg-slate-800 overflow-hidden hover:shadow-lg transition-all"
              >
                <CardHeader 
                  className="pb-3 cursor-pointer"
                  onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          第 {day.day} 天
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl text-slate-900 dark:text-white">
                        {day.title}
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        {day.subtitle}
                      </CardDescription>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {expandedDay === day.day ? (
                        <ChevronUp className="w-6 h-6 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {expandedDay === day.day && (
                  <CardContent className="space-y-6 pt-0">
                    {/* Overview */}
                    {day.overview && (
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                        <MarkdownRenderer content={day.overview} />
                      </div>
                    )}

                    {/* Sections */}
                    {day.sections.map((section, sectionIdx) => {
                      const sectionKey = `${day.day}-${sectionIdx}`;
                      const isExpanded = expandedSection === sectionKey;

                      return (
                        <div key={sectionKey} className="border-t border-slate-200 dark:border-slate-700 pt-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedSection(isExpanded ? null : sectionKey);
                            }}
                            className="w-full text-left flex items-center justify-between hover:opacity-70 transition-opacity"
                          >
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {sectionIdx + 1}. {section.title}
                            </h3>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="mt-4 space-y-6">
                              {/* Background */}
                              {section.background && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-500" />
                                    背景介绍
                                  </h4>
                                  <div className="pl-6">
                                    <MarkdownRenderer content={section.background} />
                                  </div>
                                </div>
                              )}

                              {/* Content */}
                              {section.content && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-500" />
                                    详细内容
                                  </h4>
                                  <div className="pl-6">
                                    <MarkdownRenderer content={section.content} />
                                  </div>
                                </div>
                              )}

                              {/* Code Example */}
                              {section.codeExample && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Code className="w-4 h-4 text-green-500" />
                                    代码示例
                                  </h4>
                                  <CodeBlock code={section.codeExample} />
                                </div>
                              )}

                              {/* Key Points */}
                              {section.keyPoints && section.keyPoints.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    核心要点
                                  </h4>
                                  <ul className="space-y-1 pl-6">
                                    {section.keyPoints.map((point, idx) => (
                                      <li key={idx} className="flex gap-2 text-slate-700 dark:text-slate-300">
                                        <span className="text-emerald-500 flex-shrink-0">•</span>
                                        <span>{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* References */}
                              {section.references && section.references.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4 text-indigo-500" />
                                    参考链接
                                  </h4>
                                  <div className="space-y-2 pl-6">
                                    {section.references.map((ref, idx) => (
                                      <a
                                        key={idx}
                                        href={ref.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        {ref.text}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Homework */}
                    {day.homework && day.homework.length > 0 && (
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-lg">
                          📝 课后作业
                        </h4>
                        <div className="space-y-4">
                          {day.homework.map((task, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                              <div className="flex gap-3">
                                <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                                  {idx + 1}.
                                </span>
                                <div className="space-y-2">
                                  <h5 className="font-semibold text-slate-900 dark:text-white">
                                    {task.title}
                                  </h5>
                                  <p className="text-slate-700 dark:text-slate-300 text-sm">
                                    {task.description}
                                  </p>
                                  {task.hints && task.hints.length > 0 && (
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                      <span className="font-medium">提示：</span>
                                      {task.hints.join('、')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">准备好开始学习了吗？</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                这个 7 天学习路线（含 Day 0 预备课）涵盖了 TypeScript、Next.js、浏览器自动化和 AI 驱动的开发。
                从基础知识开始，逐步构建生产级应用程序。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={() => setExpandedDay(1)}
                >
                  开始学习第一天
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <a href="/answers">查看作业答案</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-950 mt-20">
        <div className="container text-center text-sm text-slate-600 dark:text-slate-400">
          <p>© 2025 前端学习指南. 专为从后端转型到现代前端开发的开发者精心打造。</p>
        </div>
      </footer>
    </div>
  );
}
