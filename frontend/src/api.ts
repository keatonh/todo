import { Todo, Priority, Filters } from "./types";

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function fetchTodos(filters: Filters): Promise<Todo[]> {
  const p = new URLSearchParams();
  if (filters.status !== "all") p.set("status", filters.status);
  if (filters.priority !== "all") p.set("priority", filters.priority);
  if (filters.category !== "all") p.set("category", filters.category);
  if (filters.search) p.set("search", filters.search);
  p.set("sort_by", filters.sort_by);
  p.set("sort_order", filters.sort_order);
  const qs = p.toString();
  return request(`/todos${qs ? `?${qs}` : ""}`);
}

export function createTodo(data: {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  due_date: string;
}): Promise<Todo> {
  return request("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateTodo(
  id: number,
  data: Partial<Omit<Todo, "id" | "created_at" | "updated_at">>
): Promise<Todo> {
  return request(`/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function toggleTodo(id: number): Promise<Todo> {
  return request(`/todos/${id}/toggle`, { method: "PATCH" });
}

export function deleteTodo(id: number): Promise<void> {
  return request(`/todos/${id}`, { method: "DELETE" });
}

export function clearCompleted(): Promise<void> {
  return request("/todos/clear-completed", { method: "DELETE" });
}

export function fetchCategories(): Promise<string[]> {
  return request("/categories");
}
