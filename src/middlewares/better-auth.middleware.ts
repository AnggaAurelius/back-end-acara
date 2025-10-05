import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import ResponseUtil from "../utils/response";

// Extend Express Request type to include user and session
declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

/**
 * Better-Auth middleware for protecting routes
 * Replaces the old JWT-based auth middleware
 */
export const betterAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
    
    if (!session) {
      return ResponseUtil.unauthorized(res, "Authentication required");
    }
    
    // Attach user and session to request object
    req.user = session.user;
    req.session = session.session;
    
    next();
  } catch (error) {
    console.error("Better-Auth middleware error:", error);
    return ResponseUtil.unauthorized(res, "Invalid session");
  }
};

/**
 * Role-based access control middleware
 * Requires betterAuthMiddleware to be used first
 */
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ResponseUtil.unauthorized(res, "Authentication required");
    }
    
    if (req.user.role !== role) {
      return ResponseUtil.forbidden(res, "Insufficient permissions");
    }
    
    next();
  };
};

/**
 * Admin-only access middleware
 */
export const requireAdmin = requireRole("admin");

/**
 * Active user middleware - ensures user account is active
 */
export const requireActiveUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return ResponseUtil.unauthorized(res, "Authentication required");
  }
  
  if (!req.user.isActive) {
    return ResponseUtil.forbidden(res, "Account not activated. Please verify your email.");
  }
  
  next();
};

/**
 * Combined middleware for authenticated and active users
 */
export const requireAuthenticatedActiveUser = [
  betterAuthMiddleware,
  requireActiveUser,
];

/**
 * Combined middleware for admin users
 */
export const requireAuthenticatedAdmin = [
  betterAuthMiddleware,
  requireActiveUser,
  requireAdmin,
];

export default betterAuthMiddleware;
