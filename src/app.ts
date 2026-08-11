import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import { sendSuccess } from './utils/response';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { globalErrorHandler } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app: Application = express();

// ==========================================
// Global Middlewares
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// Routes
// ==========================================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ==========================================
// Health Check
// ==========================================

app.get('/health', (_req: Request, res: Response) => {
  return sendSuccess(res, 200, 'API is healthy and operational');
});

// ==========================================
// Error Handling
// ==========================================

// 404 - Route Not Found
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

export default app;