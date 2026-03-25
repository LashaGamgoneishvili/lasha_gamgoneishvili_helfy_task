import React, { useState } from "react";
import type { TaskPriority } from "../../types";
import { TaskFormDetailsRow } from "./TaskFormDetailsRow";
import { TaskFormFields } from "./TaskFormFields";
import "./TaskForm.css";

interface TaskFormProps {
  onAdd: (
    title: string,
    description: string,
    priority: TaskPriority,
    dueDate?: Date
  ) => void;
}

const EMPTY_TASK_FORM = {
  title: "",
  description: "",
  priority: "medium" as TaskPriority,
  dueDate: "",
};

export const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState(EMPTY_TASK_FORM.title);
  const [description, setDescription] = useState(EMPTY_TASK_FORM.description);
  const [priority, setPriority] = useState<TaskPriority>(EMPTY_TASK_FORM.priority);
  const [dueDate, setDueDate] = useState(EMPTY_TASK_FORM.dueDate);

  const resetForm = () => {
    setTitle(EMPTY_TASK_FORM.title);
    setDescription(EMPTY_TASK_FORM.description);
    setPriority(EMPTY_TASK_FORM.priority);
    setDueDate(EMPTY_TASK_FORM.dueDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title, description, priority, dueDate ? new Date(dueDate) : undefined);
    resetForm();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <TaskFormFields
        title={title}
        description={description}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
      />
      <TaskFormDetailsRow
        priority={priority}
        dueDate={dueDate}
        onPriorityChange={setPriority}
        onDueDateChange={setDueDate}
      />
    </form>
  );
};
