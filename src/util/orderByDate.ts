import { ITodo } from "../types/main";

export function organizeTodosByDate(todos: ITodo[]): ITodo[] {
  return todos.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
