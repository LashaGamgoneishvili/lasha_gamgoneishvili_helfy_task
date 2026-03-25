import express from "express";
import {
  createNewTask,
  deleteTask,
  getAllTasks,
  toggleTaskStatus,
  updateTask,
} from "../controllers/tasksController";

const router = express.Router();

router.get("/", getAllTasks);
router.post("/", createNewTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleTaskStatus);

export default router;
