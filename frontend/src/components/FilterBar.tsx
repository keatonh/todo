import { Search, X, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { Filters, FilterStatus, FilterPriority, SortBy } from "../types";

interface Props {
  filters: Filters;
  categories: string[];
  completedCount: number;
  onFiltersChange: (f: Filters) => void;
  onClearCompleted: () => Promise<void>;
}

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "created_at", label: "등록일" },
  { value: "due_date", label: "마감일" },
];

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

const PRIORITY_OPTIONS: { value: FilterPriority; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "high", label: "높음" },
  { value: "medium", label: "보통" },
  { value: "low", label: "낮음" },
];

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-indigo-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function FilterBar({
  filters,
  categories,
  completedCount,
  onFiltersChange,
  onClearCompleted,
}: Props) {
  const update = (partial: Partial<Filters>) =>
    onFiltersChange({ ...filters, ...partial });

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="검색..."
          className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 rounded-lg pl-9 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200 dark:border-gray-700"
        />
        {filters.search && (
          <button
            onClick={() => update({ search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(v) => update({ status: v })}
        />
        <SegmentedControl
          options={PRIORITY_OPTIONS}
          value={filters.priority}
          onChange={(v) => update({ priority: v })}
        />
        <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <SegmentedControl
            options={SORT_OPTIONS}
            value={filters.sort_by}
            onChange={(v) => update({ sort_by: v })}
          />
          <button
            onClick={() =>
              update({ sort_order: filters.sort_order === "asc" ? "desc" : "asc" })
            }
            className="px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border-l border-gray-200 dark:border-gray-700"
            title={filters.sort_order === "asc" ? "오름차순" : "내림차순"}
          >
            {filters.sort_order === "asc" ? (
              <ArrowUpAZ className="w-4 h-4" />
            ) : (
              <ArrowDownAZ className="w-4 h-4" />
            )}
          </button>
        </div>
        {categories.length > 0 && (
          <select
            value={filters.category}
            onChange={(e) => update({ category: e.target.value })}
            className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">모든 카테고리</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="ml-auto text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            완료된 항목 삭제 ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
}
