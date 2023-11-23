import express from 'express';
import cors from 'cors';
import { pool } from './connection';

const app = express();
const port = 3100;

app.use(cors());
app.use(express.json());

app.post('/api/book-kursi', async (req, res) => {
  const { acaraId, kursiId, userId } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO booking (acara_id, kursi_id, status) VALUES ($1, $2, $3)',
      [acaraId, kursiId, 'PENDING']
    );

    res.json({ success: true, message: 'Booking successful' });
  } catch (error) {
    console.error('Error booking kursi:', error);
    res.status(500).json({ success: false, message: 'Booking failed' });
  }
});

app.listen(port, () => {
  console.log(`Booking API listening at http://localhost:${port}`);
});
