import express from 'express';
import cors from 'cors';
import { pool } from './connection';

const app = express();
const port = 3100;

app.use(cors());
app.use(express.json());

// Endpoint to fetch kursi list
app.get('/api/kursi-list', async (_, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT kursi_id FROM kursi');
    const kursiList = result.rows.map(row => row.kursi_id);
    res.json(kursiList);
  } catch (error) {
    console.error('Error fetching kursi list:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch kursi list' });
  }
});

// Endpoint to fetch acara list
app.get('/api/acara-list', async (_, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT acara_id FROM acara');
    const acaraList = result.rows.map(row => row.acara_id);
    res.json(acaraList);
  } catch (error) {
    console.error('Error fetching acara list:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch acara list' });
  }
});

app.post('/api/book-kursi', async (req, res) => {
  const { acaraId, kursiId, userId } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO kursi (acara_id, kursi_id, status) VALUES ($1, $2, $3)',
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
