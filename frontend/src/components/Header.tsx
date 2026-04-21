import { Sun, Moon, CheckSquare } from "lucide-react";

interface Props {
  stats: { total: number; active: number; completed: number };
  dark: boolean;
  onToggleDark: () => void;
}

export function Header({ stats, dark, onToggleDark }: Props) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CheckSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Todo
          </h1>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {stats.active}
              </span>{" "}
              남음
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {stats.completed}
              </span>{" "}
              완료
            </span>
            <span className="text-gray-400 dark:text-gray-600 text-xs">
              전체 {stats.total}
            </span>
          </div>

          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="다크모드 토글"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
