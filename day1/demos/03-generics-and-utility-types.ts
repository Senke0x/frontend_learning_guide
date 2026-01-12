/**
 * 运行: pnpm tsx day1/demos/03-generics-and-utility-types.ts
 * 调试: node --inspect-brk ./node_modules/.bin/tsx day1/demos/03-generics-and-utility-types.ts
 */

export {};

// 对应 day1/core-syntax.md#core-8
interface ApiResult<T> {
  data: T;
  error?: string;
}

// core-8 泛型: 泛型函数
function identity<T>(value: T): T {
  return value;
}

// core-8 泛型: 泛型类
class Store<T> {
  private items: T[] = [];

  add(item: T) {
    this.items.push(item);
  }

  all(): T[] {
    return [...this.items];
  }
}

// core-8 泛型: extends 约束
function getId<T extends { id: string }>(value: T): string {
  return value.id;
}

// core-8 泛型: keyof + 索引访问类型
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// core-8 泛型: 条件类型 + infer
type ElementType<T> = T extends (infer U)[] ? U : T;
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

interface User {
  id: string;
  name: string;
  email?: string;
}

// core-8 工具类型: Partial/Required/Readonly/Pick/Omit/Record
type UserPreview = Pick<User, 'id' | 'name'>;
type UserUpdate = Partial<User>;
type UserRequired = Required<User>;
type UserReadonly = Readonly<User>;
type UserPublic = Omit<User, 'email'>;
type UsersById = Record<string, User>;

async function fetchUser(id: string): Promise<ApiResult<User>> {
  return { data: { id, name: 'Alice', email: 'a@example.com' } };
}

function updateUser(id: string, patch: UserUpdate): User {
  return { id, name: patch.name ?? 'unknown', email: patch.email };
}

// core-8 工具类型: ReturnType/Parameters
type FetchUserReturn = ReturnType<typeof fetchUser>;
type FetchUserResolved = UnwrapPromise<FetchUserReturn>;
type UpdateUserParams = Parameters<typeof updateUser>;
type UserName = ElementType<User[]>;

const store = new Store<User>();
store.add({ id: 'u1', name: 'Lin' });
const users = store.all();

const preview: UserPreview = { id: users[0].id, name: users[0].name };
const requiredUser: UserRequired = {
  id: 'u2',
  name: 'Ken',
  email: 'k@example.com',
};
const readonlyUser: UserReadonly = requiredUser;
const publicUser: UserPublic = { id: 'u3', name: 'May' };
const map: UsersById = { [users[0].id]: users[0] };

const nameKey: keyof User = 'name';
const nameValue = getProp(users[0], nameKey);

const updateArgs: UpdateUserParams = ['u1', { email: 'new@example.com' }];
const updated = updateUser(...updateArgs);

console.log({
  identity: identity(123),
  id: getId(users[0]),
  users,
  preview,
  requiredUser,
  readonlyUser,
  publicUser,
  map,
  nameValue,
  updated,
});

fetchUser('u4').then((result) => {
  const resolved: FetchUserResolved = result;
  console.log('fetchUser resolved', resolved);
});

const sampleElement: UserName = users[0];
console.log('element', sampleElement);
