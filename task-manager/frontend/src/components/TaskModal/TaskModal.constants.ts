import type { TaskPriority } from "../../types";

export const TASK_MODAL_EXIT_ANIMATION_MS = 260;

export const TASK_MODAL_PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
