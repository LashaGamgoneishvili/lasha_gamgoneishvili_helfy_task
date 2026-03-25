import { priorityRank, TaskSortOptions } from "../types/SortTasks";
import { Task } from "../types/Tasks";

export function sortTasks(
  tasks: Task[],
  options: TaskSortOptions = {},
): Task[] {
  const { sortBy = "createdAt", sortOrder = "desc" } = options;
  const direction = sortOrder === "asc" ? 1 : -1;

  return [...tasks].sort((a, b) => {
    let result = 0;

    switch (sortBy) {
      case "id":
        result = a.id - b.id;
        break;

      case "title":
        result = a.title.localeCompare(b.title);
        break;

      case "createdAt":
        result =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;

      case "priority":
        result = priorityRank[a.priority] - priorityRank[b.priority];
        break;

      case "dueDate": {
        const fallbackDueDateTime =
          sortOrder === "asc"
            ? Number.POSITIVE_INFINITY
            : Number.NEGATIVE_INFINITY;
        const aDueDateTime = a.dueDate
          ? new Date(a.dueDate).getTime()
          : fallbackDueDateTime;
        const bDueDateTime = b.dueDate
          ? new Date(b.dueDate).getTime()
          : fallbackDueDateTime;

        result = aDueDateTime - bDueDateTime;
        break;
      }
    }

    return result * direction;
  });
}
