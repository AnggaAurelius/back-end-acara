import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { DATABASE_URL } from "../utils/env";
import { emailProvider, emailTemplates } from "./email-provider";

// Create MongoDB client for better-auth
const client = new MongoClient(DATABASE_URL);
const db = client.db("db-acara");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client, // Enable database transactions
  }),

  // Base URL and trusted origins (moved to top for better precedence)
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: (
    process.env.BETTER_AUTH_TRUSTED_ORIGINS ||
    "http://localhost:3000,http://localhost:3001"
  ).split(","),

  // Secret for signing tokens
  secret: process.env.BETTER_AUTH_SECRET || process.env.SECRET,

  // Additional configuration for URL handling
  rateLimit: {
    enabled: false, // Disable rate limiting for now to avoid issues
  },

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // Cast user to include custom fields
      const extendedUser = user as typeof user & {
        userName?: string;
        fullName?: string;
      };

      const html = await emailTemplates.passwordResetEmail({
        userName: extendedUser.userName || user.name,
        fullName: extendedUser.fullName || user.name,
        resetUrl: url,
      });

      await emailProvider.sendEmail({
        to: user.email,
        subject: "Reset your password",
        html,
      });
    },
  },

  // Custom user fields to match your existing schema
  user: {
    additionalFields: {
      fullName: {
        type: "string",
        required: true,
      },
      userName: {
        type: "string",
        required: true,
        unique: true,
      },
      role: {
        type: "string",
        defaultValue: "user",
        input: false, // Don't allow setting via API for security
      },
      profilePicture: {
        type: "string",
        defaultValue: "user.jpg",
      },
    },
  },

  // Email verification configuration
  emailVerification: {
    enabled: true,
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Cast user to include custom fields
      const extendedUser = user as typeof user & {
        userName?: string;
        fullName?: string;
      };

      const html = await emailTemplates.verificationEmail({
        userName: extendedUser.userName || user.name,
        fullName: extendedUser.fullName || user.name,
        email: user.email,
        verificationUrl: url,
      });

      await emailProvider.sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html,
      });
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (vs your current 1 hour)
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes cache
    },
  },

  // Security settings
  advanced: {
    generateId: false, // Use MongoDB ObjectId
    crossSubDomainCookies: {
      enabled: false, // Set to true if using subdomains
    },
  },
});

// Export types for TypeScript
export type Session = typeof auth.$Infer.Session;
