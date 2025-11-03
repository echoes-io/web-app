import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

import * as schema from '@/lib/db/models';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on('error', (err: Error) => console.error('Unexpected pool error', err));

export const db = drizzle({ client: pool, schema, logger: true, ws });
