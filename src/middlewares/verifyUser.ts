import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = String(req.headers.authorization);
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, String(process.env.JWT_SECRET));
    next();
  } catch (error) {
    res.status(401).send('Unauthorized Access');
  }
};
