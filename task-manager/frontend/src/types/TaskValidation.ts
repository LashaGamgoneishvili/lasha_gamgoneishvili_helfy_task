export type TaskValidationInput = {
  title: string;
  description: string;
  priority: string;
  dueDate?: string | null;
};

export type NormalizedTaskInput = {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
};
