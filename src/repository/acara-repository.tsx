import { AcaraRequest } from '../types/AcaraRequest';
import { PostgresConnection } from '../utils/connection';

export class AcaraRepository {

    async getDistinctAcaraId() {
        const result = await PostgresConnection.query('SELECT DISTINCT acara_id FROM acara');
        return result.rows.map((row: { acara_id: any; }) => row.acara_id);
    }

    async createAcara(acaraRequest: AcaraRequest){
        const result = await PostgresConnection.query(
            'INSERT INTO acara VALUES ($1) RETURNING *',
            [acaraRequest.nama_acara]
        )
        return result.rows[0];
    }

    async getAcaraById(acara_id: number){
        const result = await PostgresConnection.query(
            'SELECT * FROM acara WHERE acara_id = $1',
            [acara_id]
        )
        return result.rows[0];
    }

    async updateAcaraNamaAcara(acara_id: number, nama_acara: string){
        const result = await PostgresConnection.query(
            'UPDATE acara SET nama_acara = $1 WHERE acara_id = $2 RETURNING *',
            [nama_acara, acara_id]
        )
        return result.rows[0];
    }

    async deleteAcaraById(acara_id: number){
        const result = await PostgresConnection.query(
            'DELETE FROM acara WHERE acara_id = $1 RETURNING *',
            [acara_id]
        )
        return result.rows[0];
    }
}
