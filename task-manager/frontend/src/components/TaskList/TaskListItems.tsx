import React from "react";
import { TaskItem } from "../TaskItem/TaskItem";
import type { Task } from "../../types";

interface TaskListItemsProps {
  tasks: Task[];
  draggedItemId: number | null;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragOver: (e: React.DragEvent, id: number) => void;
  onDragEnd: () => void;
}

export const TaskListItems: React.FC<TaskListItemsProps> = ({
  tasks,
  draggedItemId,
  onToggle,
  onDelete,
  onEdit,
  onDragStart,
  onDragOver,
  onDragEnd,
}) => (
  <>
    {tasks.map((task) => (
      <TaskItem
        key={task.id}
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        isDragging={task.id === draggedItemId}
      />
    ))}
  </>
);
