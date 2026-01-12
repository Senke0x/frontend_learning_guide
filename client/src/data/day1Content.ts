export const day1Content = {
  day: 1,
  title: 'TypeScript 基础与类型系统',
  subtitle: '从动态到静态：为 JavaScript 添加类型安全',
  overview: `TypeScript 是由微软开发的开源编程语言，它是 JavaScript 的超集，为其添加了可选的静态类型系统和基于类的面向对象编程特性。对于具有 C++/Java 背景的开发者来说，TypeScript 会感到非常熟悉，因为它借鉴了许多传统静态类型语言的概念。

TypeScript 的核心价值在于它能够在编译阶段就发现类型错误，而不是等到运行时才发现。这种"早期错误发现"的能力大大提高了代码质量和开发效率，特别是在大型项目中。`,
  sections: [
    {
      title: '为什么选择 TypeScript',
      background: `JavaScript 最初是为浏览器设计的脚本语言，其动态类型特性虽然带来了灵活性，但也导致了许多运行时错误。随着前端应用规模的增长，JavaScript 的这些问题变得越来越突出。

2012年，微软发布了 TypeScript，旨在解决大规模 JavaScript 应用开发中的痛点。TypeScript 的设计目标是：
- 与 JavaScript 完全兼容（任何有效的 JS 代码都是有效的 TS 代码）
- 提供可选的静态类型检查
- 支持最新的 ECMAScript 特性
- 提供强大的 IDE 支持

如今，TypeScript 已成为前端开发的事实标准，被 Angular、Vue 3、React 等主流框架广泛采用。根据 2024 年 Stack Overflow 调查，TypeScript 是最受欢迎的编程语言之一。`,
      content: `TypeScript 相比 JavaScript 的核心优势：

**1. 编译时类型检查**
TypeScript 编译器会在代码运行前检查类型错误。这意味着许多常见的 bug（如拼写错误、类型不匹配）可以在开发阶段就被发现，而不是等到用户使用时才暴露。

**2. 强大的 IDE 支持**
由于类型信息的存在，IDE 可以提供：
- 精确的自动补全（不再是猜测性的建议）
- 实时错误提示
- 安全的重构支持（重命名变量、提取函数等）
- 跳转到定义、查找引用等导航功能

**3. 自文档化代码**
类型注解本身就是代码文档。当你看到 \`function getUser(id: number): Promise<User>\` 时，你立即知道这个函数接收一个数字参数，返回一个 User 类型的 Promise。

**4. 渐进式采用**
你可以逐步将现有的 JavaScript 项目迁移到 TypeScript，不需要一次性重写所有代码。TypeScript 的严格程度是可配置的。`,
      codeExample: `// ==========================================
// JavaScript vs TypeScript 对比示例
// ==========================================

// ----- JavaScript 版本 -----
// 运行时才能发现错误，IDE 无法提供有效帮助

function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    // 如果 item.price 是字符串 "10"，这里会变成字符串拼接
    total += item.price * item.quantity;
  }
  return total;
}

// 调用时传入错误的数据结构，JavaScript 不会报错
const result = calculateTotal([
  { price: "10", quantity: 2 },  // price 应该是数字
  { cost: 20, amount: 1 }        // 字段名错误
]);
console.log(result); // NaN - 运行时才发现问题

// ----- TypeScript 版本 -----
// 编译时就能发现所有错误

// 首先定义数据结构
interface CartItem {
  name: string;
  price: number;      // 明确指定为数字类型
  quantity: number;
}

function calculateTotal(items: CartItem[]): number {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}

// TypeScript 编译器会报错：
// 错误1: Type 'string' is not assignable to type 'number'
// 错误2: Property 'price' is missing in type '{ cost: number; amount: number; }'
const result = calculateTotal([
  { name: "Apple", price: "10", quantity: 2 },  // ❌ 编译错误
  { cost: 20, amount: 1 }                        // ❌ 编译错误
]);

// 正确的调用方式
const correctResult = calculateTotal([
  { name: "Apple", price: 10, quantity: 2 },
  { name: "Banana", price: 5, quantity: 3 }
]);
console.log(correctResult); // 35`,
      keyPoints: [
        '类型检查发生在编译阶段，不影响运行时性能',
        'TypeScript 最终会被编译成纯 JavaScript，可以在任何支持 JS 的环境运行',
        '类型注解是可选的，你可以根据需要选择性地添加类型',
        'tsconfig.json 文件控制 TypeScript 的编译选项和严格程度'
      ],
      references: [
        { text: 'TypeScript 官方手册', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
        { text: 'TypeScript 5分钟入门', url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html' },
        { text: 'TypeScript 中文文档', url: 'https://www.tslang.cn/docs/home.html' }
      ]
    },
    {
      title: '基本类型与类型注解',
      background: `类型注解是 TypeScript 的核心特性。它允许开发者显式地指定变量、函数参数和返回值的类型。TypeScript 的类型系统设计目标是"结构化类型"（Structural Typing），也称为"鸭子类型"——如果两个类型具有相同的结构，它们就是兼容的。

这与 C++/Java 的"名义类型"（Nominal Typing）不同。在名义类型系统中，即使两个类有完全相同的属性和方法，如果它们的类名不同，它们就是不兼容的。而在 TypeScript 中，只要结构匹配，类型就兼容。`,
      content: `**原始类型（Primitive Types）**

TypeScript 支持 JavaScript 的所有原始类型：
- \`boolean\`: 布尔值，true 或 false
- \`number\`: 数字，包括整数和浮点数（JavaScript 没有 int/float 区分）
- \`string\`: 字符串
- \`null\` 和 \`undefined\`: 空值类型
- \`symbol\`: ES6 引入的唯一标识符
- \`bigint\`: 大整数（ES2020）

**特殊类型**

- \`any\`: 任意类型，相当于关闭类型检查（应避免使用）
- \`unknown\`: 安全的 any，使用前必须进行类型检查
- \`never\`: 永不返回的函数（如抛出异常或无限循环）
- \`void\`: 没有返回值的函数

**复合类型**

- 数组: \`number[]\` 或 \`Array<number>\`
- 元组: \`[string, number]\` 固定长度和类型的数组
- 联合类型: \`string | number\` 可以是多种类型之一
- 交叉类型: \`TypeA & TypeB\` 同时具有多种类型的特性`,
      codeExample: `// ==========================================
// TypeScript 基本类型详解
// ==========================================

// ----- 原始类型 -----
const isActive: boolean = true;
const count: number = 42;
const price: number = 99.99;        // JavaScript 中数字都是浮点数
const name: string = "Alice";
const nothing: null = null;
const notDefined: undefined = undefined;

// ----- 数组类型 -----
// 两种等价的写法
const numbers: number[] = [1, 2, 3, 4, 5];
const strings: Array<string> = ["hello", "world"];

// 只读数组 - 防止意外修改
const readonlyNumbers: readonly number[] = [1, 2, 3];
// readonlyNumbers.push(4); // ❌ 错误：只读数组不能修改

// ----- 元组类型 -----
// 固定长度和类型的数组，常用于函数返回多个值
const coordinate: [number, number] = [10, 20];
const userInfo: [string, number, boolean] = ["Alice", 25, true];

// 带标签的元组（TypeScript 4.0+）- 提高可读性
const point: [x: number, y: number] = [10, 20];

// React useState 返回的就是元组
// const [state, setState] = useState<number>(0);

// ----- 联合类型 -----
// 变量可以是多种类型之一
let id: string | number;
id = "abc123";  // ✅ OK
id = 123;       // ✅ OK
// id = true;   // ❌ 错误：boolean 不在联合类型中

// 字面量联合类型 - 限制值的范围
type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending";
// orderStatus = "cancelled"; // ❌ 错误：不在允许的值中

// ----- 类型推断 -----
// TypeScript 可以自动推断类型，不需要显式注解
let inferredString = "hello";  // 推断为 string
let inferredNumber = 42;       // 推断为 number
let inferredArray = [1, 2, 3]; // 推断为 number[]

// ----- any vs unknown -----
// any: 关闭类型检查（危险！）
let anyValue: any = "hello";
anyValue = 42;
anyValue.nonExistentMethod(); // 不会报错，但运行时会崩溃

// unknown: 安全的 any，使用前必须检查类型
let unknownValue: unknown = "hello";
// unknownValue.toUpperCase(); // ❌ 错误：unknown 类型不能直接使用

// 必须先进行类型检查（类型守卫）
if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase()); // ✅ OK，这里 unknownValue 是 string
}

// ----- never 类型 -----
// 用于永远不会返回的函数
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // 永远不会结束
  }
}

// never 也用于穷尽检查
type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return Math.PI * 10 * 10;
    case "square":
      return 10 * 10;
    case "triangle":
      return (10 * 10) / 2;
    default:
      // 如果 Shape 添加了新类型但这里没处理，TypeScript 会报错
      const exhaustiveCheck: never = shape;
      throw new Error(\`Unhandled shape: \${exhaustiveCheck}\`);
  }
}`,
      keyPoints: [
        '优先使用 unknown 而不是 any，保持类型安全',
        '利用类型推断减少冗余的类型注解',
        '使用字面量联合类型限制变量的可能值',
        '元组适合返回固定数量的多个值',
        'never 类型用于穷尽检查，确保处理所有可能的情况'
      ],
      references: [
        { text: 'TypeScript 基本类型', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' },
        { text: 'TypeScript 类型收窄', url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html' }
      ]
    },
    {
      title: '接口与类型别名',
      background: `在 TypeScript 中，定义对象类型有两种主要方式：接口（Interface）和类型别名（Type Alias）。这两种方式在大多数情况下可以互换使用，但它们有一些细微的差别。

接口最初是为了定义对象的"形状"而设计的，它源自面向对象编程的概念。类型别名则更加灵活，可以为任何类型创建别名，包括原始类型、联合类型、元组等。

在实际项目中，一个常见的约定是：
- 使用接口定义对象结构（特别是当需要继承或实现时）
- 使用类型别名定义联合类型、交叉类型或复杂的类型组合`,
      content: `**接口（Interface）的特点**

1. **声明合并**: 同名接口会自动合并，这在扩展第三方库的类型时很有用
2. **继承**: 接口可以使用 extends 继承其他接口
3. **实现**: 类可以使用 implements 实现接口
4. **只能描述对象类型**: 接口不能定义原始类型的别名

**类型别名（Type Alias）的特点**

1. **更灵活**: 可以定义任何类型，包括原始类型、联合类型、元组等
2. **不能声明合并**: 同名类型别名会报错
3. **支持交叉类型**: 使用 & 组合多个类型
4. **支持映射类型**: 可以基于已有类型创建新类型`,
      codeExample: `// ==========================================
// 接口与类型别名详解
// ==========================================

// ----- 接口定义 -----
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;           // 可选属性
  readonly createdAt: Date; // 只读属性
}

// 使用接口
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date()
};

// user.createdAt = new Date(); // ❌ 错误：只读属性不能修改

// ----- 接口继承 -----
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: string;
  department: string;
  salary: number;
}

// Employee 包含 Person 的所有属性
const employee: Employee = {
  name: "Bob",
  age: 30,
  employeeId: "E001",
  department: "Engineering",
  salary: 100000
};

// 多重继承
interface Manager extends Employee {
  teamSize: number;
  reports: Employee[];
}

// ----- 接口声明合并 -----
// 同名接口会自动合并（这是接口独有的特性）
interface Config {
  apiUrl: string;
}

interface Config {
  timeout: number;
}

// Config 现在同时有 apiUrl 和 timeout
const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};

// ----- 类型别名定义 -----
type Point = {
  x: number;
  y: number;
};

// 类型别名可以定义原始类型（接口不行）
type ID = string | number;
type Name = string;

// ----- 联合类型 -----
type Status = "pending" | "processing" | "completed" | "failed";
type Result<T> = { success: true; data: T } | { success: false; error: string };

// 使用联合类型
function handleResult(result: Result<User>) {
  if (result.success) {
    console.log(result.data.name); // TypeScript 知道这里有 data
  } else {
    console.log(result.error);     // TypeScript 知道这里有 error
  }
}

// ----- 交叉类型 -----
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type SoftDeletable = {
  deletedAt: Date | null;
  isDeleted: boolean;
};

// 组合多个类型
type AuditableUser = User & Timestamped & SoftDeletable;

const auditableUser: AuditableUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  isDeleted: false
};

// ----- 函数类型 -----
// 使用类型别名定义函数类型
type Comparator<T> = (a: T, b: T) => number;

const numberComparator: Comparator<number> = (a, b) => a - b;
const stringComparator: Comparator<string> = (a, b) => a.localeCompare(b);

// 使用接口定义函数类型（较少见）
interface SearchFunction {
  (source: string, subString: string): boolean;
}

const search: SearchFunction = (source, subString) => {
  return source.includes(subString);
};

// ----- 类实现接口 -----
interface Printable {
  print(): void;
}

interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

class Document implements Printable, Serializable {
  constructor(public content: string) {}

  print(): void {
    console.log(this.content);
  }

  serialize(): string {
    return JSON.stringify({ content: this.content });
  }

  deserialize(data: string): void {
    const parsed = JSON.parse(data);
    this.content = parsed.content;
  }
}

// ----- 索引签名 -----
// 当对象的键是动态的时候使用
interface Dictionary<T> {
  [key: string]: T;
}

const scores: Dictionary<number> = {
  alice: 95,
  bob: 87,
  charlie: 92
};

// 也可以限制键的类型
interface NumericDictionary<T> {
  [key: number]: T;
}

const items: NumericDictionary<string> = {
  0: "first",
  1: "second",
  2: "third"
};`,
      keyPoints: [
        '接口适合定义对象结构，支持继承和声明合并',
        '类型别名更灵活，可以定义任何类型',
        '使用 readonly 防止属性被意外修改',
        '使用 ? 标记可选属性',
        '交叉类型用于组合多个类型，联合类型用于表示"或"的关系',
        '索引签名用于定义动态键的对象类型'
      ],
      references: [
        { text: 'TypeScript 对象类型', url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html' },
        { text: 'TypeScript 接口', url: 'https://www.typescriptlang.org/docs/handbook/interfaces.html' }
      ]
    },
    {
      title: '泛型编程',
      background: `泛型（Generics）是 TypeScript 最强大的特性之一，它允许你编写可重用的、类型安全的代码。泛型的概念来自于 C++ 的模板和 Java 的泛型，但 TypeScript 的实现更加灵活。

泛型的核心思想是"参数化类型"——你可以把类型当作参数传递给函数、类或接口。这样，同一段代码可以处理多种类型，同时保持类型安全。

没有泛型时，你要么为每种类型写重复的代码，要么使用 any 放弃类型检查。泛型让你两全其美：代码复用 + 类型安全。`,
      content: `**泛型的使用场景**

1. **泛型函数**: 处理多种类型的通用函数
2. **泛型接口**: 定义可配置类型的数据结构
3. **泛型类**: 创建类型安全的容器类
4. **泛型约束**: 限制泛型参数必须满足某些条件
5. **泛型工具类型**: TypeScript 内置的类型转换工具

**常用的内置泛型工具类型**

- \`Partial<T>\`: 将所有属性变为可选
- \`Required<T>\`: 将所有属性变为必需
- \`Readonly<T>\`: 将所有属性变为只读
- \`Pick<T, K>\`: 从类型中选择部分属性
- \`Omit<T, K>\`: 从类型中排除部分属性
- \`Record<K, V>\`: 创建键值对类型`,
      codeExample: `// ==========================================
// 泛型编程详解
// ==========================================

// ----- 泛型函数 -----
// 不使用泛型的问题
function identityAny(arg: any): any {
  return arg;
}
// 调用后丢失类型信息
const result1 = identityAny("hello"); // result1 是 any，不是 string

// 使用泛型保持类型信息
function identity<T>(arg: T): T {
  return arg;
}

// 调用时可以显式指定类型
const result2 = identity<string>("hello"); // result2 是 string
// 也可以让 TypeScript 自动推断
const result3 = identity(42); // result3 是 number（自动推断）

// ----- 多个类型参数 -----
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p1 = pair("hello", 42);        // [string, number]
const p2 = pair(true, { x: 1 });     // [boolean, { x: number }]

// 交换两个值的类型
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

const swapped = swap(["hello", 42]); // [number, string]

// ----- 泛型约束 -----
// 限制泛型参数必须有 length 属性
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): number {
  console.log(arg.length);
  return arg.length;
}

logLength("hello");      // ✅ string 有 length
logLength([1, 2, 3]);    // ✅ 数组有 length
logLength({ length: 5 }); // ✅ 对象有 length 属性
// logLength(42);        // ❌ number 没有 length

// 约束泛型参数必须是对象的键
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 25 };
const name = getProperty(person, "name"); // string
const age = getProperty(person, "age");   // number
// getProperty(person, "email");          // ❌ "email" 不是 person 的键

// ----- 泛型接口 -----
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: number;
}

// 不同的数据类型使用同一个响应结构
type UserResponse = ApiResponse<{
  id: number;
  name: string;
  email: string;
}>;

type ProductListResponse = ApiResponse<{
  products: Array<{ id: number; name: string; price: number }>;
  total: number;
  page: number;
}>;

// ----- 泛型类 -----
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }
}

// 使用泛型类
const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
const num = numberContainer.get(0); // number | undefined

const userContainer = new Container<{ id: number; name: string }>();
userContainer.add({ id: 1, name: "Alice" });
const user = userContainer.find(u => u.id === 1);

// ----- 泛型工具类型 -----
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Partial: 所有属性变为可选（用于更新操作）
type UpdateUserDto = Partial<User>;
const update: UpdateUserDto = { name: "New Name" }; // 只更新 name

// Pick: 选择部分属性
type UserPublicInfo = Pick<User, "id" | "name" | "email">;
const publicInfo: UserPublicInfo = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// Omit: 排除部分属性
type UserWithoutPassword = Omit<User, "password">;

// Required: 所有属性变为必需
type RequiredUser = Required<Partial<User>>;

// Readonly: 所有属性变为只读
type ReadonlyUser = Readonly<User>;

// Record: 创建键值对类型
type UserRoles = Record<string, "admin" | "user" | "guest">;
const roles: UserRoles = {
  alice: "admin",
  bob: "user",
  charlie: "guest"
};

// ----- 条件类型 -----
// 根据条件选择类型
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// 提取数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : never;

type StringElement = ElementType<string[]>;  // string
type NumberElement = ElementType<number[]>;  // number

// 提取 Promise 的值类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type PromiseString = UnwrapPromise<Promise<string>>;  // string
type JustNumber = UnwrapPromise<number>;              // number

// ----- 实际应用示例：类型安全的事件系统 -----
interface EventMap {
  userLogin: { userId: string; timestamp: Date };
  userLogout: { userId: string };
  pageView: { path: string; referrer?: string };
  error: { message: string; stack?: string };
}

class TypedEventEmitter<T extends Record<string, any>> {
  private listeners: Partial<{ [K in keyof T]: Array<(data: T[K]) => void> }> = {};

  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners[event]?.forEach(callback => callback(data));
  }
}

const emitter = new TypedEventEmitter<EventMap>();

// 类型安全的事件监听
emitter.on("userLogin", (data) => {
  console.log(data.userId);    // ✅ TypeScript 知道 data 的类型
  console.log(data.timestamp);
});

// 类型安全的事件触发
emitter.emit("userLogin", {
  userId: "123",
  timestamp: new Date()
});

// emitter.emit("userLogin", { wrong: "data" }); // ❌ 类型错误`,
      keyPoints: [
        '泛型让你编写可重用且类型安全的代码',
        '使用 extends 约束泛型参数必须满足某些条件',
        'keyof 获取对象类型的所有键，常与泛型配合使用',
        '熟练使用 Partial、Pick、Omit 等工具类型可以大大减少重复代码',
        '条件类型 T extends U ? X : Y 可以根据类型条件选择不同的类型',
        'infer 关键字用于在条件类型中推断类型'
      ],
      references: [
        { text: 'TypeScript 泛型', url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html' },
        { text: 'TypeScript 工具类型', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html' },
        { text: 'TypeScript 条件类型', url: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html' }
      ]
    },
    {
      title: '模块系统与项目配置',
      background: `TypeScript 支持多种模块系统，但现代项目主要使用 ES Modules（ESM）。理解模块系统对于组织大型项目至关重要。

tsconfig.json 是 TypeScript 项目的配置文件，它控制编译器的行为。正确配置 tsconfig.json 可以帮助你：
- 设置适当的类型检查严格程度
- 配置模块解析策略
- 指定编译目标和输出格式
- 启用或禁用特定的语言特性`,
      content: `**ES Modules 语法**

- \`export\`: 导出模块成员
- \`import\`: 导入模块成员
- \`export default\`: 默认导出
- \`import * as\`: 导入所有成员

**tsconfig.json 重要选项**

- \`strict\`: 启用所有严格类型检查
- \`target\`: 编译目标（ES5, ES6, ES2020 等）
- \`module\`: 模块系统（CommonJS, ESNext 等）
- \`moduleResolution\`: 模块解析策略
- \`baseUrl\` 和 \`paths\`: 路径别名配置`,
      codeExample: `// ==========================================
// 模块系统与项目配置
// ==========================================

// ----- 导出语法 -----

// types.ts - 命名导出
export interface User {
  id: number;
  name: string;
}

export type Status = "active" | "inactive";

export const DEFAULT_PAGE_SIZE = 20;

export function formatDate(date: Date): string {
  return date.toISOString();
}

// 也可以在文件末尾统一导出
// export { User, Status, DEFAULT_PAGE_SIZE, formatDate };

// UserService.ts - 默认导出
export default class UserService {
  async getUser(id: number): Promise<User> {
    // ...
    return { id, name: "Alice" };
  }
}

// ----- 导入语法 -----

// 命名导入
import { User, Status, formatDate } from "./types";

// 重命名导入
import { User as UserType } from "./types";

// 默认导入
import UserService from "./UserService";

// 同时导入默认和命名
import UserService, { User } from "./UserService";

// 导入所有
import * as Types from "./types";
const user: Types.User = { id: 1, name: "Alice" };

// 仅导入类型（不会在编译后的 JS 中出现）
import type { User } from "./types";

// ----- 重新导出 -----

// index.ts - 桶文件（Barrel File）
export { User, Status } from "./types";
export { default as UserService } from "./UserService";
export * from "./utils";

// 使用桶文件简化导入
// 之前: import { User } from "./models/types";
// 之后: import { User } from "./models";

// ==========================================
// tsconfig.json 配置详解
// ==========================================

/*
{
  "compilerOptions": {
    // ----- 类型检查选项 -----
    "strict": true,                    // 启用所有严格检查（强烈推荐）
    "noImplicitAny": true,             // 禁止隐式 any
    "strictNullChecks": true,          // 严格空值检查
    "strictFunctionTypes": true,       // 严格函数类型检查
    "noUnusedLocals": true,            // 报告未使用的局部变量
    "noUnusedParameters": true,        // 报告未使用的参数
    "noImplicitReturns": true,         // 确保函数所有路径都有返回值

    // ----- 模块选项 -----
    "module": "ESNext",                // 使用最新的 ES 模块
    "moduleResolution": "bundler",     // 现代打包器的模块解析
    "esModuleInterop": true,           // 允许默认导入 CommonJS 模块
    "allowSyntheticDefaultImports": true,

    // ----- 编译目标 -----
    "target": "ES2020",                // 编译目标
    "lib": ["ES2020", "DOM"],          // 包含的类型库

    // ----- 路径配置 -----
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],                // @/components -> src/components
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    },

    // ----- 输出选项 -----
    "outDir": "./dist",                // 输出目录
    "rootDir": "./src",                // 源码目录
    "declaration": true,               // 生成 .d.ts 类型声明文件
    "sourceMap": true,                 // 生成 source map

    // ----- 其他选项 -----
    "skipLibCheck": true,              // 跳过库文件的类型检查（加快编译）
    "forceConsistentCasingInFileNames": true,  // 强制文件名大小写一致
    "resolveJsonModule": true,         // 允许导入 JSON 文件
    "isolatedModules": true            // 确保每个文件可以独立编译
  },
  "include": ["src/**/*"],             // 包含的文件
  "exclude": ["node_modules", "dist"]  // 排除的文件
}
*/

// ----- 使用路径别名 -----
// 配置后可以这样导入
import { Button } from "@/components/Button";
import { formatDate } from "@utils/date";

// 而不是相对路径
// import { Button } from "../../../components/Button";

// ----- 声明文件 (.d.ts) -----
// 为没有类型的 JavaScript 库添加类型

// global.d.ts - 全局类型声明
declare global {
  interface Window {
    analytics: {
      track: (event: string, data?: Record<string, any>) => void;
    };
  }
}

// 为第三方库添加类型
declare module "some-untyped-library" {
  export function doSomething(input: string): number;
  export const VERSION: string;
}

// 扩展已有模块的类型
declare module "express" {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

export {}; // 使文件成为模块`,
      keyPoints: [
        '使用 ES Modules 语法（import/export）组织代码',
        '创建桶文件（index.ts）简化导入路径',
        '使用 import type 仅导入类型，不会影响运行时代码',
        '配置 paths 使用路径别名，避免深层相对路径',
        '启用 strict 模式获得最佳的类型检查体验',
        '使用 .d.ts 文件为无类型的库添加类型声明'
      ],
      references: [
        { text: 'TypeScript 模块', url: 'https://www.typescriptlang.org/docs/handbook/2/modules.html' },
        { text: 'tsconfig.json 参考', url: 'https://www.typescriptlang.org/tsconfig' },
        { text: 'TypeScript 声明文件', url: 'https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html' }
      ]
    }
  ],
  homework: [
    {
      title: '创建类型定义文件',
      description: '为一个简单的用户管理系统创建完整的类型定义，包括 User、Role、Permission 等接口，以及相关的类型别名和泛型工具类型。',
      hints: ['使用接口定义数据结构', '使用类型别名定义联合类型', '创建泛型的 API 响应类型']
    },
    {
      title: '实现泛型数据结构',
      description: '实现一个类型安全的泛型 Stack（栈）类，支持 push、pop、peek、isEmpty 等操作。',
      hints: ['使用泛型类', '处理空栈的情况', '添加适当的类型约束']
    },
    {
      title: '配置 TypeScript 项目',
      description: '创建一个新的 TypeScript 项目，配置 tsconfig.json，设置路径别名，并验证类型检查是否正常工作。',
      hints: ['使用 npm init 和 tsc --init', '配置 strict 模式', '设置 paths 路径别名']
    }
  ]
};
