import type { FilterState } from "./TaskFilters.types";

export const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "dueDate-asc", label: "Due Soonest" },
  { value: "dueDate-desc", label: "Due Latest" },
  { value: "priority-desc", label: "Priority: High to Low" },
  { value: "priority-asc", label: "Priority: Low to High" },
  { value: "title-asc", label: "Title: A-Z" },
  { value: "title-desc", label: "Title: Z-A" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
];

export const PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const DEFAULT_FILTER_STATE: FilterState = {
  search: "",
  status: "all",
  priority: "all",
  createdFrom: "",
  createdTo: "",
  dueFrom: "",
  dueTo: "",
};
