import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

import * as schema from '@/lib/db/models';

export const db = drizzle({
  connection: process.env.DATABASE_URL,
  schema,
  logger: true,
  ws,
});
