import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";

const NO_AUTHORIZATION_ROUTES = ["/auth/login", "/auth/register", "/auth/verify"];

export const Authorization = async (req: Request, res: Response, next: NextFunction) => {
  if (NO_AUTHORIZATION_ROUTES.includes(req.url)) return next();

  let token = req.headers.authorization || req.headers.Authorization;

  if (!token) {
    return res.status(401).json({
      message: "Missing authorization header",
      code: 0,
      status: 401,
    });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  } else {
    return res.status(401).json({
      message: "No authorization type specified",
      code: 0,
      status: 401,
    });
  }

  const user = await User.findOne({
    where: {
      token: token,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid token",
      code: 0,
      status: 401,
    });
  }

  req.user = user;

  next();
};