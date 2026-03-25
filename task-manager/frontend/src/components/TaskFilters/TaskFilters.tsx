import React, { useEffect, useMemo, useState } from "react";
import { DEFAULT_FILTER_STATE } from "./TaskFilters.constants";
import { TaskFiltersExpandedPanel } from "./TaskFiltersExpandedPanel";
import { TaskFiltersMainControls } from "./TaskFiltersMainControls";
import type { FilterState, SortOption } from "./TaskFilters.types";
import "./TaskFilters.css";

interface TaskFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export type { FilterState, SortOption } from "./TaskFilters.types";
export { DEFAULT_FILTER_STATE } from "./TaskFilters.constants";

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search);

  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ ...filters, search: localSearch });
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [localSearch, filters, onFilterChange]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = useMemo(
    () =>
      filters.status !== "all" ||
      filters.priority !== "all" ||
      filters.createdFrom !== "" ||
      filters.createdTo !== "" ||
      filters.dueFrom !== "" ||
      filters.dueTo !== "",
    [filters]
  );

  return (
    <div className="filters-container">
      <TaskFiltersMainControls
        localSearch={localSearch}
        sortBy={sortBy}
        isExpanded={isExpanded}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setLocalSearch}
        onSortChange={onSortChange}
        onToggleExpanded={() => setIsExpanded((prev) => !prev)}
      />

      {isExpanded && (
        <TaskFiltersExpandedPanel
          filters={filters}
          onChange={handleFilterChange}
          onClear={() => onFilterChange(DEFAULT_FILTER_STATE)}
        />
      )}
    </div>
  );
};
