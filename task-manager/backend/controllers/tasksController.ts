import { Request, Response } from "express";
import { Task } from "../types/Tasks";
import { randomInt } from "crypto";

const tasks: Task[] = [];

export const getAllTasks = async (_req: Request, res: Response) => {
  return res.status(200).json(tasks);
};

export const createNewTask = async (req: Request, res: Response) => {
  const { title, description, priority } = req.body;

  const newTask: Task = {
    id: randomInt(100000000000),
    title,
    description,
    priority,
    createdAt: new Date(),
    completed: false,
  };

  tasks.push(newTask);

  return res.status(201).json(newTask);
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { title, description, priority } = req.body;

  const oldTaskIndex = tasks.findIndex((t) => t.id === Number(id));

  if (oldTaskIndex === -1) {
    return res.status(404).json({ msg: "Task not found!" });
  }

  const newTask = { ...tasks[oldTaskIndex], title, description, priority };

  tasks[oldTaskIndex] = newTask;

  return res.status(200).json(newTask);
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const index = tasks.findIndex((task) => task.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ msg: "Task not found!" });
  }

  tasks.splice(index, 1);

  return res.status(204).send();
};

export const toggleTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { completed } = req.body;

  const oldTaskIndex = tasks.findIndex((t) => t.id === Number(id));

  if (oldTaskIndex === -1) {
    return res.status(404).json({ msg: "Task not found!" });
  }

  if (tasks[oldTaskIndex].completed === completed) {
    return res.status(204).send();
  }

  const newTask = { ...tasks[oldTaskIndex], completed };

  tasks[oldTaskIndex] = newTask;

  return res.status(200).json(newTask);
};
