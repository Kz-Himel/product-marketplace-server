import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  sendError(res, 404, `API route not found: ${req.originalUrl}`);
};