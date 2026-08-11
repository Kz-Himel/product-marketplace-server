import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Product Marketplace API is live and healthy!',
  });
});

// API Routes
app.use('/api/auth', authRoutes);

export const applyErrorMiddlewares = (application: Application) => {
  application.use(notFoundHandler);
  application.use(globalErrorHandler);
};

export default app;