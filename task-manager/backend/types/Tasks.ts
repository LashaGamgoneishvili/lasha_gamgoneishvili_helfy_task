import { TaskSortField, TaskSortOrder } from "./SortTasks";

export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: TaskPriority;
};

export type GetAllTasksInput = {
  search?: string;
  completed?: boolean;
  priority?: TaskPriority;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  sortBy?: TaskSortField;
  sortOrder?: TaskSortOrder;
};
