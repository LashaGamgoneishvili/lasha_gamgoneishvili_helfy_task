import type { Task } from "../types/Tasks";
import {
  ApiRequestError,
  type ApiErrorResponse,
  type ApiFieldValidationError,
  type ApiTask,
  type CreateTaskPayload,
  type FetchTasksParams,
  type UpdateTaskPayload,
} from "../types/TasksApi";
export type { FetchTasksParams } from "../types/TasksApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const TASKS_API_URL = `${API_BASE_URL}/api/tasks`;

export const isApiRequestError = (error: unknown): error is ApiRequestError =>
  error instanceof ApiRequestError;

const toTask = (apiTask: ApiTask): Task => ({
  ...apiTask,
  createdAt: new Date(apiTask.createdAt),
  dueDate: apiTask.dueDate ? new Date(apiTask.dueDate) : undefined,
});

const toJsonHeaders = {
  "Content-Type": "application/json",
};

const request = async <T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(input, init);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let errors: ApiFieldValidationError[] = [];

    try {
      const data = (await response.json()) as ApiErrorResponse;
      if (data.msg) message = data.msg;
      if (Array.isArray(data.errors)) {
        errors = data.errors.filter(
          (item): item is ApiFieldValidationError =>
            typeof item?.field === "string" && typeof item?.msg === "string",
        );
      }
    } catch {}

    throw new ApiRequestError(response.status, message, errors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const buildQueryString = (params: FetchTasksParams = {}): string => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  const result = query.toString();
  return result ? `?${result}` : "";
};

export const fetchTasks = async (
  params: FetchTasksParams = {},
): Promise<Task[]> => {
  const data = await request<ApiTask[]>(
    `${TASKS_API_URL}${buildQueryString(params)}`,
  );
  return data.map(toTask);
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const data = await request<ApiTask>(TASKS_API_URL, {
    method: "POST",
    headers: toJsonHeaders,
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      dueDate: payload.dueDate?.toISOString(),
    }),
  });

  return toTask(data);
};

export const updateTaskById = async (
  payload: UpdateTaskPayload,
): Promise<Task> => {
  const data = await request<ApiTask>(`${TASKS_API_URL}/${payload.id}`, {
    method: "PUT",
    headers: toJsonHeaders,
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      dueDate: payload.dueDate?.toISOString(),
    }),
  });

  return toTask(data);
};

export const deleteTaskById = async (id: number): Promise<void> => {
  await request<void>(`${TASKS_API_URL}/${id}`, {
    method: "DELETE",
  });
};

export const toggleTaskStatus = async (
  id: number,
  completed: boolean,
): Promise<Task | null> => {
  const data = await request<ApiTask | undefined>(
    `${TASKS_API_URL}/${id}/toggle`,
    {
      method: "PATCH",
      headers: toJsonHeaders,
      body: JSON.stringify({ completed }),
    },
  );

  return data ? toTask(data) : null;
};
