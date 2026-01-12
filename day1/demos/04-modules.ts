/**
 * 运行: pnpm tsx day1/demos/04-modules.ts
 * 调试: node --inspect-brk ./node_modules/.bin/tsx day1/demos/04-modules.ts
 */

// 对应 day1/core-syntax.md#core-9 模块与导入导出
// core-9 默认导出 + 命名导出
import sum, { multiply, PI } from './lib/math';
// core-9 桶文件导出（barrel）
import { sum as sumFromBarrel, multiply as multiplyFromBarrel, PI as piFromBarrel } from './lib';
// core-9 import type 仅导入类型
import type { Todo } from './lib';

const todo: Todo = { id: 't1', title: 'Learn modules', done: false };

console.log('direct', sum(1, 2), multiply(2, 3), PI);
console.log('barrel', sumFromBarrel(3, 4), multiplyFromBarrel(2, 5), piFromBarrel);
console.log(todo);
