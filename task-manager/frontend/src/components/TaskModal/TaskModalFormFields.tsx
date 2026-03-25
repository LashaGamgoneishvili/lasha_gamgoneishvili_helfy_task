import React from "react";
import type { TaskPriority } from "../../types/Tasks";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { DateInput } from "../DateInput/DateInput";
import { TASK_MODAL_PRIORITY_OPTIONS } from "./TaskModal.constants";

interface TaskModalFormFieldsProps {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  titleError?: string;
  descriptionError?: string;
  priorityError?: string;
  dueDateError?: string;
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
  titleError,
  descriptionError,
  priorityError,
  dueDateError,
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
        className={titleError ? "field-input-error" : ""}
      />
      {titleError && <span className="field-error-text">{titleError}</span>}
    </div>

    <div className="form-group">
      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Task description"
        rows={3}
        required
        className={descriptionError ? "field-input-error" : ""}
      />
      {descriptionError && (
        <span className="field-error-text">{descriptionError}</span>
      )}
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Priority</label>
        <CustomSelect
          value={priority}
          onChange={(value) => onPriorityChange(value as TaskPriority)}
          options={TASK_MODAL_PRIORITY_OPTIONS}
          className={priorityError ? "field-input-error" : ""}
        />
        {priorityError && <span className="field-error-text">{priorityError}</span>}
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
  </>
);
