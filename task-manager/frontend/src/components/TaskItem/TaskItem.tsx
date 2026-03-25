import React from "react";
import { CheckIcon, CircleIcon } from "../Icons";
import type { Task } from "../../types/Tasks";
import { TaskDragHandle } from "./TaskDragHandle";
import { TaskItemActions } from "./TaskItemActions";
import { TaskItemMeta } from "./TaskItemMeta";
import "./TaskItem.css";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (task: Task) => void;
  onDragStart?: (e: React.DragEvent, id: number) => void;
  onDragOver?: (e: React.DragEvent, id: number) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  showDragHandle?: boolean;
}

const TaskToggleButton: React.FC<{
  task: Task;
  onToggle: (id: number) => void;
}> = ({ task, onToggle }) => (
  <button className="toggle-btn" onClick={() => onToggle(task.id)}>
    {task.completed ? (
      <CheckIcon className="icon success" size={24} />
    ) : (
      <CircleIcon className="icon" size={24} />
    )}
  </button>
);

const TaskContent: React.FC<{
  task: Task;
  priorityClassName: string;
  onDelete: (id: number) => void;
  onEdit?: (task: Task) => void;
}> = ({ task, priorityClassName, onDelete, onEdit }) => (
  <div className="task-content">
    <div className="task-title-row">
      <h3 className="task-title">{task.title}</h3>
      <TaskItemActions
        task={task}
        iconSize={18}
        containerClassName="task-actions desktop-only"
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>

    <p className="task-description">{task.description}</p>

    <div className="task-footer">
      <TaskItemMeta task={task} priorityClassName={priorityClassName} />
      <TaskItemActions
        task={task}
        iconSize={16}
        containerClassName="task-actions mobile-only"
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>
  </div>
);

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  showDragHandle = true,
}) => {
  const priorityClassName = `priority-${task.priority.toLowerCase()}`;

  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""} ${priorityClassName} ${
        isDragging ? "dragging" : ""
      } ${!showDragHandle ? "no-drag" : ""}`}
      draggable={showDragHandle}
      onDragStart={(e) => showDragHandle && onDragStart?.(e, task.id)}
      onDragOver={(e) => showDragHandle && onDragOver?.(e, task.id)}
      onDragEnd={onDragEnd}
    >
      <div className="task-item-main">
        <div className="task-item-left">
          {showDragHandle && <TaskDragHandle />}
          <TaskToggleButton task={task} onToggle={onToggle} />
        </div>

        <TaskContent
          task={task}
          priorityClassName={priorityClassName}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
};
