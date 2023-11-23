import { pool } from '../utils/connection';

export class KursiRepository {

    async getDistinctKursiId() {
        const result = await pool.query('SELECT DISTINCT kursi_id FROM kursi');
        return result.rows.map(row => row.kursi_id);
    }
}
