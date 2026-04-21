import { Header } from "./components/Header";
import { TodoForm } from "./components/TodoForm";
import { FilterBar } from "./components/FilterBar";
import { TodoList } from "./components/TodoList";
import { useTodos } from "./hooks/useTodos";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  const {
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
  } = useTodos();

  const { dark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header stats={stats} dark={dark} onToggleDark={toggle} />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <TodoForm categories={categories} onAdd={addTodo} />
        <FilterBar
          filters={filters}
          categories={categories}
          completedCount={stats.completed}
          onFiltersChange={setFilters}
          onClearCompleted={clearCompleted}
        />
        <TodoList
          todos={todos}
          loading={loading}
          error={error}
          onToggle={toggleTodo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
        />
      </main>
    </div>
  );
}

export default App;
