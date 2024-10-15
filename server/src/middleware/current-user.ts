import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const CurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  const payload = Jwt.verify(
    req.session.jwt,
    process.env.JWT_KEY!
  ) as UserPayload;
  req.currentUser = payload;

  next();
};
