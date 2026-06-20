import express from "express";
import betterAuthRoutes from "./auth.routes.js";

const router = express.Router();

// Better-Auth routes (new authentication system)
router.use("/auth", betterAuthRoutes);

export default router;
