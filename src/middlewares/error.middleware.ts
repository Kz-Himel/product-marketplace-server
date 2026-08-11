import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { sendError } from '../utils/response';
import { AppError } from '../utils/AppError';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorDetails: any = null;

  // Handle Custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Zod Validation Errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }

  // Handle Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation (e.g. Email already exists)
    if (err.code === 'P2002') {
      statusCode = 400;
      message = `Duplicate field value entered: ${err.meta?.target}`;
    }
    // Record to update/delete not found
    else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found in the database';
    } else {
      statusCode = 400;
      message = `Database Error: ${err.message}`;
    }
  }

  // Handle JWT Validation Errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  }

  return sendError(
    res,
    statusCode,
    message,
    process.env.NODE_ENV === 'development' ? errorDetails || err : errorDetails
  );
};