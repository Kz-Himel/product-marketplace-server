import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';

const app: Application = express();

// Core Middlewares
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Product Marketplace API is live and healthy!',
  });
});

// Centralized Error Handlers (Applied later after routes)
export const applyErrorMiddlewares = (application: Application) => {
  application.use(notFoundHandler);
  application.use(globalErrorHandler);
};

export default app;