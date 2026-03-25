import React from "react";
import { TaskForm } from "../TaskForm/TaskForm";
import type { TaskFormErrors } from "../../types/FormErrors";

type AddTaskHandler = React.ComponentProps<typeof TaskForm>["onAdd"];

interface TaskCreationSectionProps {
  onAddTask: AddTaskHandler;
  createTaskErrors: TaskFormErrors;
}

export const TaskCreationSection: React.FC<TaskCreationSectionProps> = ({
  onAddTask,
  createTaskErrors,
}) => (
  <section className="form-section">
    <h2>Create New Task</h2>
    <TaskForm onAdd={onAddTask} errors={createTaskErrors} />
  </section>
);
