import app from './app';
import { env } from './config/env';

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`[Server]: Server running on http://localhost:${PORT}`);
});