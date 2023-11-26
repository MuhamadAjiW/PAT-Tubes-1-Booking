import { PostgresConnection } from '../utils/connection';

export class AcaraRepository {

    async getDistinctAcaraId() {
        const result = await PostgresConnection.query('SELECT DISTINCT acara_id FROM acara');
        return result.rows.map((row: { acara_id: any; }) => row.acara_id);
    }

    async getAcaraById(acara_id: number){
        const result = await PostgresConnection.query(
            'SELECT * FROM acara WHERE acara_id = $1',
            [acara_id]
        )
        return result.rows[0];
    }
}
