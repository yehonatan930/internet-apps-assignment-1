import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/auth/login" || req.path === "/auth/register") {
    return next();
  }

  const authHeader: string | undefined = req.headers["authorization"];
  const token: string | undefined = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    console.log(err, user);
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

export default authenticate;
