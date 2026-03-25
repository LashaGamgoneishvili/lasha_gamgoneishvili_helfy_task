import React from "react";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { DateInput } from "../DateInput/DateInput";
import { XIcon } from "../Icons";
import {
  PRIORITY_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "./TaskFilters.constants";
import type { FilterState } from "./TaskFilters.types";

interface TaskFiltersExpandedPanelProps {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
}

const SelectFilterGroup: React.FC<{
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div className="filter-group">
    <label>{label}</label>
    <CustomSelect value={value} onChange={onChange} options={options} />
  </div>
);

const DateFilterGroup: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="filter-group">
    <label>{label}</label>
    <DateInput value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export const TaskFiltersExpandedPanel: React.FC<TaskFiltersExpandedPanelProps> = ({
  filters,
  onChange,
  onClear,
}) => (
  <div className="filters-expanded">
    <div className="filter-grid">
      <SelectFilterGroup
        label="Status"
        value={filters.status}
        onChange={(value) => onChange("status", value)}
        options={STATUS_FILTER_OPTIONS}
      />

      <SelectFilterGroup
        label="Priority"
        value={filters.priority}
        onChange={(value) => onChange("priority", value)}
        options={PRIORITY_FILTER_OPTIONS}
      />

      <DateFilterGroup
        label="Created From"
        value={filters.createdFrom}
        onChange={(value) => onChange("createdFrom", value)}
      />

      <DateFilterGroup
        label="Created To"
        value={filters.createdTo}
        onChange={(value) => onChange("createdTo", value)}
      />

      <DateFilterGroup
        label="Due From"
        value={filters.dueFrom}
        onChange={(value) => onChange("dueFrom", value)}
      />

      <DateFilterGroup
        label="Due To"
        value={filters.dueTo}
        onChange={(value) => onChange("dueTo", value)}
      />
    </div>

    <div className="filter-actions">
      <button className="clear-btn" onClick={onClear}>
        <XIcon size={14} />
        Clear All
      </button>
    </div>
  </div>
);
