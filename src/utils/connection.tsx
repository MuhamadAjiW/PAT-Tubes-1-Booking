// tugas-besar-pat-booking/src/connection.tsx

import { Pool } from 'pg';

export const pool: Pool = new Pool({
  user: process.env.DB_USER? process.env.DB_USER : 'postgres',
  host: process.env.DB_HOST? process.env.DB_HOST : 'localhost',
  database: process.env.DB_NAME? process.env.DB_NAME : 'bookingdb',
  password: process.env.DB_PASS? process.env.DB_PASS : 'Aa123456',
  port: process.env.DB_PORT? process.env.DB_PORT : 8183, 
});
