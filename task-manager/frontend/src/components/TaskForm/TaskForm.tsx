import React, { useState } from "react";
import type { TaskFormErrors } from "../../types/FormErrors";
import type { TaskPriority } from "../../types/Tasks";
import { TaskFormDetailsRow } from "./TaskFormDetailsRow";
import { TaskFormFields } from "./TaskFormFields";
import { PlusIcon } from "../../icons";
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

  const resetForm = () => {
    setTitle(EMPTY_TASK_FORM.title);
    setDescription(EMPTY_TASK_FORM.description);
    setPriority(EMPTY_TASK_FORM.priority);
    setDueDate(EMPTY_TASK_FORM.dueDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const created = await onAdd(
      title,
      description,
      priority,
      dueDate ? new Date(dueDate) : undefined,
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
        titleError={errors.title}
        descriptionError={errors.description}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
      />
      <TaskFormDetailsRow
        priority={priority}
        dueDate={dueDate}
        priorityError={errors.priority}
        dueDateError={errors.dueDate}
        onPriorityChange={setPriority}
        onDueDateChange={setDueDate}
      />
      <button type="submit" className="add-btn">
        <PlusIcon size={20} />
        Add Task
      </button>
    </form>
  );
};
