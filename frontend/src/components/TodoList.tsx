import { ClipboardList, Loader2 } from "lucide-react";
import { Todo } from "../types";
import { TodoItem } from "./TodoItem";

interface Props {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onToggle: (id: number) => Promise<void>;
  onUpdate: (
    id: number,
    updates: Partial<Omit<Todo, "id" | "created_at" | "updated_at">>
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TodoList({
  todos,
  loading,
  error,
  onToggle,
  onUpdate,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          Flask 서버가 실행 중인지 확인해주세요.
        </p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ClipboardList className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          할 일이 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
