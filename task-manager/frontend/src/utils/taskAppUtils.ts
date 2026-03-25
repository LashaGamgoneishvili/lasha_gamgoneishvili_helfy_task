import type { FilterState, SortOption } from "../components/TaskFilters/TaskFilters";
import type { Task } from "../types";

const PRIORITY_ORDER: Record<Task["priority"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const parseStoredTasks = (raw: string | null, fallback: Task[]): Task[] => {
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
    }
  } catch {
    return fallback;
  }

  return fallback;
};

export const buildNewTask = (
  title: string,
  description: string,
  priority: Task["priority"],
  dueDate?: Date
): Task => ({
  id: Date.now(),
  title,
  description,
  priority,
  dueDate,
  completed: false,
  createdAt: new Date(),
});

export const filterTasks = (tasks: Task[], filters: FilterState): Task[] =>
  tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "completed" && task.completed) ||
      (filters.status === "pending" && !task.completed);
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;
    const matchesCreatedFrom =
      !filters.createdFrom ||
      new Date(task.createdAt) >= new Date(filters.createdFrom);
    const matchesCreatedTo =
      !filters.createdTo ||
      new Date(task.createdAt) <= new Date(filters.createdTo + "T23:59:59");
    const matchesDueFrom =
      !filters.dueFrom ||
      (task.dueDate && new Date(task.dueDate) >= new Date(filters.dueFrom));
    const matchesDueTo =
      !filters.dueTo ||
      (task.dueDate &&
        new Date(task.dueDate) <= new Date(filters.dueTo + "T23:59:59"));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCreatedFrom &&
      matchesCreatedTo &&
      matchesDueFrom &&
      matchesDueTo
    );
  });

export const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
  const sortable = [...tasks];

  return sortable.sort((a, b) => {
    switch (sortBy) {
      case "createdAt-desc":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "createdAt-asc":
        return a.createdAt.getTime() - b.createdAt.getTime();
      case "dueDate-asc":
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      case "dueDate-desc":
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return b.dueDate.getTime() - a.dueDate.getTime();
      case "priority-desc":
        return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
      case "priority-asc":
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
};

export const getTaskStats = (tasks: Task[]) => ({
  total: tasks.length,
  completed: tasks.filter((task) => task.completed).length,
  pending: tasks.filter((task) => !task.completed).length,
});
