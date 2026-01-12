/**
 * Run: pnpm tsx day0/demos/04-classes-prototypes-modules.ts
 * Debug: node --inspect-brk ./node_modules/.bin/tsx day0/demos/04-classes-prototypes-modules.ts
 */

import UserService, { API_BASE, formatUser } from './lib/userService';
import { UserService as UserServiceFromBarrel, API_BASE as BARREL_BASE } from './lib';
import type { Role, User } from './lib';

export {};

// Prototype-based constructor
function LegacyUser(name) {
  this.name = name;
}

LegacyUser.prototype.sayHi = function () {
  return `Hi, ${this.name}`;
};

const legacy = new LegacyUser('Ada');
const legacyGreeting = legacy.sayHi();

// Class syntax with inheritance
class BaseService {
  request() {
    return 'base';
  }
}

class ExtendedService extends BaseService {
  request() {
    return `${super.request()} -> extended`;
  }
}

const service = new ExtendedService();
const serviceResult = service.request();

// Interface usage (TypeScript only)
const role: Role = 'admin';
const user: User = { id: 1, name: 'Ada', email: 'ada@example.com' };

// Module imports
const directService = new UserService(API_BASE);
directService.save(user);
const formatted = formatUser(user);

// Barrel import usage
const barrelService = new UserServiceFromBarrel(BARREL_BASE);
barrelService.save({ id: 2, name: 'Grace' });

async function loadConfig() {
  const config = await import('./lib/config');
  return config.APP_NAME;
}

loadConfig().then((name) => {
  console.log({
    legacyGreeting,
    serviceResult,
    role,
    formatted,
    directUsers: directService.getAll(),
    barrelUsers: barrelService.getAll(),
    configName: name,
  });
});
