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

export default betterAuthMiddleware;
