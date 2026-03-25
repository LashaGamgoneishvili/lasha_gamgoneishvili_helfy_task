import { TaskSortField, TaskSortOrder } from "./SortTasks";

export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  priority: TaskPriority;
};

export type GetAllTasksInput = {
  search?: string;
  completed?: boolean;
  priority?: TaskPriority;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  sortBy?: TaskSortField;
  sortOrder?: TaskSortOrder;
};
