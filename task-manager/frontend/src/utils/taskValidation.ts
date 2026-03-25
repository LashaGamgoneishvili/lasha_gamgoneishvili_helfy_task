import type { TaskFormErrors } from "../types/FormErrors";
import type { TaskPriority } from "../types/Tasks";
import type {
  NormalizedTaskInput,
  TaskValidationInput,
} from "../types/TaskValidation";

export const TASK_TITLE_MAX_LENGTH = 50;
export const TASK_DESCRIPTION_MAX_LENGTH = 200;

const ALLOWED_PRIORITIES = new Set<TaskPriority>(["low", "medium", "high"]);

const isValidIsoDateOnly = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return false;

  return parsed.toISOString().startsWith(value);
};

export const normalizeTaskInput = (
  input: TaskValidationInput,
): NormalizedTaskInput => ({
  title: input.title.trim(),
  description: input.description.trim(),
  priority: input.priority.trim().toLowerCase(),
  dueDate: (input.dueDate ?? "").trim(),
});

export const validateTaskInput = (
  input: TaskValidationInput,
): TaskFormErrors => {
  const normalized = normalizeTaskInput(input);
  const errors: TaskFormErrors = {};

  if (!normalized.title) {
    errors.title = "title is required!";
  } else if (normalized.title.length > TASK_TITLE_MAX_LENGTH) {
    errors.title = "title can not contain more than 50 characters!";
  }

  if (!normalized.description) {
    errors.description = "description is required!";
  } else if (normalized.description.length > TASK_DESCRIPTION_MAX_LENGTH) {
    errors.description =
      "description can not contain more than 200 characters!";
  }

  if (!normalized.priority) {
    errors.priority = "priority is required";
  } else if (!ALLOWED_PRIORITIES.has(normalized.priority as TaskPriority)) {
    errors.priority = "priority can only be one of: low , medium , high!";
  }

  if (normalized.dueDate && !isValidIsoDateOnly(normalized.dueDate)) {
    errors.dueDate = "dueDate must be a valid ISO date!";
  }

  return errors;
};
