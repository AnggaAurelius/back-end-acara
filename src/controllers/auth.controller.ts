import { Request, Response } from "express";
import { z } from "zod";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";
import ResponseUtil from "../utils/response";

// Infer types from Zod schemas
type TRegister = z.infer<typeof registerValidateSchema>;

type TLogin = z.infer<typeof loginValidateSchema>;
type TActivation = z.infer<typeof activationValidateSchema>;

const registerValidateSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    userName: z.string().min(1, "Username is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password not match",
    path: ["confirmPassword"],
  });

const loginValidateSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  password: z.string().min(1, "Password is required"),
});

const activationValidateSchema = z.object({
  code: z.string().min(1, "Activation code is required"),
});

export default {
  async register(req: Request, res: Response) {
    /**
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        requires: true,
        schema: {$ref: "#/components/schemas/RegisterRequest"}
      }
     */
    const { fullName, userName, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      const validatedData = registerValidateSchema.parse({
        fullName,
        userName,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName: validatedData.fullName,
        userName: validatedData.userName,
        email: validatedData.email,
        password: validatedData.password,
      });

      return ResponseUtil.success(res, 200, "Success Registration", result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues
          .map((err: any) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return ResponseUtil.validationError(res, errorMessage);
      } else {
        const err = error as unknown as Error;
        return ResponseUtil.error(res, 400, err.message);
      }
    }
  },

  async login(req: Request, res: Response) {
    /**
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        requires: true,
        schema: {$ref: "#/components/schemas/LoginRequest"}
      }
     */
    try {
      const { identifier, password } = loginValidateSchema.parse(req.body);

      // get user data based on identifier -> email or username
      const userByIdentifier = await UserModel.findOne({
        $or: [{ email: identifier }, { userName: identifier }],
        isActive: true,
      });

      if (!userByIdentifier) {
        return ResponseUtil.forbidden(res, "User not found");
      }

      const isValidPassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!isValidPassword) {
        return ResponseUtil.forbidden(res, "Invalid credentials");
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      return ResponseUtil.success(res, 200, "Success Login", token);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues
          .map((err: any) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return ResponseUtil.validationError(res, errorMessage);
      } else {
        const err = error as unknown as Error;
        return ResponseUtil.error(res, 400, err.message);
      }
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
      #swagger.tags = ['Auth']
      #swagger.security = [{
        "bearerAuth": []
      }]
     */
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      return ResponseUtil.success(res, 200, "Success get user profile", result);
    } catch (error) {
      const err = error as unknown as Error;
      return ResponseUtil.error(res, 400, err.message);
    }
  },

  async activation(req: Request, res: Response) {
    /**
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        requires: true,
        schema: {$ref: "#/components/schemas/ActivaionRequset"}
      }
     */
    try {
      const { code } = activationValidateSchema.parse(req.body);
      const user = await UserModel.findOneAndUpdate(
        {
          activeCode: code,
        },
        {
          activeCode: null,
          isActive: true,
        },
        {
          new: true,
        }
      );

      return ResponseUtil.success(res, 200, "Success activation", user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues
          .map((err: any) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return ResponseUtil.validationError(res, errorMessage);
      } else {
        const err = error as unknown as Error;
        return ResponseUtil.error(res, 400, err.message);
      }
    }
  },
};
