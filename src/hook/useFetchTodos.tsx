import { useState, useEffect, useCallback } from "react";
import { ITodo } from "../types/main";

export const useFetchTodos = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar todos os todos
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`);
      if (response.ok) {
        const todos: ITodo[] = await response.json();
        setTodos(todos);
      } else {
        setError("Falha ao buscar todos");
      }
    } catch (error) {
      setError("Erro no servidor: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para adicionar um novo todo
  const addTodo = useCallback(async (newTodo: Omit<ITodo, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        const createdTodo = await response.json();
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
      } else {
        setError("Falha ao criar todo");
      }
    } catch (error) {
      setError("Erro no servidor: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar um todo por ID
  const getTodoById = useCallback(
    (id: string, todoParener: ITodo[]): ITodo | undefined => {
      return todoParener.find((todo) => todo.id === id);
    },
    []
  );

  // Função para atualizar um todo
  const updateTodo = useCallback(
    async (id: string, updatedTodo: Partial<ITodo>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/todos/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTodo),
          }
        );

        if (!response.ok) {
          throw new Error("Falha ao atualizar todo");
        }

        const updatedTodoFromServer = await response.json();
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, ...updatedTodoFromServer } : todo
          )
        );
      } catch (error) {
        setError("Erro no servidor: " + (error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Função para deletar um todo
  const deleteTodo = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/todos/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao deletar todo");
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      setError("Erro no servidor: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito para buscar todos os todos ao montar o componente
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    setTodos,
    loading,
    error,
    fetchTodos,
    addTodo,
    getTodoById,
    updateTodo,
    deleteTodo,
  };
};
