import { Request, Response, NextFunction } from "express";
import { getUserData, IUserToken } from "../utils/jwt";
import ResponseUtil from "../utils/response";

export interface IReqUser extends Request {
  user?: IUserToken;
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return ResponseUtil.unauthorized(res);
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return ResponseUtil.unauthorized(res);
  }

  const user = await getUserData(token);

  if (!user) {
    return ResponseUtil.unauthorized(res);
  }
  (req as IReqUser).user = user;

  next();
};
