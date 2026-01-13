'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight, Target } from 'lucide-react';
import { courseContent, courseOverview } from '@/data/courseContent';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function Home() {
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
        <div className="space-y-12">
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

          {/* Course Content Cards */}
          <div id="course" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">课程内容</h2>
              <Badge variant="outline" className="text-sm">
                共 {courseContent.length} 天课程
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courseContent.map((day) => (
                <a
                  key={day.day}
                  href={`/day/${day.day}`}
                  className="block h-full no-underline"
                >
                  <Card className="h-full border-0 bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          Day {day.day}
                        </Badge>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white line-clamp-2">
                        {day.title}
                      </CardTitle>
                      <CardDescription className="text-sm mt-2 line-clamp-2">
                        {day.subtitle}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Overview Preview */}
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {day.overview.split('\n')[0]}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{day.sections.length} 章节</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          <span>{day.homework.length} 作业</span>
                        </div>
                      </div>

                      {/* Topics Preview */}
                      <div className="flex flex-wrap gap-1.5">
                        {day.sections.slice(0, 3).map((section, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {section.title}
                          </Badge>
                        ))}
                        {day.sections.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{day.sections.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
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
