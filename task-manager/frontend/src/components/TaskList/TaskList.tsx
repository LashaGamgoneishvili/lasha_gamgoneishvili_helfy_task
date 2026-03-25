import React, { useState } from "react";
import type { Task } from "../../types/Tasks";
import { TaskListEmptyState } from "./TaskListEmptyState";
import { TaskListItems } from "./TaskListItems";
import "./TaskList.css";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onReorder: (newTasks: Task[]) => void;
}

const reorderTasks = (
  tasks: Task[],
  draggedItemId: number,
  overItemId: number,
): Task[] => {
  const draggedItemIndex = tasks.findIndex((task) => task.id === draggedItemId);
  const overItemIndex = tasks.findIndex((task) => task.id === overItemId);

  if (draggedItemIndex === -1 || overItemIndex === -1) {
    return tasks;
  }

  const reorderedTasks = [...tasks];
  const [draggedTask] = reorderedTasks.splice(draggedItemIndex, 1);
  reorderedTasks.splice(overItemIndex, 0, draggedTask);
  return reorderedTasks;
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
}) => {
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, overItemId: number) => {
    e.preventDefault();
    if (draggedItemId === null || draggedItemId === overItemId) return;

    onReorder(reorderTasks(tasks, draggedItemId, overItemId));
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
  };

  if (tasks.length === 0) {
    return <TaskListEmptyState />;
  }

  return (
    <div className="task-list">
      <TaskListItems
        tasks={tasks}
        draggedItemId={draggedItemId}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
};
