import { PostgresConnection } from '../utils/connection';

export class AcaraRepository {

    async getDistinctAcaraId() {
        const result = await PostgresConnection.query('SELECT DISTINCT acara_id FROM acara');
        return result.rows.map((row: { acara_id: any; }) => row.acara_id);
    }
}
