// AI-AGENT CONTEXT: FILE=config | ROLE=Environment_Configuration | PURPOSE=API_Endpoints_Environment_Switching
// AI-SECURITY: ENVIRONMENT_ISOLATION,URL_VALIDATION

// AI-LOGICAL-REGION: Type_Definitions
type Environment = "production" | "development";
type ApiEndpoint = string;

// AI-LOGICAL-REGION: Environment_Detection
export const ENV: Environment =
  import.meta.env.MODE === "production" ? "production" : "development";

// AI-LOGICAL-REGION: API_Configuration
// AI-SECURITY: TRUSTED_ENDPOINTS - Base URL sourced from environment
export const API_BASE_URL: ApiEndpoint = import.meta.env.VITE_API_BASE_URL;

// AI-LOGICAL-REGION: Endpoint_Definitions
export const PROJECTS_ENDPOINT: ApiEndpoint = "/api/projects";
export const CERTIFICATES_ENDPOINT: ApiEndpoint = "/api/certificates";

// AI-NAVIGATION: EXPORT=ENV,API_BASE_URL,PROJECTS_ENDPOINT,CERTIFICATES_ENDPOINT

export function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // Remove leading slash if present
  const cleanPath = path.replace(/^\/?/, "");
  return `${API_BASE_URL}/images/${cleanPath}`;
}
