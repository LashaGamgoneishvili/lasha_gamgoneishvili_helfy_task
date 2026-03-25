import React from "react";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { FilterIcon, SearchIcon, SortAscIcon } from "../../icons";
import { SORT_OPTIONS } from "./TaskFilters.constants";
import type { SortOption } from "./TaskFilters.types";

interface TaskFiltersMainControlsProps {
  localSearch: string;
  sortBy: SortOption;
  isExpanded: boolean;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (sort: SortOption) => void;
  onToggleExpanded: () => void;
}

const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div className="search-wrapper">
    <SearchIcon className="search-icon" size={18} />
    <input
      type="text"
      placeholder="Search tasks..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="search-input"
    />
  </div>
);

const SortSelect: React.FC<{
  value: SortOption;
  onChange: (sort: SortOption) => void;
}> = ({ value, onChange }) => (
  <div className="sort-wrapper">
    <CustomSelect
      value={value}
      onChange={(selected) => onChange(selected as SortOption)}
      leftIcon={<SortAscIcon size={18} />}
      options={SORT_OPTIONS}
      className="sort-select"
    />
  </div>
);

const FilterToggleButton: React.FC<{
  isExpanded: boolean;
  hasActiveFilters: boolean;
  onClick: () => void;
}> = ({ isExpanded, hasActiveFilters, onClick }) => (
  <button
    className={`filter-toggle ${isExpanded ? "active" : ""} ${
      hasActiveFilters ? "has-filters" : ""
    }`}
    onClick={onClick}
  >
    <FilterIcon size={18} />
    <span>Filters</span>
    {hasActiveFilters && <span className="filter-dot" />}
  </button>
);

export const TaskFiltersMainControls: React.FC<
  TaskFiltersMainControlsProps
> = ({
  localSearch,
  sortBy,
  isExpanded,
  hasActiveFilters,
  onSearchChange,
  onSortChange,
  onToggleExpanded,
}) => (
  <div className="filters-main">
    <SearchInput value={localSearch} onChange={onSearchChange} />
    <SortSelect value={sortBy} onChange={onSortChange} />
    <FilterToggleButton
      isExpanded={isExpanded}
      hasActiveFilters={hasActiveFilters}
      onClick={onToggleExpanded}
    />
  </div>
);
