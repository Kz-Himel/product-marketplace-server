import app, { applyErrorMiddlewares } from './app';
import { env } from './config/env';

// Register fallback error middlewares
applyErrorMiddlewares(app);

app.listen(env.port, () => {
  console.log(`[Server]: Server running on http://localhost:${env.port}`);
});