import React from "react";
import { TaskFilters } from "../TaskFilters/TaskFilters";
import type { FilterState, SortOption } from "../TaskFilters/TaskFilters";
import { TaskList } from "../TaskList/TaskList";
import { TaskSlider } from "../TaskSlider/TaskSlider";
import type { Task } from "../../types";

interface TaskListSectionProps {
  tasks: Task[];
  isInitialLoading: boolean;
  filters: FilterState;
  sortBy: SortOption;
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (task: Task) => void;
  onReorderTasks: (newTasks: Task[]) => void;
}

const TaskResultsHeader: React.FC<{ taskCount: number }> = ({ taskCount }) => (
  <div className="section-header">
    <h2>Your Tasks</h2>
    <span className="task-count">{taskCount} tasks found</span>
  </div>
);

const TaskCarouselView: React.FC<{
  tasks: Task[];
  isInitialLoading: boolean;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (task: Task) => void;
}> = ({ tasks, isInitialLoading, onToggleTask, onDeleteTask, onEditTask }) => {
  if (isInitialLoading) {
    return (
      <div className="empty-state">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="carousel-view">
      <TaskSlider
        tasks={tasks}
        onToggle={onToggleTask}
        onDelete={onDeleteTask}
        onEdit={onEditTask}
      />
    </div>
  );
};

const TaskBackupList: React.FC<{
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (task: Task) => void;
  onReorderTasks: (newTasks: Task[]) => void;
}> = ({ tasks, onToggleTask, onDeleteTask, onEditTask, onReorderTasks }) => (
  <div className="list-view-toggle">
    <h3>List View (Backup)</h3>
    <TaskList
      tasks={tasks}
      onToggle={onToggleTask}
      onDelete={onDeleteTask}
      onEdit={onEditTask}
      onReorder={onReorderTasks}
    />
  </div>
);

export const TaskListSection: React.FC<TaskListSectionProps> = ({
  tasks,
  isInitialLoading,
  filters,
  sortBy,
  onFilterChange,
  onSortChange,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onReorderTasks,
}) => (
  <section className="list-section">
    <TaskResultsHeader taskCount={tasks.length} />

    <TaskFilters
      filters={filters}
      onFilterChange={onFilterChange}
      sortBy={sortBy}
      onSortChange={onSortChange}
    />

    <TaskCarouselView
      tasks={tasks}
      isInitialLoading={isInitialLoading}
      onToggleTask={onToggleTask}
      onDeleteTask={onDeleteTask}
      onEditTask={onEditTask}
    />

    <TaskBackupList
      tasks={tasks}
      onToggleTask={onToggleTask}
      onDeleteTask={onDeleteTask}
      onEditTask={onEditTask}
      onReorderTasks={onReorderTasks}
    />
  </section>
);
