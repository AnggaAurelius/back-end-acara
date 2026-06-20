// Vercel serverless entry point
// Note: Vercel uses Node.js runtime, not Bun
// This file imports your Express app and exports it for Vercel

import app from "../src/index";

// Export as default for Vercel serverless
export default app;
