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

      case "dueDate":
        result =
          new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
        break;
    }

    return result * direction;
  });
}
