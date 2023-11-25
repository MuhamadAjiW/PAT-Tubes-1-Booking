import { pool } from '../utils/connection';

export class AcaraRepository {

    async getDistinctAcaraId() {
        const result = await pool.query('SELECT DISTINCT acara_id FROM acara');
        return result.rows.map(row => row.acara_id);
    }
}
