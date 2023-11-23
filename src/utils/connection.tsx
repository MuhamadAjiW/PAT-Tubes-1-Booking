// tugas-besar-pat-booking/src/connection.tsx

import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'booking-db',
  database: 'booking',
  password: 'postgres',
  port: 5432, 
});

export { pool };
