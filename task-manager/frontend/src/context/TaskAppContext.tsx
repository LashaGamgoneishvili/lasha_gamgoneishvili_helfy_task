import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { FilterState, SortOption } from "../components/TaskFilters/TaskFilters";
import {
  createTask,
  deleteTaskById,
  fetchTasks,
  isApiRequestError,
  toggleTaskStatus,
  updateTaskById,
} from "../api/tasksApi";
import type { TaskFormErrors } from "../types/FormErrors";
import type { Task, TaskPriority } from "../types/Tasks";
import { buildFetchTasksParams } from "../utils/taskApiQuery";
import {
  filterTasks,
  getTaskStats,
  parseStoredTasks,
  sortTasks,
} from "../utils/taskAppUtils";

const INITIAL_FILTERS: FilterState = {
  search: "",
  status: "all",
  priority: "all",
  createdFrom: "",
  createdTo: "",
  dueFrom: "",
  dueTo: "",
};

const EMPTY_FORM_ERRORS: TaskFormErrors = {};
const TASK_FORM_FIELDS = new Set(["title", "description", "priority", "dueDate"]);

const extractTaskFormErrors = (error: unknown): TaskFormErrors => {
  if (!isApiRequestError(error)) return EMPTY_FORM_ERRORS;

  return error.errors.reduce<TaskFormErrors>((acc, item) => {
    if (
      TASK_FORM_FIELDS.has(item.field) &&
      !acc[item.field as keyof TaskFormErrors]
    ) {
      acc[item.field as keyof TaskFormErrors] = item.msg;
    }
    return acc;
  }, {});
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isApiRequestError(error) && error.message) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

interface TaskAppContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
  stats: ReturnType<typeof getTaskStats>;
  displayedTasks: Task[];
  isInitialTasksLoading: boolean;
  filters: FilterState;
  sortBy: SortOption;
  setFilters: (filters: FilterState) => void;
  setSortBy: (sort: SortOption) => void;
  addTask: (
    title: string,
    description: string,
    priority: TaskPriority,
    dueDate?: Date
  ) => Promise<boolean>;
  createTaskErrors: TaskFormErrors;
  toggleTask: (id: number) => Promise<void>;
  confirmDeleteTask: (id: number) => void;
  reorderTasks: (newTasks: Task[]) => void;
  editingTask: Task | null;
  openEditTask: (task: Task) => void;
  closeTaskModal: () => void;
  updateTask: (updatedTask: Task) => Promise<boolean>;
  editTaskErrors: TaskFormErrors;
  deletingTaskId: number | null;
  closeConfirmModal: () => void;
  deleteTask: () => Promise<void>;
  toastMessage: string | null;
  closeToast: () => void;
}

const TaskAppContext = createContext<TaskAppContextValue | null>(null);

export const TaskAppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
  const [createTaskErrors, setCreateTaskErrors] = useState<TaskFormErrors>({});
  const [editTaskErrors, setEditTaskErrors] = useState<TaskFormErrors>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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
    if (!toastMessage) return;

    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!editingTask) {
      setEditTaskErrors({});
    }
  }, [editingTask]);

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
        if (cachedTasks.length === 0) {
          setToastMessage(getErrorMessage(error, "Failed to load tasks."));
        }
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
        const remoteTasks = await fetchTasks(buildFetchTasksParams(filters, sortBy));
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

  const addTask = async (
    title: string,
    description: string,
    priority: TaskPriority,
    dueDate?: Date
  ): Promise<boolean> => {
    setCreateTaskErrors({});

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
      return true;
    } catch (error) {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== optimisticTask.id)
      );

      const fieldErrors = extractTaskFormErrors(error);
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      setCreateTaskErrors(fieldErrors);
      if (!hasFieldErrors) {
        setToastMessage(getErrorMessage(error, "Failed to create task."));
      }

      console.error("Failed to create task.", error);
      return false;
    }
  };

  const toggleTask = async (id: number) => {
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
      setToastMessage(
        getErrorMessage(error, "Failed to update task completion status.")
      );
      console.error("Failed to toggle task status.", error);
    }
  };

  const confirmDeleteTask = (id: number) => {
    setDeletingTaskId(id);
  };

  const deleteTask = async () => {
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

      setToastMessage(getErrorMessage(error, "Failed to delete task."));
      console.error("Failed to delete task.", error);
    }
  };

  const updateTask = async (updatedTask: Task): Promise<boolean> => {
    setEditTaskErrors({});

    const previousTask = tasks.find((task) => task.id === updatedTask.id);
    if (!previousTask) return false;

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

    try {
      const savedTask = await updateTaskById(updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === savedTask.id ? savedTask : task))
      );
      setQueryRefreshKey((prev) => prev + 1);
      return true;
    } catch (error) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === previousTask.id ? previousTask : task
        )
      );

      const fieldErrors = extractTaskFormErrors(error);
      const hasFieldErrors = Object.keys(fieldErrors).length > 0;
      setEditTaskErrors(fieldErrors);
      if (!hasFieldErrors) {
        setToastMessage(getErrorMessage(error, "Failed to update task."));
      }

      console.error("Failed to update task.", error);
      return false;
    }
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const localFilteredAndSortedTasks = useMemo(() => {
    const filteredTasks = filterTasks(tasks, filters);
    return sortTasks(filteredTasks, sortBy);
  }, [tasks, filters, sortBy]);

  const displayedTasks = remoteFilteredTasks ?? localFilteredAndSortedTasks;
  const stats = useMemo(() => getTaskStats(tasks), [tasks]);

  const value = useMemo<TaskAppContextValue>(
    () => ({
      isDarkMode,
      toggleTheme: () => setIsDarkMode((prev) => !prev),
      stats,
      displayedTasks,
      isInitialTasksLoading,
      filters,
      sortBy,
      setFilters,
      setSortBy,
      addTask,
      createTaskErrors,
      toggleTask,
      confirmDeleteTask,
      reorderTasks,
      editingTask,
      openEditTask: setEditingTask,
      closeTaskModal: () => setEditingTask(null),
      updateTask,
      editTaskErrors,
      deletingTaskId,
      closeConfirmModal: () => setDeletingTaskId(null),
      deleteTask,
      toastMessage,
      closeToast: () => setToastMessage(null),
    }),
    [
      isDarkMode,
      stats,
      displayedTasks,
      isInitialTasksLoading,
      filters,
      sortBy,
      createTaskErrors,
      editingTask,
      editTaskErrors,
      deletingTaskId,
      toastMessage,
    ]
  );

  return <TaskAppContext.Provider value={value}>{children}</TaskAppContext.Provider>;
};

export const useTaskApp = (): TaskAppContextValue => {
  const context = useContext(TaskAppContext);
  if (!context) {
    throw new Error("useTaskApp must be used within TaskAppProvider");
  }

  return context;
};
