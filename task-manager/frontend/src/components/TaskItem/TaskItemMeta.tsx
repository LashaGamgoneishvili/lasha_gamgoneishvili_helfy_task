import React from "react";
import type { Task } from "../../types";

interface TaskItemMetaProps {
  task: Task;
  priorityClassName: string;
}

export const TaskItemMeta: React.FC<TaskItemMetaProps> = ({
  task,
  priorityClassName,
}) => (
  <div className="task-meta">
    <span className={`priority-badge ${priorityClassName}`}>{task.priority}</span>
    {task.dueDate && (
      <span className="due-date">
        {new Date(task.dueDate).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}
      </span>
    )}
  </div>
);
