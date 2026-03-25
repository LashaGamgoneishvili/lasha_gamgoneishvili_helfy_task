import { useEffect, useMemo, useState } from "react";
import type { FilterState, SortOption } from "./components/TaskFilters/TaskFilters";
import { ConfirmModal } from "./components/ConfirmModal/ConfirmModal";
import { TaskModal } from "./components/TaskModal/TaskModal";
import { AppHeaderSection } from "./components/AppSections/AppHeaderSection";
import { TaskCreationSection } from "./components/AppSections/TaskCreationSection";
import { TaskListSection } from "./components/AppSections/TaskListSection";
import {
  createTask,
  deleteTaskById,
  fetchTasks,
  toggleTaskStatus,
  updateTaskById,
} from "./api/tasksApi";
import type { Task, TaskPriority } from "./types";
import { buildFetchTasksParams } from "./utils/taskApiQuery";
import {
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
  const [cachedTasks] = useState<Task[]>(() =>
    parseStoredTasks(localStorage.getItem("tasks"))
  );

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const [tasks, setTasks] = useState<Task[]>(cachedTasks);
  const [remoteFilteredTasks, setRemoteFilteredTasks] = useState<Task[] | null>(
    null
  );
  const [isInitialTasksLoading, setIsInitialTasksLoading] = useState(
    cachedTasks.length === 0
  );
  const [queryRefreshKey, setQueryRefreshKey] = useState(0);
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

  useEffect(() => {
    let isActive = true;

    const syncTasksFromApi = async () => {
      try {
        const remoteTasks = await fetchTasks();
        if (isActive) {
          setTasks(remoteTasks);
        }
      } catch (error) {
        console.error("Failed to load tasks from API. Using local cache.", error);
      } finally {
        if (isActive) {
          setIsInitialTasksLoading(false);
        }
      }
    };

    void syncTasksFromApi();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const syncFilteredTasksFromApi = async () => {
      setRemoteFilteredTasks(null);

      try {
        const remoteTasks = await fetchTasks(
          buildFetchTasksParams(filters, sortBy)
        );
        if (isActive) {
          setRemoteFilteredTasks(remoteTasks);
        }
      } catch (error) {
        if (isActive) {
          setRemoteFilteredTasks(null);
        }
        console.error(
          "Failed to load filtered/sorted tasks from API. Using local filtering.",
          error
        );
      }
    };

    void syncFilteredTasksFromApi();

    return () => {
      isActive = false;
    };
  }, [filters, sortBy, queryRefreshKey]);

  const handleAddTask = async (
    title: string,
    description: string,
    priority: TaskPriority,
    dueDate?: Date
  ) => {
    const optimisticTask: Task = {
      id: -Date.now(),
      title,
      description,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date(),
    };

    setTasks((prevTasks) => [optimisticTask, ...prevTasks]);

    try {
      const createdTask = await createTask({
        title,
        description,
        priority,
        dueDate,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === optimisticTask.id ? createdTask : task
        )
      );
      setQueryRefreshKey((prev) => prev + 1);
    } catch (error) {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== optimisticTask.id)
      );
      console.error("Failed to create task.", error);
    }
  };

  const handleToggleTask = async (id: number) => {
    const existingTask = tasks.find((task) => task.id === id);
    if (!existingTask) return;

    const nextCompleted = !existingTask.completed;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: nextCompleted } : task
      )
    );

    try {
      const updatedTask = await toggleTaskStatus(id, nextCompleted);
      if (!updatedTask) {
        setQueryRefreshKey((prev) => prev + 1);
        return;
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      setQueryRefreshKey((prev) => prev + 1);
    } catch (error) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: existingTask.completed } : task
        )
      );
      console.error("Failed to toggle task status.", error);
    }
  };

  const handleConfirmDelete = (id: number) => {
    setDeletingTaskId(id);
  };

  const handleDeleteTask = async () => {
    if (deletingTaskId === null) return;

    const taskIdToDelete = deletingTaskId;
    const deletedTaskIndex = tasks.findIndex((task) => task.id === taskIdToDelete);
    const deletedTask = tasks[deletedTaskIndex];

    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskIdToDelete)
    );
    setDeletingTaskId(null);

    try {
      await deleteTaskById(taskIdToDelete);
      setQueryRefreshKey((prev) => prev + 1);
    } catch (error) {
      if (deletedTask && deletedTaskIndex >= 0) {
        setTasks((prevTasks) => {
          if (prevTasks.some((task) => task.id === deletedTask.id)) {
            return prevTasks;
          }

          const restoredTasks = [...prevTasks];
          restoredTasks.splice(deletedTaskIndex, 0, deletedTask);
          return restoredTasks;
        });
      }
      console.error("Failed to delete task.", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    const previousTask = tasks.find((task) => task.id === updatedTask.id);
    if (!previousTask) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

    try {
      const savedTask = await updateTaskById(updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === savedTask.id ? savedTask : task))
      );
      setQueryRefreshKey((prev) => prev + 1);
    } catch (error) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === previousTask.id ? previousTask : task
        )
      );
      console.error("Failed to update task.", error);
    }
  };

  const handleReorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const localFilteredAndSortedTasks = useMemo(() => {
    const filteredTasks = filterTasks(tasks, filters);
    return sortTasks(filteredTasks, sortBy);
  }, [tasks, filters, sortBy]);

  const displayedTasks = remoteFilteredTasks ?? localFilteredAndSortedTasks;
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
          tasks={displayedTasks}
          isInitialLoading={isInitialTasksLoading}
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
