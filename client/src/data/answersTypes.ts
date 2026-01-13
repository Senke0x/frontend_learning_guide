// 答案数据类型定义

/**
 * 测试用例
 */
export interface TestCase {
  input: string;      // 测试输入描述
  expected: string;   // 期望输出
  code: string;       // 测试代码片段
}

/**
 * 单个作业的答案
 */
export interface HomeworkAnswer {
  homeworkIndex: number;   // 对应 dayXContent 中 homework 数组的索引
  title: string;           // 答案标题（与作业标题一致）
  explanation: string;     // Markdown 格式的思路说明
  code: string;            // 带注释的完整代码
  language: 'javascript' | 'typescript';
  testCases: TestCase[];   // 测试用例
  keyInsights: string[];   // 关键学习要点
  relatedConcepts?: string[];  // 相关概念/主题
}

/**
 * 某一天的所有答案
 */
export interface DayAnswers {
  day: number;
  title: string;           // 当天标题（来自 courseContent）
  answers: HomeworkAnswer[];
}

/**
 * 所有答案的类型
 */
export type AllAnswers = DayAnswers[];
