import type { FetchTasksParams } from "../api/tasksApi";
import type { FilterState, SortOption } from "../components/TaskFilters/TaskFilters";

const SORT_OPTION_TO_API: Record<
  SortOption,
  { sortBy: NonNullable<FetchTasksParams["sortBy"]>; sortOrder: NonNullable<FetchTasksParams["sortOrder"]> }
> = {
  "createdAt-desc": { sortBy: "createdAt", sortOrder: "desc" },
  "createdAt-asc": { sortBy: "createdAt", sortOrder: "asc" },
  "dueDate-asc": { sortBy: "dueDate", sortOrder: "asc" },
  "dueDate-desc": { sortBy: "dueDate", sortOrder: "desc" },
  "priority-desc": { sortBy: "priority", sortOrder: "desc" },
  "priority-asc": { sortBy: "priority", sortOrder: "asc" },
  "title-asc": { sortBy: "title", sortOrder: "asc" },
  "title-desc": { sortBy: "title", sortOrder: "desc" },
};

export const buildFetchTasksParams = (
  filters: FilterState,
  sortOption: SortOption
): FetchTasksParams => {
  const sort = SORT_OPTION_TO_API[sortOption];

  return {
    search: filters.search.trim() || undefined,
    completed:
      filters.status === "completed"
        ? true
        : filters.status === "pending"
          ? false
          : undefined,
    priority: filters.priority === "all" ? undefined : filters.priority,
    createdAtFrom: filters.createdFrom || undefined,
    createdAtTo: filters.createdTo || undefined,
    dueDateFrom: filters.dueFrom || undefined,
    dueDateTo: filters.dueTo || undefined,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
  };
};
