import { Response } from "express";

/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

/**
 * Response utility class for standardizing API responses
 */
export class ResponseUtil {
  /**
   * Send a success response
   * @param res - Express Response object
   * @param statusCode - HTTP status code (default: 200)
   * @param message - Success message
   * @param data - Response data
   */
  static success<T>(
    res: Response,
    statusCode: number = 200,
    message: string,
    data: T | null = null
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send an error response
   * @param res - Express Response object
   * @param statusCode - HTTP status code (default: 400)
   * @param message - Error message
   * @param data - Additional error data (optional)
   */
  static error<T>(
    res: Response,
    statusCode: number = 400,
    message: string,
    data: T | null = null
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: false,
      message,
      data,
    });
  }

  /**
   * Send a validation error response (400 Bad Request)
   * @param res - Express Response object
   * @param message - Validation error message
   * @param data - Validation error details (optional)
   */
  static validationError<T>(
    res: Response,
    message: string,
    data: T | null = null
  ): Response<ApiResponse<T>> {
    return ResponseUtil.error(res, 400, message, data);
  }

  /**
   * Send an unauthorized error response (401 Unauthorized)
   * @param res - Express Response object
   * @param message - Unauthorized message (default: "Unauthorized")
   * @param data - Additional data (optional)
   */
  static unauthorized<T>(
    res: Response,
    message: string = "Unauthorized",
    data: T | null = null
  ): Response<ApiResponse<T>> {
    return ResponseUtil.error(res, 401, message, data);
  }

  /**
   * Send a forbidden error response (403 Forbidden)
   * @param res - Express Response object
   * @param message - Forbidden message (default: "Forbidden")
   * @param data - Additional data (optional)
   */
  static forbidden<T>(
    res: Response,
    message: string = "Forbidden",
    data: T | null = null
  ): Response<ApiResponse<T>> {
    return ResponseUtil.error(res, 403, message, data);
  }

  /**
   * Send a not found error response (404 Not Found)
   * @param res - Express Response object
   * @param message - Not found message (default: "Not Found")
   * @param data - Additional data (optional)
   */
  static notFound<T>(
    res: Response,
    message: string = "Not Found",
    data: T | null = null
  ): Response<ApiResponse<T>> {
    return ResponseUtil.error(res, 404, message, data);
  }

  /**
   * Send an internal server error response (500 Internal Server Error)
   * @param res - Express Response object
   * @param message - Error message (default: "Internal Server Error")
   * @param data - Additional error data (optional)
   */
  static internalError<T>(
    res: Response,
    message: string = "Internal Server Error",
    data: T | null = null
  ): Response<ApiResponse<T>> {
    return ResponseUtil.error(res, 500, message, data);
  }
}

/**
 * Convenience functions for common response patterns
 */

/**
 * Send a success response
 */
export const sendSuccess = ResponseUtil.success;

/**
 * Send an error response
 */
export const sendError = ResponseUtil.error;

/**
 * Send a validation error response
 */
export const sendValidationError = ResponseUtil.validationError;

/**
 * Send an unauthorized response
 */
export const sendUnauthorized = ResponseUtil.unauthorized;

/**
 * Send a forbidden response
 */
export const sendForbidden = ResponseUtil.forbidden;

/**
 * Send a not found response
 */
export const sendNotFound = ResponseUtil.notFound;

/**
 * Send an internal server error response
 */
export const sendInternalError = ResponseUtil.internalError;

export default ResponseUtil;
