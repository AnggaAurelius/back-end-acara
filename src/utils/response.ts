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
}

export default ResponseUtil;
