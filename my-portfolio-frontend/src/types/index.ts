// AI-AGENT CONTEXT: FILE=types | ROLE=Type_Definitions_Hub | PURPOSE=Centralized_TypeScript_Interfaces_Error_Handling
// AI-API-CONTRACT: Project,Certificate,APIResponse,LoadingState,ApiError
// AI-LOGICAL-REGION: Branded_Types
declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { [__brand]: TBrand };

export type ProjectId = Brand<string, "ProjectId">;
export type CertificateId = Brand<string, "CertificateId">;

// Type guards for runtime validation
export const isProjectId = (id: string): id is ProjectId => {
  return typeof id === "string" && id.length > 0;
};

export const isCertificateId = (id: string): id is CertificateId => {
  return typeof id === "string" && id.length > 0;
};

// AI-LOGICAL-REGION: Core_Data_Interfaces
// AI-API-CONTRACT: PROJECT_SCHEMA
export interface Project {
  id: ProjectId;
  title: string;
  description: string;
  image: string;
  image2?: string;
  image3?: string;
  github_link: string;
  live_link: string;
  tags: string;
  starting_date: string;
  finished_date: string;
  timespan: number;
  hours_per_day: number;
  reason: string;
  learned_things: string;
  key_features: string;
  notes: string;
}

// AI-API-CONTRACT: CERTIFICATE_SCHEMA
export interface Certificate {
  id: CertificateId;
  title: string;
  type: string;
  date: string;
  issuer?: string;
  image?: string;
  link?: string;
  description?: string;
  skills?: string;
}

// AI-LOGICAL-REGION: Utility_Types
// AI-API-CONTRACT: RESPONSE_WRAPPER
export type APIResponse<T> = {
  data: T;
  status: "success" | "error";
  message?: string;
};

// AI-API-CONTRACT: LOADING_STATE_PATTERN
export type LoadingState<T> = {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
};

// AI-LOGICAL-REGION: Error_Handling_Types
// AI-API-CONTRACT: ERROR_SCHEMA
export interface ApiError {
  message?: string;
  code?: string;
  details?: Record<string, unknown>;
}

export function handleApiError(error: unknown): ApiError {
  const errorObj = error as Record<string, unknown>;
  return {
    message: String(errorObj?.message) || "Unknown error",
    code: typeof errorObj?.code === "string" ? errorObj.code : undefined,
    details:
      errorObj &&
      typeof errorObj === "object" &&
      "response" in errorObj &&
      errorObj.response &&
      typeof errorObj.response === "object" &&
      "data" in errorObj.response
        ? ((errorObj.response as { data?: unknown }).data as Record<
            string,
            unknown
          >)
        : undefined,
  };
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

// AI-LOGICAL-REGION: Application_Enums
export enum PageName {
  Home = "home",
  About = "about",
  Projects = "projects",
  Certificates = "certificates",
  Contact = "contact",
  NotFound = "notfound",
}

export enum Status {
  Success = "success",
  Error = "error",
  Loading = "loading",
}

// AI-NAVIGATION: EXPORT=ProjectId,CertificateId,Project,Certificate,APIResponse,LoadingState,ApiError,handleApiError,AppError,PageName,Status
