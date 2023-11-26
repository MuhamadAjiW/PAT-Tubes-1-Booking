import { BookingRequest } from '../types/BookingRequest';
import { BookingStatusEnum } from '../types/enums/BookingStatusEnum';
import { PostgresConnection } from '../utils/connection';

export class BookingRepository{
    async insert(bookRequest: BookingRequest){
        const client = await PostgresConnection.connect();
        try {
            await client.query('BEGIN');

            const bookingResult = await client.query(
                'INSERT INTO booking (acara_id, kursi_id, status) VALUES ($1, $2, $3) RETURNING *',
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

    async deleteById(booking_id: number){
        const result = await PostgresConnection.query(
            'DELETE FROM booking WHERE booking_id = $1 RETURNING *',
            [booking_id]
        );
        return result.rows[0];
    }

    async deleteByAcaraIdAndKursiId(acaraId: number, kursiId: number){
        const result = await PostgresConnection.query(
            'DELETE FROM booking WHERE acara_id = $1 AND kursi_id = $2 RETURNING *',
            [acaraId, kursiId]
        );
        return result.rows[0];
    }

    async updateByAcaraIdAndKursiId(acaraId: number, kursiId: number, status: BookingStatusEnum){
        const result = await PostgresConnection.query(
            'UPDATE booking SET status = $3 WHERE acara_id = $1 AND kursi_id = $2 RETURNING *',
            [acaraId, kursiId, status]
        );
        return result.rows[0];
    }

    async getStatusById(booking_id: number){
        const result = await PostgresConnection.query(
            'SELECT status FROM booking WHERE booking_id = $1 RETURNING status',
            [booking_id]
        );
        return result.rows[0];
    }

    async getStatusByAcaraIdAndKursiId(acaraId: number, kursiId: number){
        const result = await PostgresConnection.query(
            'SELECT status FROM booking WHERE acara_id = $1 AND kursi_id = $2 RETURNING status',
            [acaraId, kursiId]
        );
        return result.rows[0];
    }
}