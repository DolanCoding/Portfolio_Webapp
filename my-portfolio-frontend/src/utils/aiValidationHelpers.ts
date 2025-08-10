// AI-AGENT CONTEXT: FILE=aiValidationHelpers | ROLE=Runtime_Validation_Utils | PURPOSE=Validate_API_Data_with_Runtime_Checks_and_Caching
// AI-DEPENDENCY: shared-types

import type { Certificate, Project } from "../../../shared-types";

// AI-LOGICAL-REGION: Type_Guards
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateCertificate(input: unknown): input is Certificate {
  if (!isRecord(input)) return false;
  const requiredString = (k: string) => typeof input[k] === "string";
  // Required keys
  if (!requiredString("id")) return false;
  if (!requiredString("title")) return false;
  if (!requiredString("type")) return false;
  if (!requiredString("date")) return false;
  // Optional keys
  const optionalKeys = ["issuer", "image", "link", "description", "skills"];
  for (const k of optionalKeys) {
    if (k in input && typeof input[k] !== "string") return false;
  }
  return true;
}

export function validateProject(input: unknown): input is Project {
  if (!isRecord(input)) return false;
  const requiredString = (k: string) => typeof input[k] === "string";
  const requiredNumber = (k: string) => typeof input[k] === "number";
  const reqStrings = [
    "id",
    "title",
    "description",
    "image",
    "github_link",
    "live_link",
    "tags",
    "starting_date",
    "finished_date",
    "reason",
    "learned_things",
    "key_features",
    "notes",
  ];
  for (const k of reqStrings) if (!requiredString(k)) return false;
  const reqNumbers = ["timespan", "hours_per_day"];
  for (const k of reqNumbers) if (!requiredNumber(k)) return false;
  if ("image2" in input && typeof input["image2"] !== "string") return false;
  if ("image3" in input && typeof input["image3"] !== "string") return false;
  return true;
}

// AI-LOGICAL-REGION: Generic_Response_Validator
export type Validator = (value: unknown) => boolean;

// Generic array response validator using an item-level validator
export function validateApiResponse<T = unknown>(
  data: unknown,
  itemValidator: Validator
): data is T[] {
  if (!Array.isArray(data)) return false;
  for (const item of data) {
    if (!itemValidator(item)) return false;
  }
  return true;
}

// AI-LOGICAL-REGION: Memoized_Validation
const validationCache = new Map<string, boolean>();

export function memoizedValidation(
  data: unknown,
  validator: (data: unknown) => boolean,
  cacheKey: string
): boolean {
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)!;
  }
  const result = validator(data);
  validationCache.set(cacheKey, result);
  return result;
}

// AI-LOGICAL-REGION: Debug_Logging
export function debugLogValidation(
  data: unknown,
  // accepts any validator signature used above
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validator: (...args: any[]) => unknown,
  label = "Validation"
): void {
  // Guarded debug logging to avoid noisy consoles in production
  if (typeof console !== "undefined" && typeof console.debug === "function") {
    try {
      console.debug(`[${label}]`, {
        sample: Array.isArray(data) ? data.slice(0, 1) : data,
        validator: validator.name || "anonymous",
      });
    } catch {
      // no-op
    }
  }
}

// AI-NAVIGATION: EXPORT=isRecord,validateCertificate,validateProject,validateApiResponse,memoizedValidation,debugLogValidation
