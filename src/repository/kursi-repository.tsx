import { pool } from '../utils/connection';

export class KursiRepository {

    async getDistinctKursiId(acaraId: number) {
        const result = await pool.query(
            'SELECT DISTINCT kursi_id FROM kursi WHERE acara_id = $1 AND status = $2',
            [acaraId, 'OPEN']
        );
        return result.rows.map(row => row.kursi_id);
    }
}