import { Request, Response } from "express";
import { GetAllTasksInput, Task } from "../types/Tasks";
import { randomInt } from "crypto";
import { fuzzySearch } from "../helpers/fuzzySearch";
import { matchedData } from "express-validator";
import { filterTasks } from "../helpers/taskFilter";
import { sortTasks } from "../helpers/taskSort";

const tasks: Task[] = [];

export const getAllTasks = async (req: Request, res: Response) => {
  const data = matchedData(req, {
    locations: ["params", "query"],
    includeOptionals: true,
  }) as GetAllTasksInput;

  let result = data.search
    ? fuzzySearch(tasks, data.search, {
        extractor: (task) => [task.title, task.description, task.priority],
        threshold: 0.35,
        limit: tasks.length,
      }).map((x) => x.item)
    : [...tasks];

  result = filterTasks(result, {
    completed: data.completed,
    priority: data.priority,
    createdAtFrom: data.createdAtFrom,
    createdAtTo: data.createdAtTo,
    dueDateFrom: data.dueDateFrom,
    dueDateTo: data.dueDateTo,
  });

  result = sortTasks(result, {
    sortBy: data.sortBy,
    sortOrder: data.sortOrder,
  });

  return res.status(200).json(result);
};

export const createNewTask = async (req: Request, res: Response) => {
  const { title, description, priority, dueDate } = req.body;

  const newTask: Task = {
    id: randomInt(100000000000),
    title,
    description,
    priority,
    createdAt: new Date(),
    dueDate,
    completed: false,
  };

  tasks.push(newTask);

  return res.status(201).json(newTask);
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { title, description, priority, dueDate } = req.body;

  const oldTaskIndex = tasks.findIndex((t) => t.id === Number(id));

  if (oldTaskIndex === -1) {
    return res.status(404).json({ msg: "Task not found!" });
  }

  const newTask = {
    ...tasks[oldTaskIndex],
    title,
    description,
    priority,
    dueDate,
  };

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
