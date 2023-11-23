// tugas-besar-pat-booking/src/App.tsx

import express from 'express';
import cors from 'cors';
import { pool } from './connection';
import Bun from 'bun';

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
  const { acaraId, kursiId } = req.body;

  const text = 'INSERT INTO booking(acara_id, kursi_id, status) VALUES($1, $2, $3)';
  const values = [acaraId, kursiId, 'PENDING'];

  try {
    await pool.query(text, values);
    res.json({ success: true, message: 'Booking successful YA' });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Booking failed' });
  }
});

app.listen(port, () => {
  console.log(`Booking API listening at http://localhost:${port}`);
});

// Bun setup
const App = Bun.serve({
  port: 3101,
  async fetch(request: Request) {
    const url = `http://localhost:${port}${request.url}`;
    
    const newRequest = new Request(url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    return fetch(newRequest);
  },
});

console.log("Server started at port 3101");
