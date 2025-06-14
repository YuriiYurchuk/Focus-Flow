import { z } from "zod";

const TaskPriorityEnum = z.enum(["low", "medium", "high"]);

export const taskSchema = z.object({
  title: z.string().min(1, "Назва обов'язкова").max(100, "Занадто довга назва"),
  description: z.string().optional(),
  priority: TaskPriorityEnum.default("medium"),
  deadline: z
    .preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    )
    .refine(
      (date) => !date || !isNaN(date.getTime()),
      "Некоректна дата дедлайну"
    ),
});
