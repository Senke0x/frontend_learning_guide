/**
 * 运行: pnpm tsx day1/demos/02-objects-interfaces-functions.ts
 * 调试: node --inspect-brk ./node_modules/.bin/tsx day1/demos/02-objects-interfaces-functions.ts
 */

export {};

// 对应 day1/core-syntax.md#core-6 ~ day1/core-syntax.md#core-7
// core-6 对象与接口: interface/type/可选/只读
interface User {
  readonly id: string;
  name: string;
  email?: string;
}

type Role = 'admin' | 'member';

// core-6 对象与接口: extends 扩展结构
interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// core-6 对象与接口: 交叉类型扩展
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type AuditedUser = User & Timestamped;

// core-6 对象与接口: 索引签名
interface StringMap {
  [key: string]: string;
}

const user: User = { id: 'u1', name: 'Alice' };
const admin: Admin = {
  id: 'u2',
  name: 'Bob',
  role: 'admin',
  permissions: ['read'],
};
const audited: AuditedUser = {
  id: 'u3',
  name: 'Cathy',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const labels: StringMap = {
  en: 'Hello',
  zh: 'Ni Hao',
};

// core-7 函数类型: 参数/返回值 + 剩余参数
type Logger = (message: string, ...tags: string[]) => void;

const log: Logger = (message, ...tags) => {
  console.log(`${message} [${tags.join(', ')}]`);
};

function formatUser(user: User, prefix = 'User'): string {
  return `${prefix}: ${user.name}`;
}

// core-7 函数类型: 可选参数
function greet(user: User, suffix?: string): string {
  return `${user.name}${suffix ?? ''}`;
}

// core-7 函数类型: void 返回值
function notify(message: string): void {
  console.log(`notify: ${message}`);
}

// core-7 函数类型: 函数重载
function parseInput(input: string): number;
function parseInput(input: number): string;
function parseInput(input: string | number): string | number {
  return typeof input === 'string' ? Number(input) : input.toString();
}

// core-7 函数类型: this 参数
function printWithThis(this: { prefix: string }, message: string) {
  console.log(`${this.prefix}${message}`);
}

const parsedNumber = parseInput('42');
const parsedString = parseInput(42);

log('start', 'day1', 'ts');
notify(formatUser(user));
console.log(greet(user, '!'));
printWithThis.call({ prefix: '[info] ' }, 'typed this');

console.log({
  role: admin.role,
  audited,
  labels,
  parsedNumber,
  parsedString,
});
