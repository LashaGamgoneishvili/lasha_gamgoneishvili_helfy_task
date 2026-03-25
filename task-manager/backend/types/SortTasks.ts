import { Task } from "./Tasks";

export type TaskSortField =
  | "id"
  | "title"
  | "createdAt"
  | "priority"
  | "dueDate";
export type TaskSortOrder = "asc" | "desc";

export type TaskSortOptions = {
  sortBy?: TaskSortField;
  sortOrder?: TaskSortOrder;
};

export const priorityRank: Record<Task["priority"], number> = {
  low: 1,
  medium: 2,
  high: 3,
};
