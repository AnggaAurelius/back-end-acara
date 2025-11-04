import { Router } from "express";
import { auth } from "../lib/auth";
import ResponseUtil from "../utils/response";
import { toNodeHandler } from "better-auth/node";

const router = Router();

// Custom auth endpoints for additional functionality (define these BEFORE the wildcard)
router.get("/me", async (req, res) => {
  /**
   * #swagger.tags = ['Better-Auth']
   * #swagger.summary = 'Get current user session'
   * #swagger.description = 'Retrieve the current authenticated user session'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
    
    if (!session) {
      return ResponseUtil.unauthorized(res, "No active session");
    }
    
    return ResponseUtil.success(res, 200, "Session retrieved", {
      user: session.user,
      session: session.session,
    });
  } catch (error) {
    console.error("Session retrieval error:", error);
    return ResponseUtil.error(res, 500, "Failed to retrieve session");
  }
});

// Health check for auth system
router.get("/health", (_req, res) => {
  /**
   * #swagger.tags = ['Better-Auth']
   * #swagger.summary = 'Auth system health check'
   * #swagger.description = 'Check if the authentication system is working'
   */
  return ResponseUtil.success(res, 200, "Better-Auth is running", {
    timestamp: new Date().toISOString(),
    endpoints: [
      "/api/auth/sign-up/email",
      "/api/auth/sign-in/email", 
      "/api/auth/sign-out",
      "/api/auth/verify-email",
      "/api/auth/reset-password",
      "/api/auth/me",
    ],
  });
});

// Better-auth handles all other auth endpoints automatically
// This route will handle: /api/auth/sign-up, /api/auth/sign-in, /api/auth/sign-out, etc.
// IMPORTANT: This must be AFTER custom routes to avoid conflicts
// Use the Node.js adapter for proper Express integration
router.use("/*", toNodeHandler(auth));

export default router;
