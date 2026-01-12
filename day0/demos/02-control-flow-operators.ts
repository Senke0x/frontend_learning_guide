/**
 * Run: pnpm tsx day0/demos/02-control-flow-operators.ts
 * Debug: node --inspect-brk ./node_modules/.bin/tsx day0/demos/02-control-flow-operators.ts
 */

export {};

// Equality and comparisons
const looseEqual = 0 == false;
const strictEqual = 0 === false;

// Logical operators and nullish coalescing
const input = '';
const fallbackOr = input || 'default';
const fallbackNullish = input ?? 'default';

// Optional chaining
const user = { profile: { city: 'Shenzhen' } };
const city = user.profile?.city ?? 'Unknown';

// Spread and destructuring
const defaults = { page: 1, size: 20 };
const params = { size: 50 };
const merged = { ...defaults, ...params };

const list = [10, 20, 30, 40];
const [first, second, ...rest] = list;

// Ternary
const label = first > 10 ? 'large' : 'small';

// Switch
const role = 'admin';
let permission = 'read';
switch (role) {
  case 'admin':
    permission = 'write';
    break;
  case 'editor':
    permission = 'edit';
    break;
  default:
    permission = 'read';
}

// Loops
const values = [];
for (let i = 0; i < 3; i += 1) {
  if (i === 1) continue;
  values.push(i);
}

const letters = ['a', 'b', 'c'];
for (const letter of letters) {
  values.push(letter);
}

const flags = { debug: true, verbose: false };
for (const key in flags) {
  values.push(`${key}:${flags[key]}`);
}

let count = 0;
while (count < 2) {
  count += 1;
}

// Error handling
function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return { error: error.message };
  }
}

const good = parseJson('{"ok":true}');
const bad = parseJson('{bad json}');

console.log({
  looseEqual,
  strictEqual,
  fallbackOr,
  fallbackNullish,
  city,
  merged,
  first,
  second,
  rest,
  label,
  permission,
  values,
  count,
  good,
  bad,
});
