// AI-AGENT CONTEXT: FILE=apiClient | ROLE=API_Communication_Layer | PURPOSE=HTTP_Requests_Error_Handling_Type_Safety
// AI-DEPENDENCY: axios,types.ApiError
// AI-SECURITY: XSS_PREVENTION,INPUT_VALIDATION,ERROR_SANITIZATION
import axios, { AxiosResponse, AxiosError } from "axios";
import { ApiError } from "../types";

// AI-LOGICAL-REGION: Type_Definitions
type HttpMethod = "get" | "post" | "put" | "delete";
type LoadingSetter = (loading: boolean) => void;
type ErrorSetter = (error: ApiError | null) => void;

const methodMap: Record<HttpMethod, typeof axios.get> = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

// AI-LOGICAL-REGION: Generic_API_Function
export async function fetchSomething<T>(
  method: HttpMethod,
  url: string,
  setLoading?: LoadingSetter,
  setError?: ErrorSetter,
  data?: unknown
): Promise<AxiosResponse<T> | null> {
  try {
    setLoading?.(true);
    setError?.(null);

    // AI-SECURITY: URL_VALIDATION
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL provided");
    }

    let response: AxiosResponse<T>;
    const fn = methodMap[method];
    if (!fn) {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }
    if (method === "get" || method === "delete") {
      response = await fn<T>(url);
    } else {
      response = await fn<T>(url, data);
    }

    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    // AI-SECURITY: ERROR_SANITIZATION - Never expose sensitive error details
    const apiError: ApiError = {
      message: axiosError.message || "An unknown error occurred",
      code: axiosError.code,
      // AI-SECURITY: SANITIZE - Remove potentially sensitive response data
      details: axiosError.response?.status
        ? { status: axiosError.response.status }
        : undefined,
    };
    setError?.(apiError);
    return null;
  } finally {
    setLoading?.(false);
  }
}

// AI-NAVIGATION: EXPORT=fetchSomething
