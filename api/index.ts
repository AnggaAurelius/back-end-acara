// Vercel serverless entry point
// Dynamic import to handle both TypeScript compilation and ES modules

export default async function handler(req: any, res: any) {
  try {
    // Try to import the compiled app
    // Vercel compiles TypeScript files and places them in the output
    let app;

    try {
      // Try loading from dist (if pre-compiled)
      const distModule = await import("../dist/index.js");
      app = distModule.default;
    } catch {
      // Fall back to loading from src (Vercel will compile on-the-fly)
      const srcModule = await import("../src/index.js");
      app = srcModule.default;
    }

    if (!app) {
      throw new Error("Failed to load Express app");
    }

    // Forward request to Express
    return app(req, res);
  } catch (error: any) {
    console.error("❌ Serverless function error:", error);

    return res.status(500).json({
      success: false,
      error: "Server initialization failed",
      message: error?.message || "Unknown error",
      stack: process.env.NODE_ENV === "production" ? undefined : error?.stack,
      details: {
        cwd: process.cwd(),
        nodeVersion: process.version,
        platform: process.platform,
      },
    });
  }
}
