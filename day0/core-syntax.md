# Day0 核心语法与常见内置对象（扩展版）

> 说明：本文是 Day0 的详细笔记，覆盖 JavaScript 常见语法与内置对象。每个知识点均提供 Demo 与案例说明，便于深入理解与复习。

**参考资料**
- MDN JavaScript 指南：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- MDN 内置对象总览：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
- ECMAScript 语言规范：https://tc39.es/ecma262/

---

<a id="d0-1"></a>
## 1. 变量声明、作用域与提升

### 1.1 var / let / const
**知识点说明**
- `const`：绑定不可重新赋值，默认首选。
- `let`：块级作用域，可重新赋值。
- `var`：函数作用域 + 提升，容易引入隐藏 bug。

**Demo**
```js
if (true) {
  const a = 1;
  let b = 2;
  var c = 3;
}
// console.log(a); // ReferenceError
// console.log(b); // ReferenceError
console.log(c); // 3
```

**案例说明**
- 业务中统一使用 `const`，只有需要重新赋值时才用 `let`。

### 1.2 变量提升（Hoisting）与 TDZ
**知识点说明**
- `var` 会被提升并初始化为 `undefined`。
- `let/const` 也会提升，但处于 TDZ（暂时性死区），访问会报错。

**Demo**
```js
console.log(foo); // undefined
var foo = 10;

// console.log(bar); // ReferenceError
let bar = 20;
```

**案例说明**
- 变量必须“先声明后使用”，避免 TDZ 与不可预期的 undefined。

---

<a id="d0-2"></a>
## 2. 原始类型与内置方法

### 2.1 string
**知识点说明**
- 字符串不可变；常用方法返回新字符串。

**Demo**
```js
const title = '  Hello JS  ';
const clean = title.trim().toLowerCase();
const slug = clean.replace(/\s+/g, '-');
```

**案例说明**
- 文本处理、关键词匹配、生成 URL slug。

### 2.2 number
**知识点说明**
- JS 只有 `number`（双精度浮点）。
- 避免 `NaN` 与精度陷阱。

**Demo**
```js
const price = 19.9;
const withTax = Number((price * 1.07).toFixed(2));

const raw = '42px';
const parsed = parseInt(raw, 10); // 42
console.log(Number.isFinite(parsed)); // true
```

**案例说明**
- 金额计算需注意精度，必要时用 `toFixed` 或 `BigInt`。

### 2.3 boolean
**知识点说明**
- `false`、`0`、`''`、`null`、`undefined`、`NaN` 为 falsy。

**Demo**
```js
const isAdmin = Boolean('admin'); // true
const hasValue = Boolean(0); // false
```

**案例说明**
- 条件判断时注意空字符串和 0 的语义差异。

### 2.4 null / undefined
**知识点说明**
- `undefined` 表示缺失，`null` 表示“明确为空”。
- `??` 只对 `null/undefined` 生效。

**Demo**
```js
const config = { timeout: 0 };
const timeout = config.timeout ?? 3000; // 0
const city = config.profile?.city ?? 'Unknown';
```

**案例说明**
- 默认值使用 `??` 更安全，避免把 `0`、`''` 当成空值。

### 2.5 bigint
**知识点说明**
- 适用于超出 `Number.MAX_SAFE_INTEGER` 的整数。
- 不能与 number 直接混算。

**Demo**
```js
const bigId = BigInt('9007199254740993');
const nextId = bigId + 1n;
```

**案例说明**
- 适合大整数 ID、序列号。

### 2.6 symbol
**知识点说明**
- 唯一标识符，常用于对象“私有键”。

**Demo**
```js
const metaKey = Symbol('meta');
const obj = { [metaKey]: { internal: true } };

const shared = Symbol.for('cache');
const lookup = Symbol.for('cache');
console.log(shared === lookup); // true
```

**案例说明**
- 避免对象属性冲突，或实现迭代协议 `Symbol.iterator`。

---

<a id="d0-3"></a>
## 3. 引用类型与集合结构

### 3.1 Array
**知识点说明**
- 常用高阶方法：`map`、`filter`、`reduce`、`find`。
- `slice` 不改变原数组，`splice` 会修改原数组。

**Demo**
```js
const scores = [60, 80, 90, 100];
const passed = scores.filter((s) => s >= 80);
const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
const firstTop = scores.find((s) => s >= 90);
```

**案例说明**
- 列表渲染、筛选、统计优先用高阶函数。

### 3.2 Object
**知识点说明**
- 对象是键值结构；常用 `Object.keys/values/entries`。

**Demo**
```js
const user = { id: 1, name: 'Ada' };
const entries = Object.entries(user);
const copy = Object.assign({}, user, { role: 'admin' });
```

**案例说明**
- 适合配置项、业务实体；注意浅拷贝。

### 3.3 Map
**知识点说明**
- 任意类型 key，保持插入顺序。

**Demo**
```js
const cache = new Map();
cache.set('user:1', { name: 'Ada' });
if (cache.has('user:1')) {
  console.log(cache.get('user:1'));
}
```

**案例说明**
- 适合高频读写的缓存与映射关系。

### 3.4 Set
**知识点说明**
- 自动去重，适合唯一集合。

**Demo**
```js
const tags = new Set(['js', 'ts', 'js']);
const uniqueTags = Array.from(tags);
```

**案例说明**
- 标签、权限等唯一集合处理。

### 3.5 WeakMap / WeakSet
**知识点说明**
- 弱引用，不阻止 GC；键必须是对象。

**Demo**
```js
const wm = new WeakMap();
const obj = { id: 1 };
wm.set(obj, { cached: true });
// obj 被释放后，wm 中的记录也会被清理
```

**案例说明**
- 适合临时缓存、私有数据存储。

### 3.6 Date / RegExp / JSON / Error
**Demo**
```js
const now = new Date();
const iso = now.toISOString();

const isMatch = /\d+/.test('item-42');

const payload = JSON.stringify({ ok: true });
const parsed = JSON.parse(payload);

class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
```

**案例说明**
- `Date` 处理时间戳，`RegExp` 用于模式匹配，`JSON` 用于序列化。
- 自定义错误类便于统一错误处理。

---

<a id="d0-4"></a>
## 4. 运算符、表达式与类型转换

### 4.1 比较与相等
**知识点说明**
- `===` 严格相等，避免隐式类型转换。

**Demo**
```js
console.log(0 == false); // true
console.log(0 === false); // false
console.log('' == false); // true
```

**案例说明**
- 业务中统一使用 `===` 与 `!==`。

### 4.2 逻辑运算与空值合并
**Demo**
```js
const input = '';
const text = input || 'default'; // '' 被当成 false
const safe = input ?? 'default'; // 仅 null/undefined 触发
```

**案例说明**
- `??` 更符合“仅为空值才补默认”的语义。

### 4.3 可选链与短路
**Demo**
```js
const user = { profile: { city: 'Shenzhen' } };
const city = user.profile?.city ?? 'Unknown';
```

**案例说明**
- 避免多层 `&&` 判断，提高可读性。

### 4.4 展开与解构
**Demo**
```js
const defaults = { page: 1, size: 20 };
const params = { size: 50 };
const merged = { ...defaults, ...params };

const [first, ...rest] = [1, 2, 3, 4];
const { id, ...others } = { id: 1, name: 'Ada', role: 'admin' };
```

**案例说明**
- 用于对象合并、参数解构与快速拷贝。

---

<a id="d0-5"></a>
## 5. 控制流

### 5.1 条件分支
**Demo**
```js
const role = 'admin';
if (role === 'admin') {
  console.log('full access');
} else if (role === 'editor') {
  console.log('limited access');
} else {
  console.log('read only');
}
```

**案例说明**
- 简单分支用 `if/else`，多状态可用 `switch`。

### 5.2 循环与迭代
**Demo**
```js
const list = ['a', 'b', 'c'];
for (const item of list) {
  console.log(item);
}

const obj = { a: 1, b: 2 };
for (const key in obj) {
  console.log(key, obj[key]);
}
```

**案例说明**
- `for...of` 遍历值，`for...in` 遍历键。

### 5.3 异常处理
**Demo**
```js
function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return { error: error.message };
  }
}
```

**案例说明**
- 统一错误结构便于 UI 层处理。

---

<a id="d0-6"></a>
## 6. 函数语法与 this 规则

### 6.1 函数定义方式
**Demo**
```js
function add(a, b) {
  return a + b;
}

const multiply = function (a, b) {
  return a * b;
};

const subtract = (a, b) => a - b;
```

**案例说明**
- 函数声明会提升，函数表达式不会。

### 6.2 参数、默认值与剩余参数
**Demo**
```js
function sum(a, b = 0) {
  return a + b;
}

function sumAll(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}

function formatUser({ id, name }) {
  return `${id}:${name}`;
}
```

**案例说明**
- 默认值与解构参数可减少空值判断。

### 6.3 this 绑定规则
**Demo**
```js
const logger = {
  prefix: '[log]',
  log(message) {
    console.log(this.prefix, message);
  },
};

const log = logger.log.bind(logger);
log('hello');
```

**案例说明**
- `bind` 固定 this，避免丢失上下文。

### 6.4 闭包与高阶函数
**Demo**
```js
function createCounter(start = 0) {
  let count = start;
  return () => ++count;
}

const next = createCounter();
next(); // 1
next(); // 2
```

**案例说明**
- 闭包用于计数器、防抖、缓存等场景。

---

<a id="d0-7"></a>
## 7. 异步与事件循环

### 7.1 Promise 与 async/await
**Demo**
```js
function fetchJson(url) {
  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error('Request failed');
      return res.json();
    });
}

async function loadProfile() {
  try {
    const data = await fetchJson('/api/profile');
    return data;
  } catch (error) {
    return { error: error.message };
  }
}
```

**案例说明**
- `async/await` 更易读，但仍需 `try/catch`。

### 7.2 Promise 并发工具
**Demo**
```js
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);

Promise.all([p1, p2]).then(([a, b]) => console.log(a + b));
Promise.allSettled([p1, Promise.reject('err')]).then(console.log);
```

**案例说明**
- `all` 适合并发依赖结果，`allSettled` 适合收集全部结果。

### 7.3 事件循环（宏任务/微任务）
**Demo**
```js
console.log('start');

setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));

console.log('end');
// 输出顺序：start -> end -> promise -> timeout
```

**案例说明**
- 微任务优先于宏任务，这影响异步执行顺序。

---

<a id="d0-8"></a>
## 8. 迭代器与生成器

### 8.1 for...of 与迭代协议
**Demo**
```js
const iterable = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => ({
        value: this.data[i++],
        done: i > this.data.length,
      }),
    };
  },
};

for (const value of iterable) {
  console.log(value);
}
```

**案例说明**
- 自定义迭代器可让对象支持 `for...of`。

### 8.2 生成器（Generator）
**Demo**
```js
function* idGenerator() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const gen = idGenerator();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
```

**案例说明**
- 适合惰性计算或分页迭代。

---

<a id="d0-9"></a>
## 9. 对象模型、类与继承

### 9.1 原型链
**Demo**
```js
function User(name) {
  this.name = name;
}

User.prototype.sayHi = function () {
  return `Hi, ${this.name}`;
};

const u = new User('Ada');
console.log(u.sayHi());
```

**案例说明**
- JS 继承基于原型链；class 是语法糖。

### 9.2 Class 语法
**Demo**
```js
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
```

**案例说明**
- `#` 私有字段保证封装性，`static` 用于类级别配置。

### 9.3 继承与 super
**Demo**
```js
class BaseService {
  request() {
    return 'base';
  }
}

class UserService extends BaseService {
  request() {
    return `${super.request()} -> user`;
  }
}
```

**案例说明**
- `super` 调用父类方法，便于扩展基础逻辑。

---

<a id="d0-10"></a>
## 10. 模块系统（ES Modules）

### 10.1 命名导出与默认导出
**Demo**
```js
// userService.js
export const API_BASE = 'https://api.example.com';
export function formatUser(user) {
  return `${user.id}:${user.name}`;
}
export default class UserService {}

// app.js
import UserService, { API_BASE, formatUser } from './userService.js';
```

**案例说明**
- 默认导出适合模块主功能，命名导出适合工具函数或常量。

### 10.2 重新导出与动态导入
**Demo**
```js
// index.js
export { default as UserService } from './userService.js';
export * from './utils.js';

// 动态导入
const { default: Config } = await import('./config.js');
```

**案例说明**
- 动态导入适合按需加载或拆分代码。

---

## 11. 语言基础、作用域与内存（红宝书 3-6 章补充）
**学习定位**
- 常见路线图把“语言基础 + 作用域/内存 + 引用类型/集合”视为生产可用底座
- 本节补充执行上下文、引用语义与内存管理细节

### 11.1 执行上下文与作用域链
**知识点说明**
- 执行上下文包含变量环境、词法环境与 this 绑定
- 作用域链从当前上下文逐层向外查找标识符
- 闭包是作用域链在函数返回后的延续，会延长被引用变量的生命周期

**Demo**
```js
function createConfig() {
  const env = 'prod';
  return function getEnv() {
    return env; // 闭包引用
  };
}

const getEnv = createConfig();
console.log(getEnv()); // 'prod'
```

**案例说明**
- 配置读取、函数工厂、缓存函数常用闭包
- 注意闭包捕获大对象可能导致内存占用过大

### 11.2 值与引用、浅拷贝/深拷贝
**知识点说明**
- 原始类型按值拷贝，引用类型按引用拷贝
- 展开/`Object.assign` 是浅拷贝，嵌套对象仍共享引用
- 深拷贝可用 `structuredClone`，但函数/DOM 无法被克隆

**Demo**
```js
const a = { profile: { city: 'Shenzhen' } };
const b = { ...a };
b.profile.city = 'Beijing';
console.log(a.profile.city); // 'Beijing'

const deep = structuredClone(a);
deep.profile.city = 'Shanghai';
console.log(a.profile.city); // 'Beijing'
```

**案例说明**
- 状态管理需避免“无意共享引用”，更新嵌套对象时要进行深拷贝

### 11.3 原型链与包装类型
**知识点说明**
- 方法查找沿原型链向上遍历
- 原始类型会被临时装箱为包装对象（String/Number/Boolean）
- 不建议使用 `new String()` 等包装对象

**Demo**
```js
const str = 'hi';
console.log(str.toUpperCase()); // 自动装箱

function User(name) {
  this.name = name;
}
User.prototype.sayHi = function () {
  return `Hi, ${this.name}`;
};
```

**案例说明**
- 包装对象与原始值严格不相等，可能导致条件判断出错

### 11.4 引用类型与集合补充
**知识点说明**
- `Object` 适合结构化数据；`Map` 适合任意 key 且高频读写
- `Set` 适合去重集合；`WeakMap/WeakSet` 用于弱引用缓存

**Demo**
```js
const map = new Map();
const key = { id: 1 };
map.set(key, 'value');

const set = new Set([1, 2, 2, 3]);
console.log(set.size); // 3
```

**案例说明**
- 大量映射操作优先使用 Map，避免 Object 的键类型限制

### 11.5 内存与 GC（垃圾回收）
**知识点说明**
- 栈保存基础值与引用地址，堆保存对象与复杂结构
- 主流 GC 使用“标记-清除”策略
- 常见泄漏：全局变量、闭包、定时器、未解绑事件监听

**Demo**
```js
function leak() {
  const big = new Array(1e5).fill('x');
  return () => big.length;
}
const keep = leak(); // big 被闭包持有

// 清理事件监听示例
const button = document.querySelector('button');
function onClick() {}
button.addEventListener('click', onClick);
button.removeEventListener('click', onClick);
```

**案例说明**
- 组件卸载时清理监听器与定时器，避免内存累积

**关键点**
- 理解执行上下文与作用域链是掌握闭包的前提
- 原始类型按值拷贝，引用类型按引用拷贝
- 深拷贝要明确边界与性能成本
- GC 不会清理仍被引用的数据，需避免隐式持有

---

## 12. 函数与异步（红宝书 10-11 章补充）

### 12.1 this 绑定规则
**知识点说明**
- 默认绑定：独立调用时 `this` 指向全局或 `undefined`
- 隐式绑定：通过对象调用，`this` 指向对象
- 显式绑定：`call/apply/bind`
- 构造绑定：`new` 创建实例并绑定 `this`

**Demo**
```js
function show() {
  return this && this.value;
}

const obj = { value: 42, show };
const loose = show();
const implicit = obj.show();
const explicit = show.call({ value: 7 });
```

**案例说明**
- 方法作为回调传递时易丢失 `this`，建议提前 `bind`

### 12.2 参数、arguments 与 rest
**知识点说明**
- `arguments` 是类数组对象，推荐用 `...rest` 替代
- 解构参数提升可读性

**Demo**
```js
function sumAll(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}

function formatUser({ id, name }) {
  return `${id}:${name}`;
}
```

**案例说明**
- API 设计上优先使用对象参数，便于扩展与可读性

### 12.3 Promise 状态与链式调用
**知识点说明**
- Promise 只有 `pending/fulfilled/rejected` 三种状态
- `then` 返回新的 Promise，错误会向下传递到 `catch`

**Demo**
```js
Promise.resolve(1)
  .then((value) => value + 1)
  .then((value) => {
    if (value > 1) throw new Error('boom');
    return value;
  })
  .catch((error) => error.message)
  .finally(() => console.log('done'));
```

**案例说明**
- 用链式调用构建线性步骤，统一在 `catch` 收敛错误

### 12.4 async/await 与取消
**知识点说明**
- `async/await` 是 Promise 的语法糖
- 请求取消通常使用 `AbortController`

**Demo**
```js
const controller = new AbortController();

async function loadProfile() {
  const res = await fetch('/api/profile', { signal: controller.signal });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

controller.abort();
```

**案例说明**
- 页面切换或组件卸载时取消请求，避免无效更新

### 12.5 并发组合
**知识点说明**
- `all` 失败即失败，`allSettled` 保留所有结果
- `race/any` 适合竞争策略

**Demo**
```js
Promise.all([Promise.resolve(1), Promise.resolve(2)])
  .then(([a, b]) => console.log(a + b));

Promise.allSettled([Promise.resolve('ok'), Promise.reject('fail')])
  .then((results) => console.log(results));
```

**案例说明**
- 多接口并发请求，使用 `all` 聚合，使用 `allSettled` 容错

**关键点**
- this 绑定规则是函数行为的核心
- Promise 链的错误只需在尾部处理即可
- async/await 需配合 try/catch 与取消机制
- 并发组合帮助提升吞吐与响应速度

---

## 13. DOM 基础（红宝书 14-15 章）

### 13.1 DOM 树与节点操作
**知识点说明**
- DOM 树由 Document、Element、Text、Comment 等节点组成
- 常用操作：`createElement`、`append`、`remove`

**Demo**
```js
const list = document.createElement('ul');
const item = document.createElement('li');
item.textContent = 'Hello';
list.append(item);
document.body.append(list);
```

**案例说明**
- 动态生成列表、表格、表单等场景最常见

### 13.2 选择与遍历
**知识点说明**
- `querySelector` 返回第一个匹配元素
- `querySelectorAll` 返回 NodeList（可用 `forEach`）

**Demo**
```js
const card = document.querySelector('.card');
const items = document.querySelectorAll('.item');
items.forEach((node) => console.log(node.textContent));
```

**案例说明**
- 选择器应尽量具体，避免全局查询影响性能

### 13.3 样式与性能
**知识点说明**
- `classList` 适合切换样式
- 批量操作使用 `DocumentFragment` 降低重排

**Demo**
```js
const fragment = document.createDocumentFragment();
for (let i = 0; i < 5; i += 1) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.append(li);
}
document.querySelector('#list').append(fragment);
```

**案例说明**
- 频繁 DOM 更新应合并成批量操作，减少布局抖动

**关键点**
- DOM 操作会触发重排/重绘，批量更新更高效
- `classList` 比直接修改 `style` 更可维护
- 选择器越精准，性能越稳定

---

## 14. 事件模型与交互（红宝书 16-17 章）

### 14.1 DOM0 / DOM2 / DOM3 事件模型
**知识点说明**
- DOM0：`onclick` 绑定，覆盖式
- DOM2：`addEventListener`，支持捕获/冒泡
- DOM3：扩展事件类型（键盘/鼠标/焦点等）

**Demo**
```js
const button = document.querySelector('button');
button.addEventListener('click', (event) => {
  event.preventDefault();
  console.log(event.target, event.currentTarget);
});
```

**案例说明**
- 生产环境推荐统一使用 DOM2 事件模型

### 14.2 事件捕获与冒泡
**知识点说明**
- 捕获阶段从外到内，冒泡阶段从内到外
- `stopPropagation` 可阻止继续传播

**Demo**
```js
const parent = document.querySelector('#parent');
const child = document.querySelector('#child');

parent.addEventListener('click', () => console.log('parent'), true);
child.addEventListener('click', (event) => {
  event.stopPropagation();
  console.log('child');
});
```

**案例说明**
- 理解传播阶段可避免重复触发或事件冲突

### 14.3 事件委托与性能
**知识点说明**
- 委托利用冒泡在父元素统一处理子元素事件
- 大量列表或动态节点推荐委托

**Demo**
```js
const list = document.querySelector('#list');
list.addEventListener('click', (event) => {
  const item = event.target.closest('li');
  if (item) console.log(item.dataset.id);
});
```

**案例说明**
- 避免给每个子元素绑定事件，降低内存与绑定成本

### 14.4 事件选项与节流防抖
**知识点说明**
- `once` 只触发一次，`passive` 优化滚动性能

**Demo**
```js
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

window.addEventListener('scroll', debounce(() => {}, 200), { passive: true });
```

**案例说明**
- 高频事件（scroll、resize）必须使用节流/防抖

**关键点**
- DOM2/3 提供标准化事件模型与更多事件类型
- 事件委托能显著减少监听器数量
- `passive` 与防抖提升交互性能

---

## 15. 网络请求与远程资源（红宝书 24 章）

### 15.1 Fetch 基础
**知识点说明**
- `fetch` 返回 Promise，需手动判断 `res.ok`

**Demo**
```js
async function getProfile() {
  const res = await fetch('/api/profile');
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}
```

**案例说明**
- 将状态码判断封装到统一请求层，避免重复代码

### 15.2 XHR 与进度监听
**知识点说明**
- XHR 支持进度事件，适合上传下载进度条

**Demo**
```js
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/large');
xhr.onprogress = (event) => {
  if (event.lengthComputable) {
    console.log(event.loaded / event.total);
  }
};
xhr.send();
```

**案例说明**
- 大文件上传/下载需展示进度反馈

### 15.3 CORS 与凭证
**知识点说明**
- 跨域请求需服务器配置 CORS
- `credentials: 'include'` 可携带 Cookie

**Demo**
```js
fetch('https://api.example.com/me', {
  credentials: 'include',
});
```

**案例说明**
- 登录态依赖 Cookie 时需显式携带凭证

### 15.4 URL 与表单数据
**知识点说明**
- `URLSearchParams` 拼接查询参数
- `FormData` 适合上传文件或表单

**Demo**
```js
const params = new URLSearchParams({ page: '1', size: '20' });
const url = `/api/list?${params.toString()}`;

const form = new FormData();
form.append('file', new Blob(['data']), 'demo.txt');
```

**案例说明**
- 查询参数和表单提交是常见后端接口交互方式

**关键点**
- fetch 需手动处理错误与 JSON 解析
- XHR 适合需要进度监听的场景
- CORS 是跨域的核心安全机制
- URLSearchParams/FormData 简化参数构建

---

## 16. 模块系统进阶（红宝书 26 章）

### 16.1 ESM 的 live binding
**知识点说明**
- ESM 导出是“实时绑定”，不是拷贝

**Demo**
```js
// counter.js
export let count = 0;
export function inc() {
  count += 1;
}

// app.js
import { count, inc } from './counter.js';
inc();
console.log(count); // 1
```

**案例说明**
- 状态导出会随更新同步反映在导入方

### 16.2 循环依赖与拆分
**知识点说明**
- 循环依赖会导致导出值为 `undefined`

**Demo**
```js
// a.js
import { valueB } from './b.js';
export const valueA = `A-${valueB}`;

// b.js
import { valueA } from './a.js';
export const valueB = `B-${valueA}`;
```

**案例说明**
- 避免循环依赖，或抽取公共模块

### 16.3 动态导入与代码拆分
**知识点说明**
- `import()` 返回 Promise，可按需加载模块

**Demo**
```js
const { default: Config } = await import('./config.js');
```

**案例说明**
- 适合非首屏功能或可选模块加载

**关键点**
- ESM 导出是 live binding
- 循环依赖应通过模块拆分化解
- 动态导入能显著降低首屏体积

---

## 17. 错误处理、调试与最佳实践（红宝书 21/28 章）

### 17.1 错误类型与抛出
**知识点说明**
- `Error` 家族用于表达不同错误类型
- `throw` 可抛出自定义错误

**Demo**
```js
class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

throw new ApiError('Unauthorized', 401);
```

**案例说明**
- 统一错误结构便于上层处理与日志记录

### 17.2 全局错误捕获
**知识点说明**
- 浏览器可监听 `error` 与 `unhandledrejection`

**Demo**
```js
window.addEventListener('error', (event) => {
  console.error('global error', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('unhandled promise', event.reason);
});
```

**案例说明**
- 线上环境应采集错误日志与堆栈信息

### 17.3 调试与性能分析
**知识点说明**
- 使用 `console`、`debugger`、Performance 面板
- `performance.now()` 用于轻量性能测量

**Demo**
```js
const start = performance.now();
for (let i = 0; i < 1e5; i += 1) {}
const end = performance.now();
console.log(`cost: ${end - start}ms`);
```

**案例说明**
- 性能问题要用指标定位，再针对性优化

### 17.4 可维护性与最佳实践
**知识点说明**
- 小函数 + 清晰命名 + 模块化是可维护性的核心
- 避免共享可变状态，减少副作用

**Demo**
```js
function getFullName(user) {
  return `${user.firstName} ${user.lastName}`;
}

export function formatUser(user) {
  return { ...user, fullName: getFullName(user) };
}
```

**案例说明**
- 统一风格规范与 lint 配置可降低协作成本

### 17.5 性能与内存实践
**知识点说明**
- 避免频繁 DOM 读写混用（layout thrash）
- 使用节流/防抖控制高频事件
- 清理定时器与事件监听

**Demo**
```js
function throttle(fn, wait = 100) {
  let inFlight = false;
  return (...args) => {
    if (inFlight) return;
    inFlight = true;
    fn(...args);
    setTimeout(() => {
      inFlight = false;
    }, wait);
  };
}
```

**案例说明**
- 列表滚动/窗口 resize 建议使用节流优化

**关键点**
- 错误必须可观测（日志/监控/报警）
- 调试工具能显著缩短定位时间
- 维护性与性能是生产级代码的核心指标

---

## 18. 复习建议
- 先掌握“变量 + 类型 + 函数 + 控制流 + 模块”，再进入 TypeScript。
- DOM/事件/网络请求是浏览器端工程的最小可用集合。
- 高阶方法（`map/filter/reduce`）比手写循环更清晰。
- `===`、`??`、`?.` 是现代 JS 的基础操作符组合。
