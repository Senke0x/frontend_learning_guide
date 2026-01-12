export interface Todo {
  id: string;
  title: string;
  done: boolean;
}

export type TodoStatus = 'open' | 'done';
