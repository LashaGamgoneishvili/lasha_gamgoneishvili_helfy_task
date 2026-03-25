import React from "react";
import type { TaskPriority } from "../../types";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { DateInput } from "../DateInput/DateInput";
import { TASK_MODAL_PRIORITY_OPTIONS } from "./TaskModal.constants";

interface TaskModalFormFieldsProps {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
  onDueDateChange: (value: string) => void;
}

export const TaskModalFormFields: React.FC<TaskModalFormFieldsProps> = ({
  title,
  description,
  priority,
  dueDate,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onDueDateChange,
}) => (
  <>
    <div className="form-group">
      <label>Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        required
        placeholder="Task title"
      />
    </div>

    <div className="form-group">
      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Task description"
        rows={3}
      />
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Priority</label>
        <CustomSelect
          value={priority}
          onChange={(value) => onPriorityChange(value as TaskPriority)}
          options={TASK_MODAL_PRIORITY_OPTIONS}
        />
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <DateInput value={dueDate} onChange={(e) => onDueDateChange(e.target.value)} />
      </div>
    </div>
  </>
);
