import { useEffect, useMemo, useState } from "react";
import type { FilterState, SortOption } from "./components/TaskFilters/TaskFilters";
import { ConfirmModal } from "./components/ConfirmModal/ConfirmModal";
import { TaskModal } from "./components/TaskModal/TaskModal";
import { AppHeaderSection } from "./components/AppSections/AppHeaderSection";
import { TaskCreationSection } from "./components/AppSections/TaskCreationSection";
import { TaskListSection } from "./components/AppSections/TaskListSection";
import { MOCK_TASKS } from "./constants/mockTasks";
import type { Task, TaskPriority } from "./types";
import {
  buildNewTask,
  filterTasks,
  getTaskStats,
  parseStoredTasks,
  sortTasks,
} from "./utils/taskAppUtils";
import "./App.css";

const INITIAL_FILTERS: FilterState = {
  search: "",
  status: "all",
  priority: "all",
  createdFrom: "",
  createdTo: "",
  dueFrom: "",
  dueTo: "",
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const [tasks, setTasks] = useState<Task[]>(() =>
    parseStoredTasks(localStorage.getItem("tasks"), MOCK_TASKS)
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("createdAt-desc");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      return;
    }

    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (
    title: string,
    description: string,
    priority: TaskPriority,
    dueDate?: Date
  ) => {
    const newTask = buildNewTask(title, description, priority, dueDate);
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleToggleTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleConfirmDelete = (id: number) => {
    setDeletingTaskId(id);
  };

  const handleDeleteTask = () => {
    if (deletingTaskId === null) return;

    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== deletingTaskId)
    );
    setDeletingTaskId(null);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleReorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const filteredAndSortedTasks = useMemo(() => {
    const filteredTasks = filterTasks(tasks, filters);
    return sortTasks(filteredTasks, sortBy);
  }, [tasks, filters, sortBy]);

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);

  return (
    <div className="app-container">
      <AppHeaderSection
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        stats={stats}
      />

      <main className="app-main">
        <TaskCreationSection onAddTask={handleAddTask} />

        <TaskListSection
          tasks={filteredAndSortedTasks}
          filters={filters}
          sortBy={sortBy}
          onFilterChange={setFilters}
          onSortChange={setSortBy}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleConfirmDelete}
          onEditTask={setEditingTask}
          onReorderTasks={handleReorderTasks}
        />
      </main>

      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSave={handleUpdateTask}
      />

      <ConfirmModal
        isOpen={deletingTaskId !== null}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
}
