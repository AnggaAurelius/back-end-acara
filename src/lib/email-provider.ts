import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import {
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PASS,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_SECURE,
  EMAIL_SMTP_SERVICE_NAME,
  EMAIL_SMTP_USER,
} from "../utils/env";

// Create transporter using your existing email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: EMAIL_SMTP_SERVICE_NAME,
    host: EMAIL_SMTP_HOST,
    port: EMAIL_SMTP_PORT,
    secure: EMAIL_SMTP_SECURE,
    auth: {
      user: EMAIL_SMTP_USER,
      pass: EMAIL_SMTP_PASS,
    },
    requireTLS: true,
  } as any);
};

// Email provider for better-auth
export const emailProvider = {
  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    const transporter = createTransporter();

    try {
      const result = await transporter.sendMail({
        from: EMAIL_SMTP_USER,
        to,
        subject,
        html,
      });

      console.log("✅ Email sent successfully to:", to);
      return result;
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      throw error;
    }
  },
};

// Template rendering function (reusing your existing approach)
const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, any>
): Promise<string> => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "utils",
    "mail",
    "templates",
    templateName
  );

  try {
    const html = await ejs.renderFile(templatePath, data);
    return html;
  } catch (error) {
    console.error("❌ Template rendering failed:", error);
    throw error;
  }
};

// Custom email templates for better-auth
export const emailTemplates = {
  // Email verification template
  async verificationEmail(data: {
    userName: string;
    fullName: string;
    email: string;
    verificationUrl: string;
  }) {
    try {
      // Try to use your existing template first
      return await renderEmailTemplate("registration-success.ejs", {
        userName: data.userName,
        fullName: data.fullName,
        email: data.email,
        createdAt: new Date(),
        activationLink: data.verificationUrl,
      });
    } catch (error) {
      // Fallback to simple HTML template
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome ${data.fullName}!</h2>
          <p>Thank you for registering with us. Please verify your email address by clicking the link below:</p>
          <a href="${data.verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Verify Email Address
          </a>
          <p>If you didn't create this account, you can safely ignore this email.</p>
        </div>
      `;
    }
  },

  // Password reset template
  async passwordResetEmail(data: {
    userName: string;
    fullName: string;
    resetUrl: string;
  }) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${data.fullName},</p>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <a href="${data.resetUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
      </div>
    `;
  },
};
