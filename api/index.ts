// Vercel serverless entry point
// Note: In ES modules, you MUST include .js extension in imports
// TypeScript files compile to .js, so we import .js even though source is .ts

import app from "../src/index.js";

// Export as default for Vercel serverless
export default app;
