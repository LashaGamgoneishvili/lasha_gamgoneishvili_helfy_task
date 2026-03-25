import React from "react";
import type { TaskPriority } from "../../types/Tasks";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { DateInput } from "../DateInput/DateInput";
import { PlusIcon } from "../Icons";
import { TASK_FORM_PRIORITY_OPTIONS } from "./TaskForm.constants";

interface TaskFormDetailsRowProps {
  priority: TaskPriority;
  dueDate: string;
  onPriorityChange: (priority: TaskPriority) => void;
  onDueDateChange: (value: string) => void;
}

export const TaskFormDetailsRow: React.FC<TaskFormDetailsRowProps> = ({
  priority,
  dueDate,
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
      />
    </div>

    <div className="form-group">
      <label>Due Date</label>
      <DateInput
        value={dueDate}
        onChange={(e) => onDueDateChange(e.target.value)}
      />
    </div>

    <button type="submit" className="add-btn">
      <PlusIcon size={20} />
      Add Task
    </button>
  </div>
);
