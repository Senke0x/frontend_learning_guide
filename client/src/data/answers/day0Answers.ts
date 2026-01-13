import type { DayAnswers } from '../answersTypes';

export const day0Answers: DayAnswers = {
  day: 0,
  title: 'JavaScript 语法基础与运行时常识',
  answers: [
    {
      homeworkIndex: 0,
      title: '实现基础工具函数',
      explanation: `## 思路说明

### slugify 函数
将字符串转换为 URL 友好的 slug 格式：
1. 去除首尾空格
2. 转换为小写
3. 将非字母数字字符替换为连字符
4. 去除首尾多余的连字符

### unique 函数
使用 Set 数据结构实现数组去重：
- Set 自动去除重复元素
- 使用 Array.from 或展开运算符转回数组

### groupBy 函数
使用 Map 实现分组，保持插入顺序：
1. 遍历数组，对每个元素调用 key 函数获取分组键
2. 如果 Map 中没有该键，创建新数组
3. 将元素添加到对应分组的数组中`,
      code: `// ==========================================
// 基础工具函数实现
// ==========================================

/**
 * slugify - 将字符串转换为 URL 友好的 slug
 *
 * 处理步骤：
 * 1. trim() 去除首尾空格
 * 2. toLowerCase() 转换为小写
 * 3. replace() 将非字母数字字符替换为连字符
 * 4. replace() 去除首尾多余的连字符
 *
 * @param str - 输入字符串
 * @returns slug 格式的字符串
 */
function slugify(str: string): string {
  return str
    .trim()                              // 去除首尾空格
    .toLowerCase()                       // 转换为小写
    .replace(/[^a-z0-9]+/g, '-')        // 非字母数字替换为连字符
    .replace(/^-+|-+$/g, '');           // 去除首尾连字符
}

/**
 * unique - 数组去重
 *
 * 使用 Set 数据结构，它只存储唯一值
 * Set 的特点：
 * - 自动去除重复元素
 * - 保持插入顺序
 * - 使用 === 进行相等性判断
 *
 * @param arr - 输入数组
 * @returns 去重后的数组
 */
function unique<T>(arr: T[]): T[] {
  // 方法1: 使用展开运算符
  return [...new Set(arr)];

  // 方法2: 使用 Array.from
  // return Array.from(new Set(arr));
}

/**
 * groupBy - 按指定键分组
 *
 * 使用 Map 而不是普通对象的原因：
 * 1. Map 保持插入顺序
 * 2. Map 的键可以是任意类型
 * 3. Map 有更好的性能（频繁增删操作）
 *
 * @param arr - 输入数组
 * @param keyFn - 获取分组键的函数
 * @returns 分组后的 Map
 */
function groupBy<T, K>(arr: T[], keyFn: (item: T) => K): Map<K, T[]> {
  // 使用 reduce 遍历数组，累积到 Map 中
  return arr.reduce((map, item) => {
    const key = keyFn(item);           // 获取当前元素的分组键
    const group = map.get(key) || [];  // 获取已有分组或创建新数组
    group.push(item);                  // 将元素添加到分组
    map.set(key, group);               // 更新 Map
    return map;
  }, new Map<K, T[]>());
}

// ==========================================
// 测试代码
// ==========================================

// 测试 slugify
console.log('=== slugify 测试 ===');
console.log(slugify('Hello World'));           // "hello-world"
console.log(slugify('  JavaScript 101  '));    // "javascript-101"
console.log(slugify('React & Vue'));           // "react-vue"

// 测试 unique
console.log('\\n=== unique 测试 ===');
console.log(unique([1, 2, 2, 3, 3, 3]));       // [1, 2, 3]
console.log(unique(['a', 'b', 'a', 'c']));     // ['a', 'b', 'c']

// 测试 groupBy
console.log('\\n=== groupBy 测试 ===');
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 },
];
const byAge = groupBy(users, u => u.age);
console.log('按年龄分组:');
byAge.forEach((group, age) => {
  console.log(\`  \${age}岁: \${group.map(u => u.name).join(', ')}\`);
});`,
      language: 'typescript',
      testCases: [
        {
          input: 'slugify("Hello World")',
          expected: '"hello-world"',
          code: `console.log(slugify("Hello World"));
// 输出: "hello-world"`
        },
        {
          input: 'unique([1, 2, 2, 3, 3, 3])',
          expected: '[1, 2, 3]',
          code: `console.log(unique([1, 2, 2, 3, 3, 3]));
// 输出: [1, 2, 3]`
        },
        {
          input: 'groupBy(users, u => u.age)',
          expected: 'Map { 25 => [...], 30 => [...] }',
          code: `const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 },
];
const result = groupBy(users, u => u.age);
console.log(result.get(25)); // [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }]`
        }
      ],
      keyInsights: [
        '使用 Array 高阶方法（map/filter/reduce）可以写出更简洁、声明式的代码',
        'Set 是去重的最佳选择，时间复杂度 O(n)',
        'Map 保持插入顺序，适合 groupBy 场景',
        '泛型 <T> 让函数可以处理任意类型的数组'
      ],
      relatedConcepts: ['Array 高阶方法', 'Set', 'Map', '泛型']
    },
    {
      homeworkIndex: 1,
      title: '函数与闭包练习',
      explanation: `## 思路说明

### once 函数
确保函数只执行一次：
1. 使用闭包保存"是否已执行"的状态
2. 第一次调用时执行原函数并保存结果
3. 后续调用直接返回缓存的结果

### debounce 函数
防抖：在停止触发后才执行：
1. 使用闭包保存定时器 ID
2. 每次调用时清除之前的定时器
3. 设置新的定时器，延迟执行
4. 只有在指定时间内没有新调用时才真正执行`,
      code: `// ==========================================
// 函数与闭包练习
// ==========================================

/**
 * once - 确保函数只执行一次
 *
 * 闭包的作用：
 * - called: 记录函数是否已被调用
 * - result: 缓存第一次调用的结果
 *
 * 这两个变量在 once 返回后仍然存在于内存中，
 * 因为返回的函数引用了它们（形成闭包）
 *
 * @param fn - 要包装的函数
 * @returns 只会执行一次的新函数
 */
function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false;    // 是否已调用
  let result: ReturnType<T>;  // 缓存结果

  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true;
      result = fn.apply(this, args);  // 保持 this 上下文
    }
    return result;
  } as T;
}

/**
 * debounce - 防抖函数
 *
 * 应用场景：
 * - 搜索框输入（等用户停止输入后再搜索）
 * - 窗口 resize 事件
 * - 按钮防重复点击
 *
 * 工作原理：
 * 1. 每次调用时，清除之前的定时器
 * 2. 设置新的定时器
 * 3. 只有在 delay 时间内没有新调用，才执行函数
 *
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function(this: any, ...args: Parameters<T>): void {
    // 清除之前的定时器（如果存在）
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // 设置新的定时器
    timeoutId = setTimeout(() => {
      fn.apply(this, args);  // 延迟执行，保持 this 上下文
      timeoutId = null;
    }, delay);
  };
}

// ==========================================
// 测试代码
// ==========================================

// 测试 once
console.log('=== once 测试 ===');
let callCount = 0;
const initialize = once(() => {
  callCount++;
  console.log('初始化执行');
  return 'initialized';
});

console.log('第一次调用:', initialize());  // 执行，返回 'initialized'
console.log('第二次调用:', initialize());  // 不执行，返回缓存的 'initialized'
console.log('第三次调用:', initialize());  // 不执行，返回缓存的 'initialized'
console.log('实际执行次数:', callCount);   // 1

// 测试 debounce
console.log('\\n=== debounce 测试 ===');
let searchCount = 0;
const search = debounce((query: string) => {
  searchCount++;
  console.log(\`搜索: \${query} (第 \${searchCount} 次实际搜索)\`);
}, 300);

// 模拟快速输入
console.log('模拟快速输入 a, ab, abc...');
search('a');
search('ab');
search('abc');
// 只有最后一次 'abc' 会在 300ms 后执行

// 使用 setTimeout 模拟等待
setTimeout(() => {
  console.log('300ms 后，实际搜索次数:', searchCount);
}, 400);`,
      language: 'typescript',
      testCases: [
        {
          input: 'once(fn) 多次调用',
          expected: '函数只执行一次',
          code: `let count = 0;
const fn = once(() => ++count);
fn(); fn(); fn();
console.log(count); // 1`
        },
        {
          input: 'debounce(fn, 300) 快速调用',
          expected: '只执行最后一次',
          code: `const log = debounce((msg) => console.log(msg), 300);
log('a'); log('b'); log('c');
// 300ms 后只输出 'c'`
        }
      ],
      keyInsights: [
        '闭包可以封装私有状态，外部无法直接访问',
        'once 模式常用于初始化、单例等场景',
        'debounce 适合处理高频触发的事件',
        '注意保持 this 上下文（使用 apply/call）'
      ],
      relatedConcepts: ['闭包', 'setTimeout', 'clearTimeout', 'this 绑定']
    },
    {
      homeworkIndex: 2,
      title: '模块化与类设计',
      explanation: `## 思路说明

### 模块化设计
使用 ES Modules 组织代码：
1. 类型定义单独文件（types.ts）
2. 业务逻辑类单独文件（UserService.ts）
3. 入口文件统一导出（index.ts）

### 类设计
UserService 类的设计考虑：
1. 使用私有字段 #cache 存储数据
2. 提供 CRUD 方法
3. 使用 TypeScript 接口定义数据结构`,
      code: `// ==========================================
// 模块化与类设计
// ==========================================

// ----- types.ts -----
// 定义 User 接口，描述用户数据结构

/**
 * User 接口
 * 使用 interface 定义对象的"形状"
 * ? 表示可选属性
 */
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;           // 可选属性
  createdAt: Date;
}

/**
 * CreateUserDto - 创建用户时的数据传输对象
 * 使用 Omit 排除自动生成的字段
 */
type CreateUserDto = Omit<User, 'id' | 'createdAt'>;

/**
 * UpdateUserDto - 更新用户时的数据传输对象
 * 使用 Partial 使所有字段可选
 */
type UpdateUserDto = Partial<CreateUserDto>;

// ----- UserService.ts -----
// 用户服务类，处理用户相关的业务逻辑

/**
 * UserService 类
 *
 * 设计要点：
 * 1. 使用 # 前缀定义私有字段（ES2022）
 * 2. 使用 static 定义静态属性
 * 3. 提供完整的 CRUD 操作
 */
class UserService {
  // 静态属性：版本号
  static readonly version = '1.0.0';

  // 私有字段：用户缓存（使用 Map 存储）
  #users: Map<number, User> = new Map();

  // 私有字段：ID 计数器
  #nextId = 1;

  /**
   * 创建用户
   * @param dto - 创建用户的数据
   * @returns 创建的用户对象
   */
  create(dto: CreateUserDto): User {
    const user: User = {
      id: this.#nextId++,
      ...dto,
      createdAt: new Date(),
    };
    this.#users.set(user.id, user);
    return user;
  }

  /**
   * 根据 ID 获取用户
   * @param id - 用户 ID
   * @returns 用户对象或 undefined
   */
  getById(id: number): User | undefined {
    return this.#users.get(id);
  }

  /**
   * 获取所有用户
   * @returns 用户数组
   */
  getAll(): User[] {
    return Array.from(this.#users.values());
  }

  /**
   * 更新用户
   * @param id - 用户 ID
   * @param dto - 更新数据
   * @returns 更新后的用户或 undefined
   */
  update(id: number, dto: UpdateUserDto): User | undefined {
    const user = this.#users.get(id);
    if (!user) return undefined;

    const updated: User = { ...user, ...dto };
    this.#users.set(id, updated);
    return updated;
  }

  /**
   * 删除用户
   * @param id - 用户 ID
   * @returns 是否删除成功
   */
  delete(id: number): boolean {
    return this.#users.delete(id);
  }
}

// ----- index.ts -----
// 入口文件，统一导出模块内容

// 导出类型（使用 export type 明确表示只导出类型）
// export type { User, CreateUserDto, UpdateUserDto };

// 导出类（默认导出）
// export default UserService;

// ==========================================
// 测试代码
// ==========================================

console.log('=== UserService 测试 ===');
console.log('版本:', UserService.version);

const userService = new UserService();

// 创建用户
const alice = userService.create({
  name: 'Alice',
  email: 'alice@example.com',
  age: 25,
});
console.log('\\n创建用户:', alice);

const bob = userService.create({
  name: 'Bob',
  email: 'bob@example.com',
});
console.log('创建用户:', bob);

// 获取所有用户
console.log('\\n所有用户:', userService.getAll());

// 更新用户
const updatedAlice = userService.update(alice.id, { age: 26 });
console.log('\\n更新后的 Alice:', updatedAlice);

// 删除用户
const deleted = userService.delete(bob.id);
console.log('\\n删除 Bob:', deleted);
console.log('剩余用户:', userService.getAll());`,
      language: 'typescript',
      testCases: [
        {
          input: 'userService.create({ name, email })',
          expected: '返回带有 id 和 createdAt 的 User 对象',
          code: `const user = userService.create({
  name: 'Test',
  email: 'test@example.com'
});
console.log(user.id); // 自动生成的 ID`
        },
        {
          input: 'userService.getAll()',
          expected: '返回所有用户的数组',
          code: `const users = userService.getAll();
console.log(users.length);`
        }
      ],
      keyInsights: [
        'ES Modules 使用 export/import 组织代码',
        '使用 interface 定义数据结构，type 定义类型别名',
        '私有字段使用 # 前缀（ES2022 标准）',
        'Omit 和 Partial 是常用的工具类型',
        '桶文件（index.ts）可以简化导入路径'
      ],
      relatedConcepts: ['ES Modules', 'interface', 'class', '私有字段', '工具类型']
    }
  ]
};
