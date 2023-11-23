import { BookRequest } from '../types/BookRequest';
import { pool } from '../utils/connection';

export class BookingRepository{
    async insert(bookRequest: BookRequest){
        const result = await pool.query(
            'INSERT INTO booking (acara_id, kursi_id, status) VALUES ($1, $2, $3) RETURNING acara_id, kursi_id, status',
            [bookRequest.acaraId, bookRequest.kursiId, 'PENDING']
        )
        return result.rows[0];
    }
}
