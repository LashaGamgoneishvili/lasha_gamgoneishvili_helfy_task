import type { Task } from "../types";

export const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: "Design System Refactor",
    description:
      "Move from Tailwind to pure CSS modules for better control and performance.",
    completed: false,
    priority: "high",
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 86400000 * 2),
  },
  {
    id: 2,
    title: "Implement Infinite Slider",
    description:
      "Create a slick carousel using only React hooks and CSS transitions.",
    completed: true,
    priority: "medium",
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 86400000),
  },
  {
    id: 3,
    title: "SVG Icon Library",
    description:
      "Build a custom set of SVG icons to remove dependency on Lucide.",
    completed: false,
    priority: "low",
    createdAt: new Date(),
  },
  {
    id: 4,
    title: "Performance Audit",
    description: "Check bundle size and optimize React component re-renders.",
    completed: false,
    priority: "high",
    createdAt: new Date(),
    dueDate: new Date(),
  },
];
