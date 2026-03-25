import React from "react";
import type { Task } from "../../types";
import { TaskItem } from "../TaskItem/TaskItem";

interface TaskSliderViewportProps {
  currentTask: Task;
  leavingTask: Task | null;
  leavingIndex: number | null;
  currentIndex: number;
  direction: 1 | -1;
  isAnimating: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export const TaskSliderViewport: React.FC<TaskSliderViewportProps> = ({
  currentTask,
  leavingTask,
  leavingIndex,
  currentIndex,
  direction,
  isAnimating,
  onToggle,
  onDelete,
  onEdit,
}) => (
  <div className="slider-viewport">
    {leavingTask && (
      <div
        key={`leaving-${leavingTask.id}-${leavingIndex}-${currentIndex}`}
        className={`slider-item-wrapper slider-item-leaving ${
          direction > 0 ? "slide-exit-left" : "slide-exit-right"
        }`}
        aria-hidden="true"
      >
        <TaskItem
          task={leavingTask}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          showDragHandle={false}
        />
      </div>
    )}

    <div
      key={`current-${currentTask.id}-${currentIndex}-${direction}-${isAnimating}`}
      className={`slider-item-wrapper slider-item-current ${
        isAnimating
          ? direction > 0
            ? "slide-enter-right"
            : "slide-enter-left"
          : "slide-still"
      }`}
    >
      <TaskItem
        task={currentTask}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        showDragHandle={false}
      />
    </div>
  </div>
);
