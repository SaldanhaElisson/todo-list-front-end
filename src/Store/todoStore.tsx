import { create } from "zustand";
import { ITodo } from "../types/main";

interface TodoState {
  addTodoStore: (newTodos: ITodo[]) => void;
  todos: ITodo[];
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  addTodoStore: (newTodos: ITodo[]) => set(() => ({ todos: newTodos })),
}));
