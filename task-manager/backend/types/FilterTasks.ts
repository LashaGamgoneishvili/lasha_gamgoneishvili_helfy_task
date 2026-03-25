import { TaskPriority } from "./Tasks";

export type TaskFilterOptions = {
  completed?: boolean;
  priority?: TaskPriority;
  createdAtFrom?: Date;
  createdAtTo?: Date;
};
