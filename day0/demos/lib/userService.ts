import type { User } from './types';

export const API_BASE = 'https://api.example.com';

export function formatUser(user: User) {
  return `${user.id}:${user.name}`;
}

export default class UserService {
  static version = '1.0.0';
  #cache = new Map<number, User>();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  baseUrl: string;

  save(user: User) {
    this.#cache.set(user.id, user);
  }

  get(id: number) {
    return this.#cache.get(id);
  }

  getAll() {
    return Array.from(this.#cache.values());
  }
}
