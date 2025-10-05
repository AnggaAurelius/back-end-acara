import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import cors from "cors";

import connectDatabases from "./lib/database";
import docs from "./docs/route";
import ResponseUtil from "./utils/response";
const PORT = 3000;

async function init() {
  try {
    // Initialize both database connections (Mongoose + MongoDB client)
    const result = await connectDatabases();
    console.log("✅", result);

    const app = express();

    // CORS configuration
    app.use(cors({
      origin: [
        process.env.CLIENT_HOST || "http://localhost:3001",
        process.env.BETTER_AUTH_URL || "http://localhost:3000"
      ],
      credentials: true, // Important for better-auth cookies
    }));

    app.use(bodyParser.json());

    // Health check endpoint
    app.get("/", (req, res) => {
      ResponseUtil.success(res, 200, "Server is running");
    });

    // Documentation routes
    docs(app);

    // Your API routes (includes better-auth routes)
    app.use("/api", router);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
    });
  } catch (error) {
    console.error("❌ Server initialization failed:", error);
    process.exit(1);
  }
}

init();
