/**
 * Run: pnpm tsx day0/demos/01-variables-types-builtins.ts
 * Debug: node --inspect-brk ./node_modules/.bin/tsx day0/demos/01-variables-types-builtins.ts
 */

export {};

// Declarations and scope
function scopeDemo() {
  if (true) {
    const a = 1;
    let b = 2;
    var c = 3;
    console.log(a, b, c);
  }

  // var is function-scoped
  console.log(c);
}

scopeDemo();

// Hoisting behavior
console.log(typeof hoistedVar); // 'undefined'
var hoistedVar = 'ready';

// const binding is immutable, but object contents can change
const user = { name: 'Ada' };
user.name = 'Grace';

// Primitives
const title = '  Hello JS  ';
const slug = title.trim().toLowerCase().replace(/\s+/g, '-');
const price = 19.9;
const withTax = Number((price * 1.07).toFixed(2));
const isEnabled = Boolean('on');
const nil = null;
const missing = undefined;
const bigId = 9007199254740993n;
const nextId = bigId + 1n;

// Symbol keys
const metaKey = Symbol('meta');
const metaObj = { [metaKey]: { internal: true } };
const symbolKeys = Object.getOwnPropertySymbols(metaObj);

// Arrays
const scores = [60, 80, 90, 100];
const passed = scores.filter((s) => s >= 80);
const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
const firstTop = scores.find((s) => s >= 90);
const hasPerfect = scores.some((s) => s === 100);
const allPassed = scores.every((s) => s >= 60);
const sortedAsc = scores.slice().sort((a, b) => a - b);

// Objects
const profile = { id: 1, name: 'Ada' };
const entries = Object.entries(profile);
const copy = Object.assign({}, profile, { role: 'admin' });
Object.freeze(copy);

// Map
const cache = new Map();
cache.set(profile, { lastLogin: Date.now() });
const cached = cache.get(profile);

// Set
const tags = new Set(['js', 'ts', 'js']);
const uniqueTags = Array.from(tags);

// WeakMap / WeakSet
const wm = new WeakMap();
const ws = new WeakSet();
const ref = { id: 1 };
wm.set(ref, { cached: true });
ws.add(ref);

// Date / RegExp / JSON / Error
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

const error = new ApiError('Request failed', 500);

// Type checks and conversions
const value = '42';
const num = Number(value);
const str = String(100);
const isArray = Array.isArray(scores);
const isDate = now instanceof Date;
const valueType = typeof num;

console.log({
  slug,
  withTax,
  isEnabled,
  nil,
  missing,
  nextId,
  symbolKeys,
  passed,
  average,
  firstTop,
  hasPerfect,
  allPassed,
  sortedAsc,
  entries,
  cached,
  uniqueTags,
  iso,
  isMatch,
  parsed,
  error,
  num,
  str,
  isArray,
  isDate,
  valueType,
});
