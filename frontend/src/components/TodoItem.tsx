import { useState } from "react";
import { Pencil, Trash2, Check, X, Calendar, Tag, AlertTriangle, Clock } from "lucide-react";
import { Todo, Priority } from "../types";

interface Props {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onUpdate: (
    id: number,
    updates: Partial<Omit<Todo, "id" | "created_at" | "updated_at">>
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const PRIORITY_STYLE = {
  high: {
    label: "높음",
    badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
  medium: {
    label: "보통",
    badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  low: {
    label: "낮음",
    badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
};

function isOverdue(dueDate: string, completed: boolean): boolean {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

function formatCreatedAt(isoStr: string): string {
  const d = new Date(isoStr);
  const now = new Date();
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString("ko-KR", {
    ...(sameYear ? {} : { year: "numeric" }),
    month: "short",
    day: "numeric",
  });
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editDueDate, setEditDueDate] = useState(todo.due_date);

  const ps = PRIORITY_STYLE[todo.priority];
  const overdue = isOverdue(todo.due_date, todo.completed);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    await onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      priority: editPriority,
      category: editCategory.trim() || "General",
      due_date: editDueDate,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditDueDate(todo.due_date);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
    if (e.key === "Escape") handleCancel();
  };

  if (editing) {
    return (
      <div
        className="bg-white dark:bg-gray-800 rounded-xl border border-indigo-400 dark:border-indigo-500 p-4 shadow-sm"
        onKeyDown={handleKeyDown}
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-2 border border-gray-200 dark:border-gray-600"
          autoFocus
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="설명..."
          rows={2}
          className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-3 resize-none border border-gray-200 dark:border-gray-600"
        />
        <div className="grid grid-cols-3 gap-2 mb-3">
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as Priority)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-xs rounded-lg px-2 py-1.5 outline-none border border-gray-200 dark:border-gray-600"
          >
            <option value="high">높음</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>
          <input
            type="text"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            placeholder="카테고리"
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-xs rounded-lg px-2 py-1.5 outline-none border border-gray-200 dark:border-gray-600"
          />
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-xs rounded-lg px-2 py-1.5 outline-none border border-gray-200 dark:border-gray-600"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg border border-gray-200 dark:border-gray-600 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!editTitle.trim()}
            className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg flex items-center gap-1 transition-colors"
          >
            <Check className="w-3 h-3" />
            저장
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border p-4 shadow-sm group hover:shadow-md transition-all ${
        todo.completed
          ? "border-gray-100 dark:border-gray-800 opacity-55"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed
              ? "bg-emerald-500 border-emerald-500"
              : "border-gray-300 dark:border-gray-600 hover:border-indigo-500"
          }`}
          aria-label={todo.completed ? "완료 취소" : "완료 표시"}
        >
          {todo.completed && (
            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium leading-snug break-words ${
              todo.completed
                ? "line-through text-gray-400 dark:text-gray-500"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {todo.title}
          </p>
          {todo.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
              {todo.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${ps.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${ps.dot}`} />
              {ps.label}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              <Tag className="w-2.5 h-2.5" />
              {todo.category}
            </span>
            {todo.due_date && (
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                  overdue
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {overdue ? (
                  <AlertTriangle className="w-2.5 h-2.5" />
                ) : (
                  <Calendar className="w-2.5 h-2.5" />
                )}
                {overdue ? "기한 초과 · " : ""}
                {formatDate(todo.due_date)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-gray-400 dark:text-gray-600">
              <Clock className="w-2.5 h-2.5" />
              {formatCreatedAt(todo.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="편집"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
