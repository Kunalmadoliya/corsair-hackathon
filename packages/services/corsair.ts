import 'dotenv/config';
import { pool } from '@repo/database';
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { env } from './env';

export const corsair: ReturnType<typeof createCorsair> = createCorsair({
    plugins: [
        gmail(),
        googlecalendar()
    ],
    database: pool,
    kek: env.CORSAIR_KEK!,
    multiTenancy: true,
});