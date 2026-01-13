'use client';

import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink, BookOpen, Code, Lightbulb, CheckCircle2, FileCode2, ClipboardList, ListChecks, ArrowLeft, ArrowRight } from 'lucide-react';
import { courseContent } from '@/data/courseContent';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { CodeBlock } from '@/components/CodeBlock';
import { answersByDay } from '@/data/answers';

export default function DayDetail() {
  const params = useParams();
  const dayNumber = parseInt(params.day || '0');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set());

  const day = courseContent.find(d => d.day === dayNumber);
  const prevDay = courseContent.find(d => d.day === dayNumber - 1);
  const nextDay = courseContent.find(d => d.day === dayNumber + 1);

  const toggleAnswer = (answerKey: string) => {
    setExpandedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(answerKey)) {
        next.delete(answerKey);
      } else {
        next.add(answerKey);
      }
      return next;
    });
  };

  if (!day) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <Card className="border-0 bg-white dark:bg-slate-800 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">课程内容未找到</p>
          <Button asChild className="mt-4">
            <Link href="/">返回首页</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="container flex items-center h-16">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="space-y-8">
          {/* Day Header */}
          <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge className="mb-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    第 {day.day} 天
                  </Badge>
                  <CardTitle className="text-3xl mb-2">{day.title}</CardTitle>
                  <CardDescription className="text-base">{day.subtitle}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Overview */}
          {day.overview && (
            <Card className="border-0 bg-white dark:bg-slate-800">
              <CardContent className="pt-6">
                <MarkdownRenderer content={day.overview} />
              </CardContent>
            </Card>
          )}

          {/* Sections */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">课程章节</h2>
            {day.sections.map((section, sectionIdx) => {
              const sectionKey = `${day.day}-${sectionIdx}`;
              const isExpanded = expandedSection === sectionKey;

              return (
                <Card key={sectionKey} className="border-0 bg-white dark:bg-slate-800">
                  <CardHeader>
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
                      className="w-full text-left flex items-center justify-between hover:opacity-70 transition-opacity"
                    >
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {sectionIdx + 1}. {section.title}
                      </h3>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-6 pt-0">
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
                                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {ref.text}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Homework */}
          {day.homework && day.homework.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">📝 课后作业</h2>
              <div className="space-y-4">
                {day.homework.map((task, idx) => {
                  const answerKey = `${day.day}-${idx}`;
                  const isAnswerExpanded = expandedAnswers.has(answerKey);
                  const dayAnswers = answersByDay[day.day];
                  const answer = dayAnswers?.answers.find(a => a.homeworkIndex === idx);

                  return (
                    <Card key={idx} className="border-0 bg-white dark:bg-slate-800">
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex gap-3">
                          <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                            {idx + 1}.
                          </span>
                          <div className="space-y-2 flex-1">
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

                        {/* Answer Toggle Button */}
                        {answer && (
                          <div className="pl-8">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAnswer(answerKey)}
                              className="w-full sm:w-auto"
                            >
                              {isAnswerExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4 mr-2" />
                                  隐藏答案
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4 mr-2" />
                                  查看答案
                                </>
                              )}
                            </Button>

                            {/* Expandable Answer Section */}
                            {isAnswerExpanded && (
                              <div className="mt-4 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                                {/* Explanation */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                    <Lightbulb className="w-4 h-4 text-amber-500" />
                                    思路讲解
                                  </div>
                                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                                    <MarkdownRenderer content={answer.explanation} />
                                  </div>
                                </div>

                                {/* Code */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                    <FileCode2 className="w-4 h-4 text-blue-500" />
                                    参考代码
                                  </div>
                                  <CodeBlock code={answer.code} language={answer.language} showLineNumbers />
                                </div>

                                {/* Test Cases and Key Insights */}
                                <div className="grid gap-4 md:grid-cols-2">
                                  {/* Test Cases */}
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                      <ClipboardList className="w-4 h-4 text-emerald-500" />
                                      测试用例
                                    </div>
                                    <div className="space-y-2">
                                      {answer.testCases.map((tc, tcIdx) => (
                                        <div key={tcIdx} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 space-y-2">
                                          <div className="flex items-start gap-2">
                                            <ListChecks className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1 space-y-1">
                                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                {tc.input}
                                              </p>
                                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                                期望：{tc.expected}
                                              </p>
                                            </div>
                                          </div>
                                          <CodeBlock code={tc.code} language={answer.language} />
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Key Insights and Related Concepts */}
                                  <div className="space-y-3">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        关键要点
                                      </div>
                                      <ul className="space-y-1 text-sm">
                                        {answer.keyInsights.map((point, pointIdx) => (
                                          <li key={pointIdx} className="flex gap-2 text-slate-700 dark:text-slate-300">
                                            <span className="text-emerald-500 flex-shrink-0">•</span>
                                            <span>{point}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    {answer.relatedConcepts && answer.relatedConcepts.length > 0 && (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                          <BookOpen className="w-4 h-4 text-indigo-500" />
                                          相关概念
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {answer.relatedConcepts.map((concept, cIdx) => (
                                            <Badge key={cIdx} variant="secondary" className="text-xs">
                                              {concept}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-700">
            <div>
              {prevDay && (
                <Button asChild variant="outline">
                  <Link href={`/day/${prevDay.day}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    上一天：{prevDay.title}
                  </Link>
                </Button>
              )}
            </div>
            <div>
              {nextDay && (
                <Button asChild>
                  <Link href={`/day/${nextDay.day}`}>
                    下一天：{nextDay.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
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
