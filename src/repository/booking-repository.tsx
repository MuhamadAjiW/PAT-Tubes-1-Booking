import { BookRequest } from '../types/BookRequest';
import { pool } from '../utils/connection';

export class BookingRepository{
    async insert(bookRequest: BookRequest){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const bookingResult = await client.query(
                'INSERT INTO booking (acara_id, kursi_id, status) VALUES ($1, $2, $3) RETURNING acara_id, kursi_id, status',
                [bookRequest.acaraId, bookRequest.kursiId, 'PENDING']
            );

            const kursiUpdateResult = await client.query(
                'UPDATE kursi SET status = $1 WHERE kursi_id = $2',
                ['ON GOING', bookRequest.kursiId]
            );

            await client.query('COMMIT');

            return bookingResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}