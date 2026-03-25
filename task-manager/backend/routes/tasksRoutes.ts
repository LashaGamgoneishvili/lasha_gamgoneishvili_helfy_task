import express from "express";
import {
  createNewTask,
  deleteTask,
  getAllTasks,
  toggleTaskStatus,
  updateTask,
} from "../controllers/tasksController";
import {
  createNewTaskValidator,
  deleteTaskValidator,
  toggleTaskStatusValidator,
  updateTaskValidator,
} from "../validators/tasksValidators";
import { validationMiddleware } from "../middleware/validationMiddleware";

const router = express.Router();

router.get("/", getAllTasks);
router.post("/", createNewTaskValidator, validationMiddleware, createNewTask);
router.put("/:id", updateTaskValidator, validationMiddleware, updateTask);
router.delete("/:id", deleteTaskValidator, validationMiddleware, deleteTask);
router.patch(
  "/:id/toggle",
  toggleTaskStatusValidator,
  validationMiddleware,
  toggleTaskStatus,
);

export default router;
