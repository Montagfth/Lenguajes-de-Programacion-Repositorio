// Interface para respuestas exitosas del API
export interface SuccessResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
}

// Interface para respuestas de error del API
export interface ErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

