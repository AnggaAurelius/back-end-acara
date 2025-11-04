import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsfiles = ["../routes/api.ts"];
const doc = {
  info: {
    version: "v1.0.0",
    title: "Event Management API",
    description: "API documentation for Event Management System with Better-Auth integration",
  },
  servers: [
    {
      url: "http://localhost:3000/api/",
      description: "Local Development Server",
    },
    {
      url: "https://back-end-acara-beta-lilac.vercel.app/api/",
      description: "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your session token (Better-Auth). Prefer cookieAuth.",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
        description: "Better-Auth session cookie",
      },
    },
    schemas: {
      // Better-Auth schemas
      BetterAuthSignUpRequest: {
        type: "object",
        required: ["email", "password", "fullName", "userName"],
        properties: {
          email: {
            type: "string",
            format: "email",
            description: "User's email address",
            example: "user@example.com",
          },
          password: {
            type: "string",
            minLength: 8,
            description: "Password (min 8 chars)",
            example: "SecurePassword123!",
          },
          fullName: {
            type: "string",
            description: "User's full name",
            example: "John Doe",
          },
          userName: {
            type: "string",
            description: "Unique username",
            example: "johndoe",
          },
        },
      },
      BetterAuthSignInRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            description: "User's email address",
            example: "user@example.com",
          },
          password: {
            type: "string",
            description: "User password",
            example: "SecurePassword123!",
          },
        },
      },
      UserProfile: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "User ID",
            example: "507f1f77bcf86cd799439011",
          },
          name: {
            type: "string",
            description: "User's display name",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            description: "User's email",
            example: "john@example.com",
          },
          fullName: {
            type: "string",
            description: "User's full name",
            example: "John Doe",
          },
          userName: {
            type: "string",
            description: "Username",
            example: "johndoe",
          },
          profilePicture: {
            type: "string",
            description: "Profile picture filename",
            example: "user.jpg",
          },
          emailVerified: {
            type: "boolean",
            description: "Email verification status",
            example: true,
          },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Request success status",
            example: true,
          },
          message: {
            type: "string",
            description: "Response message",
            example: "Operation completed successfully",
          },
          data: {
            type: "object",
            description: "Response data",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Request success status",
            example: false,
          },
          message: {
            type: "string",
            description: "Error message",
            example: "An error occurred",
          },
          error: {
            type: "string",
            description: "Detailed error information",
            example: "Validation failed",
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Better-Auth",
      description: "Better-Auth authentication endpoints",
    },
  ],
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsfiles, doc);
