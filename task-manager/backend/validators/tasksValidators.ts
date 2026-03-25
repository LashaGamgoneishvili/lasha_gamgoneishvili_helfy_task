import { body, param, query, ValidationChain } from "express-validator";

const searchValidator: ValidationChain = param("search")
  .optional()
  .trim()
  .isString()
  .withMessage("search must be a string!");

const completedQueryValidator: ValidationChain = query("completed")
  .optional()
  .isBoolean()
  .withMessage("completed must a boolean value!")
  .toBoolean();

const priorityQueryValidator: ValidationChain = query("priority")
  .optional()
  .isIn(["low", "medium", "high"])
  .withMessage("priority must be one of: low, medium, high!");

const createdAtFromQueryValidator: ValidationChain = query("createdAtFrom")
  .optional()
  .isISO8601()
  .withMessage("createdAtFrom must be a valid ISO date!")
  .toDate();

const createdAtToQueryValidator: ValidationChain = query("createdAtTo")
  .optional()
  .isISO8601()
  .withMessage("createdAtTo must be a valid ISO date!")
  .toDate();

const sortByQueryValidator: ValidationChain = query("sortBy")
  .optional()
  .isIn(["id", "title", "createdAt", "priority"])
  .withMessage("sortBy must be one of: id, title, createdAt, priority!");

const sortOrderQueryValidator: ValidationChain = query("sortOrder")
  .optional()
  .isIn(["asc", "desc"])
  .withMessage("sortOrder must be asc or desc!");

const idValidator: ValidationChain = param("id")
  .trim()
  .isInt({ min: 1 })
  .withMessage("id must be a positive integer!");

const titleValidator: ValidationChain = body("title")
  .trim()
  .notEmpty()
  .withMessage("title is required!")
  .isLength({ max: 50 })
  .withMessage("title can not contain more than 50 characters!");

const descriptionValidator: ValidationChain = body("description")
  .trim()
  .notEmpty()
  .withMessage("description is required!")
  .isLength({ max: 200 })
  .withMessage("description can not contain more than 200 characters!");

const priorityValidator: ValidationChain = body("priority")
  .trim()
  .notEmpty()
  .withMessage("priority is required")
  .isIn(["low", "medium", "high"])
  .withMessage("priority can only be one of: low , medium , high!");

const completedValidator: ValidationChain = body("completed")
  .trim()
  .notEmpty()
  .withMessage("completed is required!")
  .isBoolean()
  .withMessage("completed must be a boolean value!");

export const getAllTasksValidator: ValidationChain[] = [
  searchValidator,
  completedQueryValidator,
  priorityQueryValidator,
  createdAtFromQueryValidator,
  createdAtToQueryValidator,
  sortByQueryValidator,
  sortOrderQueryValidator,
];

export const createNewTaskValidator: ValidationChain[] = [
  titleValidator,
  descriptionValidator,
  priorityValidator,
];

export const updateTaskValidator: ValidationChain[] = [
  idValidator,
  titleValidator,
  descriptionValidator,
  priorityValidator,
];

export const deleteTaskValidator: ValidationChain[] = [idValidator];

export const toggleTaskStatusValidator: ValidationChain[] = [
  idValidator,
  completedValidator,
];
