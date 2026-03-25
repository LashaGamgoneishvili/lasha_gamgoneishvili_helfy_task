import { ValidationError } from "express-validator";

export function getFieldFromValidationArray(e: ValidationError): string {
  if ("path" in e && typeof e.path === "string") return e.path;

  if (
    "nestedErrors" in e &&
    Array.isArray(e.nestedErrors) &&
    e.nestedErrors.length
  ) {
    const first = e.nestedErrors[0] as { path: string };
    if (first?.path) return String(first.path);
  }

  if ("fields" in e && Array.isArray(e.fields) && e.fields.length) {
    return String(e.fields[0]);
  }

  return "unknown";
}
