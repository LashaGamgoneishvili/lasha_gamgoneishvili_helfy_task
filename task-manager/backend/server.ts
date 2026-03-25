import express, { Request, Response } from "express";
import tasksRouter from "./routes/tasksRoutes";

const port = 4000;

const app = express();

app.use(express.json());

app.use("/health", async (_req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
  });
});

app.use("/api/tasks", tasksRouter);

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
