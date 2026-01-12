# Day0 - JavaScript 语法基础与运行时常识

> 目标：补齐 JavaScript 基础语法与常见内置类型，理解函数、类与模块化，为 Day1 TypeScript 学习做准备。
>
> 详细笔记：`day0/core-syntax.md`

## 0. 参考资料（Reference）
- MDN JavaScript 指南：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- MDN 内置对象总览：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
- ECMAScript 语言规范：https://tc39.es/ecma262/

---

## 1. 变量、类型与内置对象

### 1.1 变量声明与作用域（var / let / const）
**知识点说明**
- `const`：变量绑定不可重新赋值，适合默认选择。
- `let`：块级作用域，可重新赋值。
- `var`：函数作用域 + 变量提升（hoisting），容易引入隐藏 bug，尽量避免。

**Demo**
```js
// 块级作用域
if (true) {
  const a = 1;
  let b = 2;
  // var 会提升到函数作用域
  var c = 3;
}
// console.log(a); // ReferenceError
// console.log(b); // ReferenceError
console.log(c); // 3

// const 不能重新赋值，但对象内容可变
const user = { name: 'Ada' };
user.name = 'Grace';
// user = {}; // TypeError
```

**案例说明**
- 业务中默认使用 `const`，只有在需要重新赋值时再使用 `let`。
- 仅在理解变量提升机制时需要 `var`。

---

### 1.2 原始类型（Primitive）与常用内置方法

#### 1.2.1 string
**常用方法**：`includes`、`startsWith`、`endsWith`、`slice`、`replace`、`split`、`trim`、`toLowerCase`。

**Demo**
```js
const title = '  Hello JS  ';
const clean = title.trim().toLowerCase();
const slug = clean.replace(/\s+/g, '-');
const hasJs = slug.includes('js');
```

**案例说明**
- 生成 URL slug、过滤关键词、拼接展示文本时最常用。

#### 1.2.2 number
**常用方法**：`toFixed`、`Number.isNaN`、`Number.isFinite`、`parseInt`、`Math.round`、`Math.max`。

**Demo**
```js
const price = 19.9;
const withTax = Number((price * 1.07).toFixed(2));

const raw = '42px';
const parsed = parseInt(raw, 10); // 42
const isValid = Number.isFinite(parsed);
```

**案例说明**
- 金额、比例、坐标等计算时必用；注意 `toFixed` 返回字符串。

#### 1.2.3 boolean
**常用方法**：`Boolean()` 强制转换。

**Demo**
```js
const isAdmin = Boolean('admin'); // true
const hasValue = Boolean(0); // false
```

**案例说明**
- 主要用于条件分支和开关状态判断。

#### 1.2.4 null / undefined
**常用语法**：`??` 空值合并，`?.` 可选链。

**Demo**
```js
const config = { timeout: 0 };
const timeout = config.timeout ?? 3000; // 0
const deepValue = config.profile?.city ?? 'Unknown';
```

**案例说明**
- 区分“未提供”（undefined）和“明确为空”（null）能避免默认值误判。

#### 1.2.5 bigint
**常用方法**：`BigInt()`。

**Demo**
```js
const bigId = BigInt('9007199254740993');
// const wrong = bigId + 1; // TypeError: 不能混用 number
const nextId = bigId + 1n;
```

**案例说明**
- 处理超过 `Number.MAX_SAFE_INTEGER` 的 ID 或序列号。

#### 1.2.6 symbol
**常用方法**：`Symbol()`、`Symbol.for()`。

**Demo**
```js
const metaKey = Symbol('meta');
const obj = { [metaKey]: { internal: true } };

const sameKey = Symbol.for('shared');
const lookup = Symbol.for('shared');
console.log(sameKey === lookup); // true
```

**案例说明**
- 作为对象“私有键”，避免与字符串 key 冲突。

---

### 1.3 引用类型与集合结构

#### 1.3.1 Array
**常用方法**：`map`、`filter`、`reduce`、`find`、`some`、`every`、`includes`、`sort`。

**Demo**
```js
const scores = [60, 80, 90, 100];
const passed = scores.filter((s) => s >= 80);
const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
const firstTop = scores.find((s) => s >= 90);
```

**案例说明**
- 列表渲染、筛选、统计时使用高阶方法替代手写循环。

#### 1.3.2 Object
**常用方法**：`keys`、`values`、`entries`、`assign`、`freeze`、`fromEntries`。

**Demo**
```js
const user = { id: 1, name: 'Ada' };
const entries = Object.entries(user);
const copy = Object.assign({}, user, { role: 'admin' });
Object.freeze(copy);
```

**案例说明**
- 适合结构化数据与配置对象；`freeze` 可避免被意外修改。

#### 1.3.3 Map
**常用方法**：`set`、`get`、`has`、`delete`、`keys`、`values`。

**Demo**
```js
const cache = new Map();
cache.set('user:1', { name: 'Ada' });
if (cache.has('user:1')) {
  console.log(cache.get('user:1'));
}
```

**案例说明**
- 适合频繁读写的键值缓存，键可以是任意类型。

#### 1.3.4 Set
**常用方法**：`add`、`has`、`delete`、`size`。

**Demo**
```js
const tags = new Set(['js', 'ts', 'js']);
const uniqueTags = Array.from(tags);
```

**案例说明**
- 适合去重、集合判断；常用于标签或权限集合。

#### 1.3.5 Date / RegExp / JSON / Error / Promise
**Demo**
```js
const now = new Date();
const iso = now.toISOString();

const isMatch = /\d+/.test('item-42');

const payload = JSON.stringify({ ok: true });
const parsed = JSON.parse(payload);

try {
  throw new Error('Something went wrong');
} catch (error) {
  console.error(error.message);
}

const request = Promise.resolve({ ok: true });
request.then((res) => console.log(res.ok));
```

**案例说明**
- `Date` 用于时间戳与格式化，`RegExp` 用于模式匹配，`JSON` 用于序列化。
- `Promise` 是异步流程的基础，可配合 `async/await` 使用。

---

### 1.4 类型判断与类型转换
**常用方法**：`typeof`、`instanceof`、`Array.isArray`、`Number()`、`String()`。

**Demo**
```js
const value = '42';
const num = Number(value); // 42
const str = String(100); // '100'

console.log(typeof num); // 'number'
console.log(Array.isArray([1, 2, 3])); // true
console.log(new Date() instanceof Date); // true
```

**案例说明**
- 类型判断决定分支路径，转换能避免隐式类型陷阱。

---

## 2. 常见语法与控制流

### 2.1 运算符与表达式
**关键语法**：`===`、`?:`、`&&`、`||`、`??`、`?.`、展开/剩余。

**Demo**
```js
const input = '';
const text = input || 'default'; // 空字符串会被当作 false
const safe = input ?? 'default'; // 仅 null/undefined 才会触发默认值

const user = { profile: { city: 'Shenzhen' } };
const city = user.profile?.city ?? 'Unknown';

const arr = [1, 2, 3];
const extended = [...arr, 4];
```

**案例说明**
- 业务中推荐 `??` 替代 `||`，避免把 `0`/`''` 当成“空值”。

---

### 2.2 条件分支
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

switch (role) {
  case 'admin':
    console.log('full access');
    break;
  case 'editor':
    console.log('limited access');
    break;
  default:
    console.log('read only');
}
```

**案例说明**
- `switch` 适合多分支状态机，避免大量 `if/else`。

---

### 2.3 循环与迭代
**Demo**
```js
const list = ['a', 'b', 'c'];

for (let i = 0; i < list.length; i += 1) {
  console.log(list[i]);
}

for (const item of list) {
  console.log(item);
}

const obj = { a: 1, b: 2 };
for (const key in obj) {
  console.log(key, obj[key]);
}
```

**案例说明**
- `for...of` 遍历值，`for...in` 遍历键，避免混用。

---

### 2.4 异常处理
**Demo**
```js
function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return { error: error.message };
  } finally {
    // 可用于清理资源
  }
}
```

**案例说明**
- 业务中建议把错误转换为统一结构返回，避免直接抛出给 UI。

---

## 3. 函数语法：基础与高级

### 3.1 函数定义方式
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
- 函数声明会提升，函数表达式与箭头函数不会提升。

---

### 3.2 参数、默认值与剩余参数
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
- 默认参数可减少 null/undefined 判断；解构参数提升可读性。

---

### 3.3 this 与绑定规则
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
- `bind` 可固定 this，适合事件回调或解构方法使用。

---

### 3.4 闭包与高阶函数
**Demo**
```js
function createCounter(start = 0) {
  let count = start;
  return () => ++count;
}

const next = createCounter();
next(); // 1
next(); // 2

function once(fn) {
  let called = false;
  return (...args) => {
    if (called) return;
    called = true;
    return fn(...args);
  };
}
```

**案例说明**
- 闭包可保存私有状态，用于计数器、防抖、缓存等场景。

---

### 3.5 Promise 与 async/await
**Demo**
```js
function fetchJson(url) {
  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error('Request failed');
      return res.json();
    })
    .catch((err) => ({ error: err.message }));
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
- `async/await` 更接近同步流程，但仍需 `try/catch` 捕获错误。

---

### 3.6 生成器（Generator）
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
- 适合流式迭代或惰性计算，例如分页加载。

---

## 4. 对象模型、接口与类

### 4.1 对象字面量与访问器
**Demo**
```js
const user = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  set fullName(value) {
    const [first, last] = value.split(' ');
    this.firstName = first;
    this.lastName = last || '';
  },
};
```

**案例说明**
- getter/setter 用于字段计算与输入校验。

---

### 4.2 原型与继承
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
- JavaScript 的继承基于原型链，class 只是语法糖。

---

### 4.3 Class 语法
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
- `#` 私有字段仅在类内部可访问；`static` 表示类级别属性。

---

### 4.4 Interface（TypeScript）与 JSDoc
**Demo（TypeScript）**
```ts
interface User {
  id: number;
  name: string;
  email?: string;
}

class UserRepo {
  save(user: User) {
    // ...
  }
}
```

**Demo（JSDoc）**
```js
// @ts-check

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string=} email
 */

/** @param {User} user */
function saveUser(user) {
  // ...
}
```

**案例说明**
- JS 本身无 interface，TS 或 JSDoc 可提供结构描述与类型提示。

---

## 5. 模块系统（ES Modules）

### 5.1 命名导出与默认导出
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
- 默认导出适合模块主功能；命名导出适合工具函数或常量。

---

### 5.2 重新导出与动态导入
**Demo**
```js
// index.js
export { default as UserService } from './userService.js';
export * from './utils.js';

// 动态导入
const { default: Config } = await import('./config.js');
```

**案例说明**
- 动态导入适合按需加载或减少首屏体积。

---

## 6. 小结与建议
- 先掌握“变量 + 类型 + 函数 + 控制流 + 模块”，再进入 TS。
- 在项目中用 `const`、`===`、`??` 等现代语法提升可读性。
- 使用 Array/Map/Set 等内置对象代替手写算法，提高表达力。
