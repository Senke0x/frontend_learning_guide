import { day0Content } from './day0Content';
import { day1Content } from './day1Content';
import { day2Content } from './day2Content';
import { day3Content } from './day3Content';
import { day4Content } from './day4Content';
import { day5Content } from './day5Content';
import { day6Content } from './day6Content';
import { day7Content } from './day7Content';

export interface Reference {
  text: string;
  url: string;
}

export interface Section {
  title: string;
  background: string;
  content: string;
  codeExample: string;
  keyPoints: string[];
  references: Reference[];
}

export interface Homework {
  title: string;
  description: string;
  hints: string[];
}

export interface DayContent {
  day: number;
  title: string;
  subtitle: string;
  overview: string;
  sections: Section[];
  homework: Homework[];
}

export const courseContent: DayContent[] = [
  day0Content,
  day1Content,
  day2Content,
  day3Content,
  day4Content,
  day5Content,
  day6Content,
  day7Content,
];

export const courseOverview = {
  title: '前端开发与浏览器自动化学习指南',
  subtitle: '从后端到全栈 AI Agent 开发的 7 天学习路线（含 Day 0 预备课）',
  description: `本学习指南专为具有 C++/Java 后端基础的开发者设计，帮助你在 7 天主线课程 + Day 0 预备课中掌握前端开发和浏览器自动化的核心技能。

学习路线采用"方案B"顺序，先学习 TypeScript 和 Next.js 建立前端基础，再深入浏览器自动化技术，最后通过 AI 驱动的自动化和综合项目将所有知识串联起来。`,
  highlights: [
    { label: '学习天数', value: '7 天 + Day 0' },
    { label: '核心技术', value: '8 个' },
    { label: '实战项目', value: '3 个' },
    { label: '代码示例', value: '50+' },
  ],
  techStack: [
    'TypeScript',
    'Next.js',
    'Playwright',
    'CDP',
    'MCP',
    'Stagehand',
    'Browserbase',
    'Vercel',
  ],
};
