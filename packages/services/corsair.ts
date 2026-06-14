import 'dotenv/config';
import { pool } from '@repo/database';
import { createCorsair } from 'corsair';
import { github } from '@corsair-dev/github';
import { env } from './env';

export const corsair: ReturnType<typeof createCorsair> = createCorsair({
    plugins: [github()],
    database: pool,
    kek: env.CORSAIR_KEK!,
    multiTenancy: false,
});