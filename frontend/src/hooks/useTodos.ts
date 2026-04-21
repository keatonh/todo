import { useState, useEffect, useCallback, useMemo } from "react";
import { Todo, Priority, Filters } from "../types";
import * as api from "../api";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    priority: "all",
    category: "all",
    search: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchTodos(filters);
      setTodos(data);
    } catch {
      setError("할 일 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = useCallback(
    async (
      title: string,
      description: string,
      priority: Priority,
      category: string,
      dueDate: string
    ) => {
      const todo = await api.createTodo({
        title,
        description,
        priority,
        category,
        due_date: dueDate,
      });
      setTodos((prev) => [todo, ...prev]);
    },
    []
  );

  const toggleTodo = useCallback(async (id: number) => {
    const updated = await api.toggleTodo(id);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const updateTodo = useCallback(
    async (
      id: number,
      updates: Partial<Omit<Todo, "id" | "created_at" | "updated_at">>
    ) => {
      const updated = await api.updateTodo(id, updates);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    },
    []
  );

  const deleteTodo = useCallback(async (id: number) => {
    await api.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(async () => {
    await api.clearCompleted();
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const categories = useMemo(() => Array.from(new Set(todos.map((t) => t.category))), [todos]);

  const stats = useMemo(
    () => ({
      total: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos]
  );

  return {
    todos,
    loading,
    error,
    filters,
    setFilters,
    categories,
    stats,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
  };
}
