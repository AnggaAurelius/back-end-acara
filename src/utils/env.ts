import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (url) => url.startsWith("mongodb://") || url.startsWith("mongodb+srv://"),
      "DATABASE_URL must be a valid MongoDB connection string"
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
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
  BETTER_AUTH_TRUSTED_ORIGINS: z
    .string()
    .min(1, "BETTER_AUTH_TRUSTED_ORIGINS is required"),

  // Client
  CLIENT_HOST: z.string().url("CLIENT_HOST must be a valid URL"),

  // Optional
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

// Validate environment variables
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    console.log("✅ Environment variables validated successfully");
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      error.issues.forEach((err: z.ZodIssue) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
      console.error(
        "\n💡 Please check your .env file and ensure all required variables are set."
      );
      console.error("📄 Refer to .env.example for the required format.\n");
    }
    process.exit(1);
  }
}

// Validate on module load
const env = validateEnv();

// Export validated and typed environment variables
export const DATABASE_URL: string = env.DATABASE_URL;
export const SECRET: string = env.SECRET;
export const EMAIL_SMTP_SECURE: boolean = env.EMAIL_SMTP_SECURE || false;
export const EMAIL_SMTP_PASS: string = env.EMAIL_SMTP_PASS;
export const EMAIL_SMTP_USER: string = env.EMAIL_SMTP_USER;
export const EMAIL_SMTP_PORT: number = parseInt(env.EMAIL_SMTP_PORT, 10);
export const EMAIL_SMTP_HOST: string = env.EMAIL_SMTP_HOST;
export const EMAIL_SMTP_SERVICE_NAME: string = env.EMAIL_SMTP_SERVICE_NAME;
export const CLIENT_HOST: string = env.CLIENT_HOST;

// Better-Auth environment variables
export const BETTER_AUTH_SECRET: string = env.BETTER_AUTH_SECRET;
export const BETTER_AUTH_URL: string = env.BETTER_AUTH_URL;
export const BETTER_AUTH_TRUSTED_ORIGINS: string =
  env.BETTER_AUTH_TRUSTED_ORIGINS;

// Node environment
export const NODE_ENV: string = env.NODE_ENV || "development";
export const IS_PRODUCTION: boolean = NODE_ENV === "production";
export const IS_DEVELOPMENT: boolean = NODE_ENV === "development";
