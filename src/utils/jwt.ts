import { Types } from "mongoose";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { SECRET } from "./env";

export interface IUserToken
  extends Omit<
    User,
    | "password"
    | "activeCode"
    | "isActive"
    | "email"
    | "fullName"
    | "profilePicture"
    | "userName"
  > {
  id: Types.ObjectId;
}

export const generateToken = (user: IUserToken) => {
  const token = jwt.sign(user, SECRET as string, { expiresIn: "1h" });
  return token;
};

export const getUserData = async (token: string) => {
  const user = jwt.verify(token, SECRET as string) as IUserToken;
  return user;
};
