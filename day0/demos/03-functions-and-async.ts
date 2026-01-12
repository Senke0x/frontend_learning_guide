/**
 * Run: pnpm tsx day0/demos/03-functions-and-async.ts
 * Debug: node --inspect-brk ./node_modules/.bin/tsx day0/demos/03-functions-and-async.ts
 */

export {};

// Function declarations
function add(a, b) {
  return a + b;
}

const multiply = function (a, b) {
  return a * b;
};

const subtract = (a, b) => a - b;

// Default params, rest params, and destructuring
function sum(a, b = 0) {
  return a + b;
}

function sumAll(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}

function formatUser({ id, name }) {
  return `${id}:${name}`;
}

// Higher-order functions and closures
function createCounter(start = 0) {
  let count = start;
  return () => ++count;
}

const next = createCounter();
const first = next();
const second = next();

function once(fn) {
  let called = false;
  return (...args) => {
    if (called) return undefined;
    called = true;
    return fn(...args);
  };
}

const init = once(() => 'initialized');
const initFirst = init();
const initSecond = init();

// this binding
const logger = {
  prefix: '[log]',
  log(message) {
    return `${this.prefix} ${message}`;
  },
};

const boundLog = logger.log.bind(logger);
const boundResult = boundLog('hello');
const calledResult = logger.log.call({ prefix: '[call]' }, 'hello');
const appliedResult = logger.log.apply({ prefix: '[apply]' }, ['hello']);

// Async patterns
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function loadData() {
  await delay(10);
  return { ok: true };
}

async function run() {
  const data = await loadData();

  const results = await Promise.all([
    Promise.resolve(1),
    Promise.resolve(2),
  ]);

  const settled = await Promise.allSettled([
    Promise.resolve('ok'),
    Promise.reject(new Error('fail')),
  ]);

  return { data, results, settled };
}

run()
  .then((res) => {
    console.log({
      add: add(1, 2),
      multiply: multiply(2, 3),
      subtract: subtract(5, 2),
      sum: sum(1),
      sumAll: sumAll(1, 2, 3),
      formatted: formatUser({ id: 1, name: 'Ada' }),
      first,
      second,
      initFirst,
      initSecond,
      boundResult,
      calledResult,
      appliedResult,
      res,
    });
  })
  .catch((error) => {
    console.error('run failed', error);
  });

// Event loop order
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');
