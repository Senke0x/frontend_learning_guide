/**
 * 运行: pnpm tsx day1/demos/01-everyday-types-and-narrowing.ts
 * 调试: node --inspect-brk ./node_modules/.bin/tsx day1/demos/01-everyday-types-and-narrowing.ts
 */

export {};

// 对应 day1/core-syntax.md#core-1 ~ day1/core-syntax.md#core-5
// core-1 类型注解与推断: const/let 推断差异
const title = 'TypeScript Day1';
let env = 'dev';
const envLiteral = 'dev';

// core-2 基础类型与集合: 原始类型 + 数组/只读数组/元组
// string 场景: UI 文案、URL 拼接、slug
const titleSlug = title.toLowerCase().replace(' ', '-');
const apiBaseUrl: string = `https://api.example.com/${env}`;
const bannerText = `[${env}] ${title}`;

// 注意上面两行，本质还是不一样的，限制了类型，从而导致后续的 infer 无法再做类型推导
// 所以 字面量类型，本意还是一个更灵活的操作
type ApiUrl<T extends string> =
  T extends `https://api.example.com/${infer Env}`
    ? Env
    : never;

type E1 = ApiUrl<typeof apiBaseUrl>; // never（丢失信息）
type E2 = ApiUrl<typeof bannerText>; // "dev"（如果未被 widening）

// 前置 知识 type PropertyKey = string | number | symbol;
// extends 的含义是：对泛型参数 K 施加“上界约束（upper bound constraint）”
// 这里 Record 并不是 Map，而是一种对外的提示，对于每个 envLiteral 都有值， 如果 envLiteral 是 union，那么 union 每个都是作为 key 存在的
const envConfig: Record<typeof envLiteral, string> = {
  dev: 'http://localhost:3000',
};
const currentEnvConfig = envConfig[envLiteral];
// 以下写法是会导致编译报错的
// type Env = "dev" | "test" | "prod";
// const envConfig: Record<Env, string> = { dev: "http://localhost:3000", }; 
// 考虑如下来代表可能不存在
//  const envConfig: Partial<Record<Env, string>> = {
//   dev: "...",
// };

// number 场景: 价格/计数/比例
const rating: number = 4.5;
const price = 19.99;
const priceWithTax = price * 1.07;
const priceLabel = priceWithTax.toFixed(2);

// boolean 场景: 状态开关/权限判断
const isDone: boolean = false;
const isFeatureEnabled = true;
const featureState = isFeatureEnabled ? 'enabled' : 'disabled';

// bigint 场景: 超出 Number 安全范围的 ID
const big: bigint = BigInt('9007199254740991');
const nextBig = big + BigInt(1);
const bigAsString = big.toString();

// core-2 symbol/null/undefined 含义与场景
// symbol: 唯一标识符，可当作对象“私有键”，避免与字符串 key 冲突。
// null: 明确的“空值”，表达“刻意清空/没有值”。
// undefined: 缺省/未赋值，常见于可选参数或缺失字段。
const unique: symbol = Symbol('id');
const nothing: null = null;
const notSet: undefined = undefined;

const userMetaKey = Symbol('userMeta');
const userWithMeta = {
  id: 'u1',
  name: 'Alice',
  [userMetaKey]: { internal: true },
};
const metaValue = userWithMeta[userMetaKey];
const visibleKeys = Object.keys(userWithMeta);
const symbolKeys = Object.getOwnPropertySymbols(userWithMeta);
// symbol key 不会出现在 Object.keys 中，但可以通过 getOwnPropertySymbols 获取

function resolveNickname(nickname?: string | null) {
  if (nickname == null) {
    return 'Anonymous';
  }
  return nickname;
}

const nicknameFromNull = resolveNickname(null);
const nicknameFromUndefined = resolveNickname(undefined);
const nicknameFromValue = resolveNickname('Lin');

const config: { timeout?: number } = {};
const timeout = config.timeout ?? 3000;
const clearedCache: string | null = null;
const cacheState = clearedCache === null ? 'cleared' : 'active';
const avatarUrl: string | null = null;
const avatarForDisplay = avatarUrl ?? '/assets/default-avatar.png';

// array 场景: 列表数据(分数/商品等)做统计或转换
const scores: number[] = [1, 2, 3];
// ReadonlyArray 场景: 只读配置列表，避免被意外修改
const tags: ReadonlyArray<string> = ['ts', 'types'];
const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
const increasedScores = scores.map((score) => score + 1);
const tagsCopy = [...tags, 'advanced'];
const firstTag = tags[0];

// tuple 场景: 固定长度的结构化数据(坐标/范围)
type Point = [x: number, y: number];
const origin: Point = [0, 0];
const [x, y] = origin;
const moved: Point = [x + 1, y + 1];

// core-3 组合类型与字面量类型: 联合 + 模板字面量类型
// 联合类型场景: 状态机/流程状态只能取有限集合
type Status = 'pending' | 'approved' | 'rejected';
// 模板字面量场景: 统一字符串前缀(如 tag:xxx / route:xxx)
type TopicTag = `tag:${string}`;

const status: Status = 'pending';
const tag: TopicTag = 'tag:ts';
// Record 保证每个 Status 都有文案(缺一个会报错)
const statusLabels: Record<Status, string> = {
  pending: '等待中',
  approved: '已通过',
  rejected: '已拒绝',
};
const statusLabel = statusLabels[status];

function makeTag(value: string): TopicTag {
  return `tag:${value}`;
}

const cssTag = makeTag('css');

// core-3 组合类型与字面量类型: 交叉类型
// 交叉类型场景: 组合多个职责(身份 + 审计信息)
type WithId = { id: string };
type WithCreatedAt = { createdAt: Date };
type Audited = WithId & WithCreatedAt;

const record: Audited = { id: 'a1', createdAt: new Date() };
const auditLogLine = `${record.id} created at ${record.createdAt.toISOString()}`;

// core-4 特殊类型: any / unknown
let flexible: any = 'anything';
flexible = 42;
flexible.noCheck?.();

// any 场景: 旧系统或第三方库返回的动态结构(不安全)
const legacyPayload: any = JSON.parse('{"id":1,"name":"Legacy"}');
const legacyName = legacyPayload.name;

// core-5 类型收窄: typeof 分支
let maybeValue: unknown = Math.random() > 0.5 ? 'ok' : 123;
if (typeof maybeValue === 'string') {
  console.log(maybeValue.toUpperCase());
} else if (typeof maybeValue === 'number') {
  console.log(maybeValue.toFixed(2));
} else {
  console.log('unknown value');
}

// unknown 场景: 运行时输入(需要先校验再使用)
const rawConfig: unknown = JSON.parse('{"timeout":5000}');
let runtimeTimeout = 0;
if (typeof rawConfig === 'object' && rawConfig !== null && 'timeout' in rawConfig) {
  runtimeTimeout = Number((rawConfig as { timeout: unknown }).timeout);
}

class NetworkError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// core-5 类型收窄: instanceof / typeof
function formatError(err: unknown): string {
  if (err instanceof NetworkError) {
    return `NetworkError(${err.status}): ${err.message}`;
  }
  if (err instanceof Error) {
    return `Error: ${err.message}`;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'Unknown error';
}

type ApiResult =
  | { ok: true; data: string }
  | { ok: false; error: NetworkError };
// 联合类型场景: API 成功/失败两个互斥结果

// core-5 类型收窄: in 操作符
function handleResult(result: ApiResult) {
  if ('data' in result) {
    console.log(result.data.toUpperCase());
  } else {
    console.log(formatError(result.error));
  }
}

// core-5 类型收窄: 可辨识联合 + 穷尽检查 (never)
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number }
  | { kind: 'rect'; width: number; height: number };

// never 场景: 可辨识联合的穷尽检查，防止漏分支
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.size ** 2;
    case 'rect':
      return shape.width * shape.height;
    default:
      return assertNever(shape);
  }
}

const resultOk: ApiResult = { ok: true, data: 'hello' };
const resultErr: ApiResult = { ok: false, error: new NetworkError('Oops', 500) };

handleResult(resultOk);
handleResult(resultErr);
console.log(area({ kind: 'circle', radius: 2 }));
console.log({
  title,
  env,
  envLiteral,
  titleSlug,
  apiBaseUrl,
  bannerText,
  currentEnvConfig,
  rating,
  price,
  priceWithTax,
  priceLabel,
  isDone,
  isFeatureEnabled,
  featureState,
  big,
  nextBig,
  bigAsString,
  unique,
  nothing,
  notSet,
  metaValue,
  visibleKeys,
  symbolKeys,
  nicknameFromNull,
  nicknameFromUndefined,
  nicknameFromValue,
  timeout,
  runtimeTimeout,
  clearedCache,
  cacheState,
  avatarForDisplay,
  scores,
  averageScore,
  increasedScores,
  tags,
  tagsCopy,
  firstTag,
  origin,
  moved,
  status,
  tag,
  statusLabel,
  cssTag,
  record,
  auditLogLine,
  legacyName,
});
