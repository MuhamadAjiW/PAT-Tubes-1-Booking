import { PostgresConnection } from '../utils/connection';

export class KursiRepository {

    async getDistinctKursiId(acaraId: number) {
        const result = await PostgresConnection.query(
            'SELECT DISTINCT kursi_id FROM kursi WHERE acara_id = $1 AND status = $2',
            [acaraId, 'OPEN']
        );
        return result.rows.map((row: { kursi_id: any; }) => row.kursi_id);
    }
}