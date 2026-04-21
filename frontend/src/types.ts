export type Priority = "low" | "medium" | "high";
export type FilterStatus = "all" | "active" | "completed";
export type FilterPriority = "all" | Priority;
export type SortBy = "created_at" | "due_date";
export type SortOrder = "asc" | "desc";

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface Filters {
  status: FilterStatus;
  priority: FilterPriority;
  category: string;
  search: string;
  sort_by: SortBy;
  sort_order: SortOrder;
}
