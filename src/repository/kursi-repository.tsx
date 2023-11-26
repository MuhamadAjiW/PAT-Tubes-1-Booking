import { KursiRequest } from '../types/KursiRequest';
import { KursiStatusEnum } from '../types/enums/KursiStatusEnum';
import { PostgresConnection } from '../utils/connection';

export class KursiRepository {

    async getDistinctKursiId(acaraId: number) {
        const result = await PostgresConnection.query(
            'SELECT DISTINCT kursi_id FROM kursi WHERE acara_id = $1 AND status = $2',
            [acaraId, 'OPEN']
        );
        return result.rows.map((row: { kursi_id: any; }) => row.kursi_id);
    }

    async createKursi(acara_id: number, kursi: KursiRequest){
        const result = await PostgresConnection.query(
            'INSERT INTO kursi VALUES ($1, $2) RETURNING *',
            [kursi.kursi_id, acara_id]
        )
        return result.rows[0];
    }

    async getKursiById(acara_id: number, kursi_id: number){
        const result = await PostgresConnection.query(
            'SELECT * FROM kursi WHERE kursi_id = $1 AND acara_id = $2',
            [kursi_id, acara_id]
        )
        return result.rows[0];
    }

    async updateKursiStatus(acara_id: number, kursi_id: number, status: KursiStatusEnum){
        const result = await PostgresConnection.query(
            'UPDATE kursi SET status = $3 WHERE kursi_id = $1 AND acara_id = $2 RETURNING *',
            [kursi_id, acara_id, status]
        )
        return result.rows[0];
    }

    async deleteById(acara_id: number, kursi_id: number){
        const result = await PostgresConnection.query(
            'DELETE FROM kursi WHERE kursi_id = $1 AND acara_id = $2 RETURNING *',
            [kursi_id, acara_id]
        )
        return result.rows[0];
    }
}