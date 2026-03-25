import { Request, Response } from "express";
import { Task } from "../types/Tasks";
import { randomInt } from "crypto";

const tasks: Task[] = [];

export const getAllTasks = async (_req: Request, res: Response) => {
  return res.status(200).json(tasks);
};

export const createNewTask = async (req: Request, res: Response) => {
  const { title, description, priority } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ msg: "Insufficient parameters!" });
  }

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
  if (isNaN(Number(id))) {
    return res.status(400).json({ msg: "Invalid id format!" });
  }

  const { title, description, priority } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ msg: "Insufficient parameters!" });
  }

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
  if (isNaN(Number(id))) {
    return res.status(400).json({ msg: "Invalid id format!" });
  }

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    if (task.id === Number(id)) {
      tasks.splice(i, 1);
      break;
    }

    if (i === tasks.length - 1) {
      return res.status(404).json({ msg: "Task not found!" });
    }
  }

  return res.status(204).send();
};

export const toggleTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ msg: "Invalid id format!" });
  }

  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    return res.status(400).json({ msg: "Status must be a boolean value!" });
  }

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
