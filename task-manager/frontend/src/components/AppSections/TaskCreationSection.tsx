import React from "react";
import { TaskForm } from "../TaskForm/TaskForm";

type AddTaskHandler = React.ComponentProps<typeof TaskForm>["onAdd"];

interface TaskCreationSectionProps {
  onAddTask: AddTaskHandler;
}

export const TaskCreationSection: React.FC<TaskCreationSectionProps> = ({
  onAddTask,
}) => (
  <section className="form-section">
    <h2>Create New Task</h2>
    <TaskForm onAdd={onAddTask} />
  </section>
);
