# Day1 核心语法速览（官方文档整理）

> 官方资料：
> - https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
> - https://www.typescriptlang.org/docs/handbook/2/narrowing.html
> - https://www.typescriptlang.org/docs/handbook/2/objects.html
> - https://www.typescriptlang.org/docs/handbook/2/functions.html
> - https://www.typescriptlang.org/docs/handbook/2/generics.html
> - https://www.typescriptlang.org/docs/handbook/2/modules.html
> - https://www.typescriptlang.org/docs/handbook/utility-types.html
>
> 说明：本文与 `day1/demos/*.ts` 一一对应，运行/调试命令见 demo 文件注释。
> 锚点：`core-1` ~ `core-10`，用于与 demo 注释跳转对应。

<a id="core-1"></a>
## 1. 类型注解与推断
- 注解：显式声明类型，保证可读性与意图明确。
- 推断：编译器基于赋值或返回值自动推断类型。
- widening / narrowing 规则：字面量会被“放宽”到基础类型，控制流与类型守卫会“收窄”到更具体的类型。

```ts
const count = 1; // 推断为 number
const title: string = 'TypeScript'; // 显式注解
let mode = 'dev'; // 推断为 string
const env = 'prod'; // const 推断为字面量类型 "prod"
```

### 1.1 Widening / Narrowing 规则速记
- widening（放宽）：`let`/可变对象初始化时，字面量通常放宽为 `string`/`number`/`boolean`。
- const 字面量：`const env = 'prod'` 会保留字面量类型；对象仍会对属性放宽，需要 `as const` 冻结。
- `as const`：把对象/数组转为只读并保留字面量类型。
- 上下文类型（contextual typing）：例如函数参数或数组元素会被上下文类型“约束”。

```ts
let kind = 'mouse'; // widening -> string
const mode = 'dev'; // 保留字面量 "dev"

const theme = { mode: 'dark' }; // mode: string
const fixedTheme = { mode: 'dark' } as const; // mode: "dark"

const list: Array<'on' | 'off'> = ['on']; // 元素被上下文类型约束
```

<a id="core-2"></a>
## 2. 基础类型与集合
- 原始类型：`string`/`number`/`boolean`/`bigint`/`symbol`/`null`/`undefined`。
- 数组：`T[]` 或 `Array<T>`；只读数组用 `ReadonlyArray<T>`。
- 元组：固定长度 + 固定位置类型，支持 labeled tuple。
- 对象类型：描述属性形状，配合 `readonly`/`?` 管控可变性与可缺省。

```ts
const ids: number[] = [1, 2, 3];
const tags: ReadonlyArray<string> = ['ts', 'types'];

type Point = [x: number, y: number];
const origin: Point = [0, 0];

interface User {
  readonly id: string;
  name: string;
  email?: string;
}
```

### 2.1 基础类型使用场景
- `string`: UI 文案、URL 拼接、slug。
- `number`: 价格、计数、比例。
- `boolean`: 开关状态、权限判断。
- `bigint`: 超过 `Number` 安全范围的 ID 或序列号。
- `symbol`: 作为对象“私有键”，避免与字符串 key 冲突。
- `null`: 明确的“空值”，表达“刻意清空/没有值”。
- `undefined`: 缺省/未赋值，常见于可选参数或缺失字段。

```ts
const title = 'TypeScript Day1';
const slug = title.toLowerCase().replace(' ', '-');
const apiUrl = `https://api.example.com/${slug}`;

const price = 19.99;
const priceWithTax = price * 1.07;

const isEnabled = true;
const stateLabel = isEnabled ? 'enabled' : 'disabled';

const bigId = BigInt('9007199254740991');
const nextId = bigId + BigInt(1);

const metaKey = Symbol('meta');
const user = { id: 'u1', [metaKey]: { internal: true } };
const metaValue = user[metaKey];

const nickname: string | null = null;
const config: { timeout?: number } = {};
const timeout = config.timeout ?? 3000;
```

### 2.2 数组 / 只读数组 / 元组使用场景
- 数组：列表数据的统计、过滤、映射。
- 只读数组：作为配置列表，避免被意外修改。
- 元组：固定长度的结构化数据（如坐标/范围）。

```ts
const scores: number[] = [1, 2, 3];
const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
const increased = scores.map((score) => score + 1);

const tags: ReadonlyArray<string> = ['ts', 'types'];
const tagCopy = [...tags, 'advanced'];

type Point = [x: number, y: number];
const origin: Point = [0, 0];
const moved: Point = [origin[0] + 1, origin[1] + 1];
```

<a id="core-3"></a>
## 3. 组合类型与字面量类型
- 联合类型 `A | B`：值可能属于多种类型之一。
- 交叉类型 `A & B`：值必须同时满足多个类型。
- 字面量类型与模板字面量类型表达更精确的取值范围。

```ts
type Status = 'pending' | 'approved' | 'rejected';
type Tag = `tag:${string}`;

type WithId = { id: string };
type WithTimestamp = { createdAt: Date };
type Audited = WithId & WithTimestamp;
```

### 3.1 组合类型使用场景
- 联合类型：流程状态只能取有限集合。
- 字面量/模板字面量：统一前缀或约束值空间。
- 交叉类型：组合多个职责（身份 + 审计信息）。

```ts
type Status = 'pending' | 'approved' | 'rejected';
const statusLabels: Record<Status, string> = {
  pending: '等待中',
  approved: '已通过',
  rejected: '已拒绝',
};

type TopicTag = `tag:${string}`;
const tag: TopicTag = 'tag:ts';

type WithId = { id: string };
type WithCreatedAt = { createdAt: Date };
type Audited = WithId & WithCreatedAt;
const record: Audited = { id: 'a1', createdAt: new Date() };
```

<a id="core-4"></a>
## 4. 特殊类型：any / unknown / never / void
- `any`：关闭类型检查，方便但不安全。
- `unknown`：必须先收窄才能使用。
- `never`：不可能到达的分支，常用于穷尽检查。
- `void`：无返回值（如日志函数、事件处理）。

```ts
let flexible: any = 'anything';
let maybe: unknown = Math.random() > 0.5 ? 'ok' : 1;

function log(message: string): void {
  console.log(message);
}

function fail(message: string): never {
  throw new Error(message);
}
```

### 4.1 特殊类型使用场景
- `any`: 旧系统/第三方库的动态结构（风险高）。
- `unknown`: 运行时输入（先校验再使用）。
- `never`: 可辨识联合的穷尽检查。
- `void`: 不需要返回值的函数。

```ts
const legacy: any = JSON.parse('{"id":1,"name":"Legacy"}');
const legacyName = legacy.name;

const payload: unknown = JSON.parse('{"timeout":5000}');
let timeout = 0;
if (typeof payload === 'object' && payload !== null && 'timeout' in payload) {
  timeout = Number((payload as { timeout: unknown }).timeout);
}

function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

function notify(message: string): void {
  console.log(message);
}
```

<a id="core-5"></a>
## 5. 类型收窄（Narrowing）
- `typeof`/`instanceof`/`in`/相等性检查收窄联合类型。
- 可辨识联合（有 `kind` 字段）配合 `switch` 进行穷尽检查。
- 控制流分析：`if`/`return`/`throw` 会影响后续分支中的类型。

```ts
function format(input: string | number) {
  if (typeof input === 'string') {
    return input.toUpperCase();
  }
  return input.toFixed(2);
}

class NetworkError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number };

function area(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.size ** 2;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
```

<a id="core-6"></a>
## 6. 对象与接口（Objects & Interfaces）
- `interface` 与 `type` 都能描述对象；`interface` 支持声明合并，`type` 更适合组合联合/交叉。
- `extends`/交叉类型扩展结构；索引签名描述字典对象。

```ts
interface BaseUser {
  id: string;
  name: string;
}

interface Admin extends BaseUser {
  role: 'admin';
}

type Timestamped = { createdAt: Date };
type AuditUser = BaseUser & Timestamped;

interface StringMap {
  [key: string]: string;
}
```

<a id="core-7"></a>
## 7. 函数类型
- 参数/返回值注解、可选参数、默认参数、剩余参数。
- `this` 参数描述调用时上下文；重载描述多种入参形状。

```ts
function greet(name: string, suffix?: string): string {
  return `${name}${suffix ?? ''}`;
}

function sum(label: string, ...nums: number[]) {
  return `${label}: ${nums.reduce((a, b) => a + b, 0)}`;
}

function parse(input: string): number;
function parse(input: number): string;
function parse(input: string | number) {
  return typeof input === 'string' ? Number(input) : input.toString();
}

function printWithThis(this: { prefix: string }, message: string) {
  console.log(this.prefix + message);
}
```

<a id="core-8"></a>
## 8. 泛型与高级类型（Generics）
- 泛型函数/接口/类复用类型逻辑。
- `extends` 约束限定类型范围；`keyof` + 索引访问类型让属性安全可取。
- 条件类型与 `infer` 抽取类型信息。
- 工具类型用于批量转换结构。

```ts
function identity<T>(value: T): T {
  return value;
}

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

type ElementType<T> = T extends (infer U)[] ? U : T;

interface User {
  id: string;
  name: string;
  email?: string;
}

type UserPreview = Pick<User, 'id' | 'name'>;
type UserUpdate = Partial<User>;
type UsersById = Record<string, User>;
```

<a id="core-9"></a>
## 9. 模块与导入导出（Modules）
- 命名导出/默认导出是 ESM 的基础语法。
- `import type`/`export type` 用于类型导入导出，运行时被擦除。
- 桶文件（barrel）统一对外导出模块 API。

```ts
// lib/math.ts
export default function sum(a: number, b: number) {
  return a + b;
}
export const PI = 3.14159;

// lib/index.ts
export { default as sum } from './math';
export { PI } from './math';

// consumer.ts
import sum, { PI } from './lib/math';
import type { Todo } from './lib';
```

<a id="core-10"></a>
## 10. Demo 对照
- `day1/demos/01-everyday-types-and-narrowing.ts`
- `day1/demos/02-objects-interfaces-functions.ts`
- `day1/demos/03-generics-and-utility-types.ts`
- `day1/demos/04-modules.ts`
