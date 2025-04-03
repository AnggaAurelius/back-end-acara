import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";

type TRegister = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  userName: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string()
    .required()
    .min(8, "Password must be at least 8 characters")
    .test(
      "password-complexity",
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      (value) => {
        if (!value) return false;

        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
      }
    ),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password not match"),
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
      await registerValidateSchema.validate({
        fullName,
        userName,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        userName,
        email,
        password,
      });

      res.status(200).json({
        message: "Succes Registration",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
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
    const { identifier, password } = req.body as unknown as TLogin;

    try {
      // get user data based on identifier -> email or username
      const userByIdentifier = await UserModel.findOne({
        $or: [{ email: identifier }, { userName: identifier }],
        isActive: true,
      });

      if (!userByIdentifier) {
        return res.status(403).json({
          message: "User not found",
          data: null,
        });
      }

      const isValidPassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!isValidPassword) {
        return res.status(403).json({
          message: "User not found",
          data: null,
        });
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      res.status(200).json({
        message: "Success Login",
        data: token,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
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

      res.status(200).json({
        message: "Success get user profile",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
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
      const { code } = req.body as {
        code: string;
      };

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

      res.status(200).json({
        message: "Success activation",
        data: user,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
