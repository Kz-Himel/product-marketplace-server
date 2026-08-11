import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { sendSuccess } from './utils/response';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { globalErrorHandler } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  return sendSuccess(res, 200, 'API is healthy and operational');
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;