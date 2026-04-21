import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Priority } from "../types";

interface Props {
  categories: string[];
  onAdd: (
    title: string,
    description: string,
    priority: Priority,
    category: string,
    dueDate: string
  ) => Promise<void>;
}

export function TodoForm({ categories, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    try {
      setSubmitting(true);
      await onAdd(title, description, priority, category, dueDate);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("");
      setDueDate("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="새 할 일 추가..."
          className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
          autoFocus
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="옵션 펼치기"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <button
          type="submit"
          disabled={!title.trim() || submitting}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명 (선택)"
            rows={2}
            className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none border border-gray-200 dark:border-gray-600"
          />
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                우선순위
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200 dark:border-gray-600"
              >
                <option value="high">높음</option>
                <option value="medium">보통</option>
                <option value="low">낮음</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                카테고리
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="예: 업무, 개인..."
                list="cat-list"
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200 dark:border-gray-600"
              />
              <datalist id="cat-list">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                마감일
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
