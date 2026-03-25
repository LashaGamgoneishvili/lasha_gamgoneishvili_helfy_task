import { body, param, ValidationChain } from "express-validator";

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
  .withMessage("priority can only be one of: low , medium , high");

const completedValidator: ValidationChain = body("completed")
  .trim()
  .notEmpty()
  .withMessage("completed is required!")
  .isBoolean()
  .withMessage("completed must be a boolean value!");

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
