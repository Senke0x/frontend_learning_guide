# Day1 - TypeScript 学习手册

## 1. 学习范围与官方资料
- 官方手册总览: https://www.typescriptlang.org/docs/handbook/intro.html
- 5 分钟上手: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- Everyday Types（基础类型）: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- Narrowing（类型收窄）: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- Generics（泛型）: https://www.typescriptlang.org/docs/handbook/2/generics.html
- Utility Types（工具类型）: https://www.typescriptlang.org/docs/handbook/utility-types.html
- Modules（模块）: https://www.typescriptlang.org/docs/handbook/2/modules.html
- tsconfig 参考: https://www.typescriptlang.org/tsconfig
- 声明文件: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html

## 2. 核心语法速览（与官方文档对应）
> 详细笔记：`day1/core-syntax.md`（以下要点与 demo 一一对应）

### 2.1 类型注解与推断（Everyday Types）
- 注解是显式声明类型（如 `const price: number = 1`），推断由初始值自动得出类型。
- `const` 推断为字面量更窄，`let` 通常推断为可变类型；必要时用显式注解收紧或放宽。
- widening / narrowing 规则：字面量可被放宽到基础类型；`as const` 保留字面量并只读；控制流与类型守卫会收窄类型。

### 2.2 基础类型与集合
- 原始类型：`string`/`number`/`boolean`/`bigint`/`symbol`/`null`/`undefined`。
- 数组：`T[]` 或 `Array<T>`；只读数组用 `ReadonlyArray<T>`。
- 元组：固定长度与位置类型，例如 `[x: number, y: number]`（labeled tuple）。
- 对象类型：`{}` 描述属性形状；可用 `readonly` 与 `?` 标记只读/可选属性。
- 字面量与模板字面量：`'pending' | 'done'`、`` `tag:${string}` `` 更精确表达值空间。

### 2.3 组合类型与特殊类型
- 联合类型 `A | B` 表示可能的多种形状；交叉类型 `A & B` 表示同时满足。
- `any` 放弃类型检查；`unknown` 需要收窄后才能使用；`never` 表示“不可能”的分支。
- `void` 表示无返回值（如 `console.log`、事件处理函数）。

### 2.4 类型收窄（Narrowing）
- `typeof`/`instanceof`/`in`/相等性检查可将联合类型收窄成具体类型。
- 可辨识联合（带 `kind` 字面量字段）配合 `switch` 实现可维护分支。
- 使用 `never` 做穷尽检查，让编译器在漏分支时报错。
- 控制流分析：`if`/`return`/`throw` 会影响后续路径中的类型。

### 2.5 对象与接口（Objects & Interfaces）
- `interface` 与 `type` 都可描述对象；`interface` 支持声明合并，`type` 更适合组合联合/交叉。
- `extends` 与交叉类型用于扩展结构；索引签名描述字典型对象。
- 只读/可选属性用于约束可变性与可缺省字段。

### 2.6 函数类型
- 参数/返回值可注解，返回值通常可推断；需要时显式标注。
- 可选参数 `?`、默认参数与剩余参数 `...rest`。
- `this` 参数可标注函数调用时的上下文类型。
- 函数重载通过多签名描述不同入参形状。

### 2.7 泛型与高级类型（Generics）
- 泛型函数/接口/类用于复用类型逻辑，例如 `function identity<T>(value: T): T`。
- `extends` 约束限定泛型范围；`keyof` 与索引访问类型 `T[K]` 让类型与对象结构联动。
- 条件类型 `T extends U ? X : Y` 配合 `infer` 抽取类型。
- 常用工具类型：`Partial`、`Required`、`Readonly`、`Pick`、`Omit`、`Record`、`ReturnType`、`Parameters`。

### 2.8 模块与导入导出（Modules）
- ESM 支持命名/默认导出；默认导出通常与模块主功能对应。
- `import type`/`export type` 用于类型导入导出，运行时会被擦除。
- 桶文件（barrel）通过 `index.ts` 统一导出模块 API。

## 3. 仓库/项目构成
- 本仓库结构
  - `client/` React + Vite（TSX），`server/` Node/Express，`shared/` 共享类型。
  - 根级 `tsconfig.json`：`moduleResolution: bundler`，`strict: true`，路径别名 `@/*` -> `client/src/*`，`@shared/*` -> `shared/*`。
  - 脚本（`package.json`）：`pnpm dev`（Vite）、`pnpm check`（`tsc --noEmit`）、`pnpm build`（Vite+esbuild server）、`pnpm start`（运行 `dist/index.js`）。
- 常见 Next.js/前端目录（参考 `client/src/data/day2Content.ts` 示例）：`app/` 路由、`components/`、`lib/`、`public/`、`tsconfig.json`、`next.config.js`、`package.json`。
- 规则：公共类型集中在 `shared/` 或 `types/`；公共工具放 `lib/`；通过 `paths` 别名减少相对路径；严格模式确保类型安全。

## 4. 编译与调试流程（本仓库）
- 安装依赖: `pnpm install`
- 开发: `pnpm dev`（Vite HMR），浏览器 + 编辑器类型提示。
- 类型检查: `pnpm check` 或 `npx tsc --noEmit --watch` 持续检查。
- 构建/运行: `pnpm build` → `pnpm start`；静态预览 `pnpm preview`。
- 快速运行独立 TS 脚本: `pnpm tsx day1/demos/01-everyday-types-and-narrowing.ts`（`tsx` 支持 ESM/TS，适合演示）。
- 调试技巧: `node --inspect-brk ./node_modules/.bin/tsx day1/demos/01-everyday-types-and-narrowing.ts`，在 VS Code/Chrome Attach 调试。

## 5. Demo 实操
- `day1/demos/01-everyday-types-and-narrowing.ts`：基础类型、字面量、联合/交叉、any/unknown/never、收窄（`typeof`/`instanceof`/`in`）、可辨识联合 + 穷尽检查。
- `day1/demos/02-objects-interfaces-functions.ts`：接口/类型别名、可选/只读、索引签名、extends/交叉、函数类型/重载/this/默认&可选/剩余参数。
- `day1/demos/03-generics-and-utility-types.ts`：泛型函数/接口/类、约束、`keyof`/索引访问、条件类型+`infer`、工具类型。
- `day1/demos/04-modules.ts`：命名/默认导出、`import type`、桶文件。
- 运行与调试命令已写在每个 demo 文件顶部注释。

## 6. 习题练习（Day1）
- 类型定义：为用户系统写 `User`、`Role`、`Permission` 接口，设计 `ApiResult<T>` 泛型响应和错误模型。
- 泛型数据结构：实现 `Stack<T>`（`push`/`pop`/`peek`/`isEmpty`），对空栈弹出做返回类型约束。
- 配置项目：`npm init -y && npx tsc --init`，开启 `strict`，配置 `baseUrl`/`paths`，写 2 个模块并用 `tsc --noEmit` 校验。

## 7. 学习参考仓库（快速认识结构）
- microsoft/TypeScript — TS 编译器本身，`src/compiler`/`src/services` 核心实现，`tests/cases` 丰富类型用例。
- vercel/next.js — 大型 TypeScript 单仓，`packages/next`（框架核心）、`examples/`（包含 TS + 各类集成）适合参考工程化与目录设计。
- type-challenges/type-challenges — 专注类型体操的题库，查看 `questions` 目录可以练习条件类型、`infer`、分布式条件等高级语法。
