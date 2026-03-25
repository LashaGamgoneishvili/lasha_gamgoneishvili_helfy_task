import React, { useMemo, useState } from "react";
import type { TaskFormErrors } from "../../types/FormErrors";
import type { TaskPriority } from "../../types/Tasks";
import { TaskFormDetailsRow } from "./TaskFormDetailsRow";
import { TaskFormFields } from "./TaskFormFields";
import { PlusIcon } from "../../icons";
import { normalizeTaskInput, validateTaskInput } from "../../utils/taskValidation";
import "./TaskForm.css";

interface TaskFormProps {
  onAdd: (
    title: string,
    description: string,
    priority: TaskPriority,
    dueDate?: Date,
  ) => Promise<boolean>;
  errors: TaskFormErrors;
}

const EMPTY_TASK_FORM = {
  title: "",
  description: "",
  priority: "medium" as TaskPriority,
  dueDate: "",
};

export const TaskForm: React.FC<TaskFormProps> = ({ onAdd, errors }) => {
  const [title, setTitle] = useState(EMPTY_TASK_FORM.title);
  const [description, setDescription] = useState(EMPTY_TASK_FORM.description);
  const [priority, setPriority] = useState<TaskPriority>(
    EMPTY_TASK_FORM.priority,
  );
  const [dueDate, setDueDate] = useState(EMPTY_TASK_FORM.dueDate);
  const [clientErrors, setClientErrors] = useState<TaskFormErrors>({});

  const mergedErrors = useMemo(
    () => ({ ...errors, ...clientErrors }),
    [errors, clientErrors],
  );

  const resetForm = () => {
    setTitle(EMPTY_TASK_FORM.title);
    setDescription(EMPTY_TASK_FORM.description);
    setPriority(EMPTY_TASK_FORM.priority);
    setDueDate(EMPTY_TASK_FORM.dueDate);
    setClientErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeTaskInput({
      title,
      description,
      priority,
      dueDate,
    });

    const validationErrors = validateTaskInput(normalized);
    if (Object.keys(validationErrors).length > 0) {
      setClientErrors(validationErrors);
      return;
    }

    setClientErrors({});

    const created = await onAdd(
      normalized.title,
      normalized.description,
      normalized.priority as TaskPriority,
      normalized.dueDate ? new Date(normalized.dueDate) : undefined,
    );

    if (created) {
      resetForm();
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <TaskFormFields
        title={title}
        description={description}
        titleError={mergedErrors.title}
        descriptionError={mergedErrors.description}
        onTitleChange={(value) => {
          setTitle(value);
          setClientErrors((prev) => ({ ...prev, title: undefined }));
        }}
        onDescriptionChange={(value) => {
          setDescription(value);
          setClientErrors((prev) => ({ ...prev, description: undefined }));
        }}
      />
      <TaskFormDetailsRow
        priority={priority}
        dueDate={dueDate}
        priorityError={mergedErrors.priority}
        dueDateError={mergedErrors.dueDate}
        onPriorityChange={(value) => {
          setPriority(value);
          setClientErrors((prev) => ({ ...prev, priority: undefined }));
        }}
        onDueDateChange={(value) => {
          setDueDate(value);
          setClientErrors((prev) => ({ ...prev, dueDate: undefined }));
        }}
      />
      <button type="submit" className="add-btn">
        <PlusIcon size={20} />
        Add Task
      </button>
    </form>
  );
};
