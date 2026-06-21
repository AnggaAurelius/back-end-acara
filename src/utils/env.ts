import dotenv from "dotenv";
import { z } from "zod";

// Load .env file (only works locally, Vercel injects env vars directly)
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (url) => url.startsWith("mongodb://") || url.startsWith("mongodb+srv://"),
      "DATABASE_URL must be a valid MongoDB connection string",
    ),
  SECRET: z
    .string()
    .min(32, "SECRET must be at least 32 characters for security"),

  // Email Configuration
  EMAIL_SMTP_HOST: z.string().min(1, "EMAIL_SMTP_HOST is required"),
  EMAIL_SMTP_USER: z.string().email("EMAIL_SMTP_USER must be a valid email"),
  EMAIL_SMTP_PASS: z.string().min(1, "EMAIL_SMTP_PASS is required"),
  EMAIL_SMTP_PORT: z
    .string()
    .regex(/^\d+$/, "EMAIL_SMTP_PORT must be a number"),
  EMAIL_SMTP_SECURE: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  EMAIL_SMTP_SERVICE_NAME: z
    .string()
    .min(1, "EMAIL_SMTP_SERVICE_NAME is required"),

  // Better-Auth
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z
    .string()
    .min(1, "BETTER_AUTH_URL is required")
    .refine((url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }, "BETTER_AUTH_URL must be a valid URL"),
  BETTER_AUTH_TRUSTED_ORIGINS: z
    .string()
    .min(1, "BETTER_AUTH_TRUSTED_ORIGINS is required"),

  // Client
  CLIENT_HOST: z
    .string()
    .min(1, "CLIENT_HOST is required")
    .refine((url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }, "CLIENT_HOST must be a valid URL"),

  // Optional
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

// Validate environment variables (returns validation result instead of throwing)
export function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    console.log("✅ Environment variables validated successfully");
    return { success: true, data: parsed, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.issues
        .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
        .join("\n");
      console.error("❌ Invalid environment variables:\n" + details);
      return { success: false, data: null, error: details };
    }
    return { success: false, data: null, error: String(error) };
  }
}

// Direct access to process.env without validation at module load
// Validation happens in middleware instead
export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const SECRET: string = process.env.SECRET || "";
export const EMAIL_SMTP_SECURE: boolean =
  process.env.EMAIL_SMTP_SECURE === "true";
export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS || "";
export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER || "";
export const EMAIL_SMTP_PORT: number = parseInt(
  process.env.EMAIL_SMTP_PORT || "465",
  10,
);
export const EMAIL_SMTP_HOST: string = process.env.EMAIL_SMTP_HOST || "";
export const EMAIL_SMTP_SERVICE_NAME: string =
  process.env.EMAIL_SMTP_SERVICE_NAME || "";
export const CLIENT_HOST: string = process.env.CLIENT_HOST || "";
export const BETTER_AUTH_SECRET: string = process.env.BETTER_AUTH_SECRET || "";
export const BETTER_AUTH_URL: string = process.env.BETTER_AUTH_URL || "";
export const BETTER_AUTH_TRUSTED_ORIGINS: string =
  process.env.BETTER_AUTH_TRUSTED_ORIGINS || "";
export const NODE_ENV: string = process.env.NODE_ENV || "development";
export const IS_PRODUCTION: boolean = NODE_ENV === "production";
export const IS_DEVELOPMENT: boolean = NODE_ENV === "development";
