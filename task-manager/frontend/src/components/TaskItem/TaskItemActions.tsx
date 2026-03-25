import React from "react";
import { EditIcon, TrashIcon } from "../Icons";
import type { Task } from "../../types";

interface TaskItemActionsProps {
  task: Task;
  iconSize: number;
  containerClassName: string;
  onDelete: (id: number) => void;
  onEdit?: (task: Task) => void;
}

export const TaskItemActions: React.FC<TaskItemActionsProps> = ({
  task,
  iconSize,
  containerClassName,
  onDelete,
  onEdit,
}) => (
  <div className={containerClassName}>
    <button className="edit-btn" onClick={() => onEdit?.(task)} title="Edit task">
      <EditIcon size={iconSize} />
    </button>
    <button className="delete-btn" onClick={() => onDelete(task.id)} title="Delete task">
      <TrashIcon size={iconSize} />
    </button>
  </div>
);
