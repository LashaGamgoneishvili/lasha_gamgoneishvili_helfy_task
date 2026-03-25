import type { TaskPriority } from "./Tasks";

export type ApiTask = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string | Date;
  dueDate?: string | Date;
  priority: TaskPriority;
};

export type FetchTasksParams = {
  search?: string;
  completed?: boolean;
  priority?: TaskPriority;
  createdAtFrom?: string;
  createdAtTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: "id" | "title" | "createdAt" | "priority" | "dueDate";
  sortOrder?: "asc" | "desc";
};

export type CreateTaskPayload = {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate?: Date;
};

export type UpdateTaskPayload = {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate?: Date;
};

export type ApiFieldValidationError = {
  field: string;
  msg: string;
};

export type ApiErrorResponse = {
  msg?: string;
  errors?: ApiFieldValidationError[];
};

export class ApiRequestError extends Error {
  status: number;
  errors: ApiFieldValidationError[];

  constructor(
    status: number,
    message: string,
    errors: ApiFieldValidationError[],
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}
