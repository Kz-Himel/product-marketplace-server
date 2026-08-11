import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { sendError } from '../utils/response';

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error Details]:', err);

  // ==========================================
  // Zod Validation Error
  // ==========================================
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return sendError(
      res,
      400,
      'Validation Error',
      formattedErrors
    );
  }

  // ==========================================
  // Prisma Unique Constraint Violation
  // ==========================================
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2002'
  ) {
    const target = Array.isArray(err.meta?.target)
      ? err.meta.target.map(String)
      : ['field'];

    return sendError(
      res,
      409,
      `Duplicate entry for ${target.join(', ')}`
    );
  }

  // ==========================================
  // Prisma Record Not Found
  // ==========================================
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2025'
  ) {
    return sendError(
      res,
      404,
      'Requested record not found'
    );
  }

  // ==========================================
  // Custom Application Error
  // ==========================================
  if (
    typeof err === 'object' &&
    err !== null &&
    'statusCode' in err
  ) {
    const statusCode = Number(
      (err as { statusCode?: unknown }).statusCode
    );

    const message =
      'message' in err &&
      typeof (err as { message?: unknown }).message === 'string'
        ? (err as { message: string }).message
        : 'Internal Server Error';

    return sendError(
      res,
      statusCode || 500,
      message
    );
  }

  // ==========================================
  // Unknown / Unhandled Error
  // ==========================================
  return sendError(
    res,
    500,
    'Internal Server Error'
  );
};