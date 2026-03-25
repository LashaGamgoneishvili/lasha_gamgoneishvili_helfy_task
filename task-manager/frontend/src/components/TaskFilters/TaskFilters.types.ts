import type { TaskPriority } from "../../types";

export type SortOption =
  | "createdAt-desc"
  | "createdAt-asc"
  | "dueDate-asc"
  | "dueDate-desc"
  | "priority-desc"
  | "priority-asc"
  | "title-asc"
  | "title-desc";

export interface FilterState {
  search: string;
  status: "all" | "completed" | "pending";
  priority: "all" | TaskPriority;
  createdFrom: string;
  createdTo: string;
  dueFrom: string;
  dueTo: string;
}
