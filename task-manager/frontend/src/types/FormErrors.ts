export type TaskFormField = "title" | "description" | "priority" | "dueDate";

export type TaskFormErrors = Partial<Record<TaskFormField, string>>;
