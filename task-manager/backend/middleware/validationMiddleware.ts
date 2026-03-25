import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { getFieldFromValidationArray } from "../helpers/getFieldFromValidationArray";

export function validationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((e) => ({
      field: getFieldFromValidationArray(e),
      msg: e.msg,
    }));

    return res.status(400).json({ msg: "Validation failed", errors });
  }

  next();
}
