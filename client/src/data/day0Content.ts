export const day0Content = {
  day: 0,
  title: 'JavaScript 语法基础与运行时常识',
  subtitle: '打牢 JS 基础，为 TypeScript 与前端工程做准备',
  overview: `Day 0 是正式 TypeScript 学习前的 JavaScript 预备课。本节聚焦于 JS 的核心语法、内置类型与集合、函数与异步模式、类与模块化。掌握这些基础之后，Day 1 的类型系统与工程化概念会更容易理解。

内容以“常见语法 + 使用场景 + 代码示例”为主，适合作为查漏补缺的速览笔记。`,
  sections: [
    {
      title: '变量、类型与内置对象',
      background: `JavaScript 是动态类型语言，变量在运行时才确定类型。理解“原始类型 vs 引用类型”、变量作用域，以及常见内置对象的行为，是避免隐式类型错误和性能问题的基础。`,
      content: `**变量声明与作用域**
- \`const\`: 默认选择，绑定不可重新赋值；对象/数组内容仍可变
- \`let\`: 块级作用域，可重新赋值
- \`var\`: 函数作用域 + 提升（hoisting），尽量避免

**原始类型（Primitive）与使用场景**
- \`string\`: 文本、URL、标识；常用 \`includes\`/\`slice\`/\`replace\`/\`split\`
- \`number\`: 计数、金额、坐标；配合 \`Math\` 与 \`toFixed\`
- \`boolean\`: 开关与条件
- \`null\`/\`undefined\`: 空值/缺失（区分“刻意为空”和“未提供”）
- \`bigint\`: 超大整数（不可与 number 混算）
- \`symbol\`: 唯一键，避免对象属性冲突

**引用类型与常见内置对象**
- \`Array\`: 列表处理，\`map\`/\`filter\`/\`reduce\`/\`find\`/\`some\`/\`every\`
- \`Object\`: 结构化数据，\`keys\`/\`values\`/\`entries\`/\`assign\`
- \`Map\`: 任意类型 key 的字典，适合频繁读写、保持插入顺序
- \`Set\`: 去重集合，适合唯一值、集合运算
- \`Date\`/\`RegExp\`/\`JSON\`/\`Error\`/\`Promise\`: 时间、正则、序列化、错误、异步
- \`WeakMap\`/\`WeakSet\`: 弱引用缓存，不阻止 GC（适合临时缓存/私有数据）`,
      codeExample: `// ==========================================
// 变量、类型与内置对象示例
// ==========================================

const title = 'Hello JavaScript';
const slug = title.trim().toLowerCase().replace(/\\s+/g, '-');

const price = 19.9;
const total = Number((price * 1.07).toFixed(2));

const bigId = BigInt('9007199254740993');

const ids = [1, 2, 3, 4];
const even = ids.filter((n) => n % 2 === 0);
const sum = ids.reduce((acc, n) => acc + n, 0);

const user = { id: 1, name: 'Ada' };
const pairs = Object.entries(user);

const cache = new Map();
cache.set(user, { lastLogin: Date.now() });
const lastLogin = cache.get(user);

const tags = new Set(['js', 'ts', 'js']);
const uniqueTags = Array.from(tags);

const createdAt = new Date();
const hasWord = /js/i.test('Hello JS');

const metaKey = Symbol('meta');
const obj = { [metaKey]: { source: 'system' } };`,
      keyPoints: [
        '优先使用 const，只有需要重新赋值时才用 let',
        '原始类型不可变，复杂数据使用 Array/Object/Map/Set',
        'Array 适合列表处理，Map 适合键值映射，Set 适合去重',
        '区分 null 与 undefined 的语义含义',
        'WeakMap/WeakSet 适合缓存或私有数据'
      ],
      references: [
        { text: 'MDN: JavaScript 数据类型与数据结构', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures' },
        { text: 'MDN: Array', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array' },
        { text: 'MDN: Map', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map' },
        { text: 'MDN: Set', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set' }
      ]
    },
    {
      title: '控制流与常见语法速览',
      background: `控制流语句与语法糖决定了代码的可读性和健壮性。熟悉分支、循环、解构、展开、可选链等语法，可以显著减少模板代码和空值判断。`,
      content: `**条件与循环**
- \`if/else\` 与 \`switch\` 处理分支
- \`for\`/\`for...of\` 遍历数组，\`for...in\` 遍历对象键
- \`while\`/\`do...while\`，配合 \`break\`/\`continue\`

**常见语法糖**
- 解构：\`const { id, ...rest } = obj\`、\`const [a, b] = arr\`
- 展开：\`{ ...defaults, ...overrides }\`、\`[...list, item]\`
- 模板字符串：\`Hello \${name}\`
- 可选链 \`?.\` 与空值合并 \`??\`
- 逻辑短路：\`cond && doSomething()\`
- 严格相等 \`===\` 优先于 \`==\`

**类型与属性判断**
- \`typeof\` 适合原始类型
- \`instanceof\` 检测原型链
- \`in\` 判断对象属性存在

**异常处理**
- \`try/catch/finally\` 捕获错误，\`throw\` 主动抛出异常`,
      codeExample: `// ==========================================
// 控制流与语法速览
// ==========================================

const defaults = { page: 1, size: 20 };
const params = { size: 50 };
const merged = { ...defaults, ...params };

const user = { profile: { city: 'Shenzhen' } };
const city = user.profile?.city ?? 'Unknown';

const list = [10, 20, 30];
for (const value of list) {
  if (value === 20) continue;
  console.log(value);
}

const flags = { debug: true, verbose: false };
for (const key in flags) {
  console.log(key, flags[key]);
}

const type = Array.isArray(list) ? 'array' : typeof list;

switch (type) {
  case 'array':
    console.log('is array');
    break;
  default:
    console.log('other');
}

try {
  JSON.parse('{bad json}');
} catch (error) {
  console.error('parse failed', error);
}`,
      keyPoints: [
        '优先使用 ===，避免隐式类型转换',
        'for...of 遍历值，for...in 遍历键',
        '解构/展开提高可读性，但注意浅拷贝',
        '可选链与空值合并能简化空值判断',
        'try/catch 是错误处理的核心机制'
      ],
      references: [
        { text: 'MDN: 语句与声明', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements' },
        { text: 'MDN: 表达式与运算符', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators' },
        { text: 'MDN: 可选链', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining' },
        { text: 'MDN: 空值合并', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing' }
      ]
    },
    {
      title: '函数语法：基础与高级用法',
      background: `函数是一等公民，既可以作为参数传递，也可以作为返回值。掌握函数的各种写法、作用域和 this 绑定机制，是理解异步与框架调用的前提。`,
      content: `**基础形态**
- 函数声明：\`function add(a, b) {}\`
- 函数表达式：\`const add = function(a, b) {}\`
- 箭头函数：\`const add = (a, b) => a + b\`（不绑定自己的 \`this\`）

**参数与返回**
- 默认参数、剩余参数 \`...rest\`
- 参数解构与返回对象/数组
- 纯函数 vs 有副作用函数

**高级用法**
- 高阶函数：函数作为参数/返回值
- 闭包：封装私有状态
- IIFE 立即执行函数
- \`call\`/\`apply\`/\`bind\` 显式绑定 \`this\`
- 构造函数与 \`new\`
- 异步：Promise、\`async/await\`
- 生成器：\`function*\` 与 \`yield\``,
      codeExample: `// ==========================================
// 函数基础与高级用法
// ==========================================

// 基础写法
function add(a, b) {
  return a + b;
}

const multiply = function (a, b) {
  return a * b;
};

const sum = (a, b = 0) => a + b;

// 高阶函数 + 闭包
function createCounter(start = 0) {
  let count = start;
  return () => ++count;
}

const next = createCounter();
next(); // 1
next(); // 2

// this 绑定
const logger = {
  prefix: '[log]',
  log(message) {
    console.log(this.prefix, message);
  },
};

const log = logger.log.bind(logger);
log('hello');

// 异步函数
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

// 生成器
function* idGenerator() {
  let i = 0;
  while (true) {
    yield i++;
  }
}`,
      keyPoints: [
        '函数声明会提升，函数表达式不会',
        '箭头函数没有自己的 this，适合回调',
        '闭包可封装状态，但注意内存释放',
        'async/await 本质是 Promise 语法糖',
        'call/apply/bind 可显式指定 this'
      ],
      references: [
        { text: 'MDN: 函数指南', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions' },
        { text: 'MDN: Promise 与异步', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises' },
        { text: 'MDN: 生成器', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator' }
      ]
    },
    {
      title: '接口、类与模块化',
      background: `JavaScript 使用原型链实现继承，class 是语法糖；interface 属于 TypeScript 的类型系统。理解类与模块化可以帮助你组织项目结构并建立清晰的 API 边界。`,
      content: `**类（Class）**
- \`class\` 支持 \`constructor\`、\`extends\`、\`super\`
- 实例字段、静态字段、getter/setter
- 私有字段使用 \`#\` 前缀（ES2022）

**接口（Interface）**
- JS 原生无 interface；在 TypeScript 中用 \`interface\` 描述结构
- 纯 JS 项目可用 JSDoc + \`// @ts-check\` 获得类型提示

**模块化（ES Modules）**
- 命名导出：\`export const\`、\`export function\`
- 默认导出：\`export default\`
- 导入：\`import { x } from\`、\`import x from\`
- 动态导入：\`const mod = await import('./mod.js')\``,
      codeExample: `// ==========================================
// 接口、类与模块化示例
// ==========================================

// TypeScript 接口（JS 无原生 interface）
interface User {
  id: number;
  name: string;
  email?: string;
}

// JavaScript/TypeScript 类
class UserService {
  static version = '1.0.0';
  #cache = new Map();

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getUser(id) {
    return this.#cache.get(id);
  }

  saveUser(user) {
    this.#cache.set(user.id, user);
  }
}

// 模块导出
export const API_BASE = 'https://api.example.com';
export function formatUser(user) {
  return \`\${user.id}:\${user.name}\`;
}
export default UserService;

// 模块导入
import UserService, { API_BASE, formatUser } from './userService.js';

// 动态导入
const { default: Config } = await import('./config.js');`,
      keyPoints: [
        'class 是原型继承的语法糖，仍基于 prototype',
        'interface 用于描述数据结构，属于 TypeScript 类型系统',
        'ES Modules 是现代前端的默认模块系统',
        '私有字段使用 # 前缀，需现代运行环境支持'
      ],
      references: [
        { text: 'MDN: Classes', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes' },
        { text: 'MDN: Modules', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules' },
        { text: 'TypeScript: Interfaces', url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html' }
      ]
    }
  ],
  homework: [
    {
      title: '实现基础工具函数',
      description: '实现 slugify、unique 和 groupBy（用 Map）三个工具函数，要求使用 Array 的高阶方法。',
      hints: ['使用 map/filter/reduce', 'groupBy 返回 Map', '注意大小写与空格处理']
    },
    {
      title: '函数与闭包练习',
      description: '实现 once 与 debounce 函数，确保函数只执行一次或在停止触发后执行。',
      hints: ['利用闭包保存状态', '使用 setTimeout/clearTimeout']
    },
    {
      title: '模块化与类设计',
      description: '用 ES Modules 拆分一个 User 模块：定义 User 接口（TS 或 JSDoc）、UserService 类与 index.ts 导出。',
      hints: ['使用 export/export default', '在入口文件统一导出']
    }
  ]
};
