import React from "react";
import { AppHeaderSection } from "../AppSections/AppHeaderSection";
import { TaskCreationSection } from "../AppSections/TaskCreationSection";
import { TaskListSection } from "../AppSections/TaskListSection";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { TaskModal } from "../TaskModal/TaskModal";
import { Toast } from "../Toast/Toast";
import { useTaskApp } from "../../context/TaskAppContext";

export const AppContent: React.FC = () => {
  const {
    isDarkMode,
    toggleTheme,
    stats,
    addTask,
    createTaskErrors,
    displayedTasks,
    isInitialTasksLoading,
    filters,
    sortBy,
    setFilters,
    setSortBy,
    toggleTask,
    confirmDeleteTask,
    openEditTask,
    reorderTasks,
    editingTask,
    closeTaskModal,
    updateTask,
    editTaskErrors,
    deletingTaskId,
    closeConfirmModal,
    deleteTask,
    toastMessage,
    closeToast,
  } = useTaskApp();

  return (
    <div className="app-container">
      <AppHeaderSection
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        stats={stats}
      />

      <main className="app-main">
        <TaskCreationSection
          onAddTask={addTask}
          createTaskErrors={createTaskErrors}
        />

        <TaskListSection
          tasks={displayedTasks}
          isInitialLoading={isInitialTasksLoading}
          filters={filters}
          sortBy={sortBy}
          onFilterChange={setFilters}
          onSortChange={setSortBy}
          onToggleTask={toggleTask}
          onDeleteTask={confirmDeleteTask}
          onEditTask={openEditTask}
          onReorderTasks={reorderTasks}
        />
      </main>

      <TaskModal
        isOpen={!!editingTask}
        onClose={closeTaskModal}
        task={editingTask}
        onSave={updateTask}
        errors={editTaskErrors}
      />

      <ConfirmModal
        isOpen={deletingTaskId !== null}
        onClose={closeConfirmModal}
        onConfirm={deleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />

      {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}
    </div>
  );
};
