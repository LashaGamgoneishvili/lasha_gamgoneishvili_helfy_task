import React, { useEffect, useMemo, useState } from "react";
import type { TaskFormErrors } from "../../types/FormErrors";
import type { Task, TaskPriority } from "../../types/Tasks";
import { normalizeTaskInput, validateTaskInput } from "../../utils/taskValidation";
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
  const [clientErrors, setClientErrors] = useState<TaskFormErrors>({});

  const mergedErrors = useMemo(
    () => ({ ...errors, ...clientErrors }),
    [errors, clientErrors],
  );

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
    if (!task) {
      setClientErrors({});
      return;
    }

    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    );
    setClientErrors({});
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

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

    const saved = await onSave({
      ...task,
      title: normalized.title,
      description: normalized.description,
      priority: normalized.priority as TaskPriority,
      dueDate: normalized.dueDate ? new Date(normalized.dueDate) : undefined,
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
            titleError={mergedErrors.title}
            descriptionError={mergedErrors.description}
            priorityError={mergedErrors.priority}
            dueDateError={mergedErrors.dueDate}
            onTitleChange={(value) => {
              setTitle(value);
              setClientErrors((prev) => ({ ...prev, title: undefined }));
            }}
            onDescriptionChange={(value) => {
              setDescription(value);
              setClientErrors((prev) => ({ ...prev, description: undefined }));
            }}
            onPriorityChange={(value) => {
              setPriority(value);
              setClientErrors((prev) => ({ ...prev, priority: undefined }));
            }}
            onDueDateChange={(value) => {
              setDueDate(value);
              setClientErrors((prev) => ({ ...prev, dueDate: undefined }));
            }}
          />
          <TaskModalActions onClose={onClose} />
        </form>
      </div>
    </div>
  );
};
