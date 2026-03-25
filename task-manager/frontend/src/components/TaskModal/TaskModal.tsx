import React, { useState, useEffect } from "react";
import type { TaskFormErrors } from "../../types/FormErrors";
import type { Task, TaskPriority } from "../../types/Tasks";
import { TaskModalActions } from "./TaskModalActions";
import { TASK_MODAL_EXIT_ANIMATION_MS } from "./TaskModal.constants";
import { TaskModalFormFields } from "./TaskModalFormFields";
import { TaskModalHeader } from "./TaskModalHeader";
import "./TaskModal.css";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => Promise<boolean>;
  errors: TaskFormErrors;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  errors,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
      return;
    }

    if (!isRendered) return;

    setIsClosing(true);
    const timer = window.setTimeout(() => {
      setIsRendered(false);
      setIsClosing(false);
    }, TASK_MODAL_EXIT_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, [isOpen, isRendered]);

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    );
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    const saved = await onSave({
      ...task,
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    if (saved) {
      onClose();
    }
  };

  if (!isRendered) return null;

  return (
    <div className={`modal-root ${isClosing ? "is-closing" : "is-open"}`}>
      <div className="modal-overlay" onClick={onClose} aria-hidden={!isOpen} />
      <div className="modal-container">
        <TaskModalHeader onClose={onClose} />

        <form onSubmit={handleSubmit} className="modal-form">
          <TaskModalFormFields
            title={title}
            description={description}
            priority={priority}
            dueDate={dueDate}
            titleError={errors.title}
            descriptionError={errors.description}
            priorityError={errors.priority}
            dueDateError={errors.dueDate}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onPriorityChange={setPriority}
            onDueDateChange={setDueDate}
          />
          <TaskModalActions onClose={onClose} />
        </form>
      </div>
    </div>
  );
};
