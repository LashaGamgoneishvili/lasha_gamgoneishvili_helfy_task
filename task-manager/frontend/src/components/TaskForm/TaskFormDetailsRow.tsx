import React from "react";
import type { TaskPriority } from "../../types/Tasks";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { DateInput } from "../DateInput/DateInput";
import { TASK_FORM_PRIORITY_OPTIONS } from "./TaskForm.constants";

interface TaskFormDetailsRowProps {
  priority: TaskPriority;
  dueDate: string;
  priorityError?: string;
  dueDateError?: string;
  onPriorityChange: (priority: TaskPriority) => void;
  onDueDateChange: (value: string) => void;
}

export const TaskFormDetailsRow: React.FC<TaskFormDetailsRowProps> = ({
  priority,
  dueDate,
  priorityError,
  dueDateError,
  onPriorityChange,
  onDueDateChange,
}) => (
  <div className="form-row">
    <div className="form-group">
      <label>Priority</label>
      <CustomSelect
        value={priority}
        options={TASK_FORM_PRIORITY_OPTIONS}
        onChange={(value) => onPriorityChange(value as TaskPriority)}
        className={priorityError ? "field-input-error" : ""}
      />
      {priorityError && (
        <span className="field-error-text">{priorityError}</span>
      )}
    </div>

    <div className="form-group">
      <label>Due Date</label>
      <DateInput
        value={dueDate}
        onChange={(e) => onDueDateChange(e.target.value)}
        className={dueDateError ? "field-input-error" : ""}
      />
      {dueDateError && <span className="field-error-text">{dueDateError}</span>}
    </div>
  </div>
);
