import rateLimit from "express-rate-limit";
import { IS_PRODUCTION } from "../utils/env";

/**
 * General API rate limiter
 * Applies to all API routes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: IS_PRODUCTION ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
    data: null,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for health check endpoints
  skip: (req) => {
    return req.path === "/" || req.path === "/health";
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks on login/signup
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: IS_PRODUCTION ? 5 : 50, // Limit each IP to 5 login attempts per windowMs in production
  message: {
    success: false,
    message:
      "Too many authentication attempts from this IP, please try again after 15 minutes.",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Only apply to specific auth endpoints
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Strict rate limiter for password reset
 * Prevents abuse of password reset functionality
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: IS_PRODUCTION ? 3 : 20, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message:
      "Too many password reset attempts from this IP, please try again after 1 hour.",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests
});

/**
 * Strict rate limiter for email verification
 * Prevents spam and abuse
 */
export const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: IS_PRODUCTION ? 5 : 30, // Limit each IP to 5 verification emails per hour
  message: {
    success: false,
    message:
      "Too many email verification requests from this IP, please try again after 1 hour.",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Lenient rate limiter for documentation endpoints
 */
export const docsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: IS_PRODUCTION ? 200 : 2000, // Higher limit for docs
  message: {
    success: false,
    message: "Too many requests, please try again later.",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
