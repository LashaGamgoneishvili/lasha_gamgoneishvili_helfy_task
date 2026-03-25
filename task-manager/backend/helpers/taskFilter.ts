import { TaskFilterOptions } from "../types/FilterTasks";
import { Task } from "../types/Tasks";

export function filterTasks(
  tasks: Task[],
  filters: TaskFilterOptions = {},
): Task[] {
  return tasks.filter((task) => {
    if (
      filters.completed !== undefined &&
      task.completed !== filters.completed
    ) {
      return false;
    }

    if (filters.priority !== undefined && task.priority !== filters.priority) {
      return false;
    }

    const createdAtTime = new Date(task.createdAt).getTime();

    if (
      filters.createdAtFrom &&
      createdAtTime < filters.createdAtFrom.getTime()
    ) {
      return false;
    }

    if (filters.createdAtTo && createdAtTime > filters.createdAtTo.getTime()) {
      return false;
    }

    if (!task.dueDate) {
      if (filters.dueDateFrom || filters.dueDateTo) {
        return false;
      }

      return true;
    }

    const dueDateTime = new Date(task.dueDate).getTime();

    if (filters.dueDateFrom && dueDateTime < filters.dueDateFrom.getTime()) {
      return false;
    }

    if (filters.dueDateTo && dueDateTime > filters.dueDateTo.getTime()) {
      return false;
    }

    return true;
  });
}
