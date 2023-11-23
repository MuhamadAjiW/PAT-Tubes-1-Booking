// tugas-besar-pat-booking/src/App.tsx

import express from 'express';
import cors from 'cors';
import { pool } from './connection';

const app = express();
const port = 3100;

app.use(cors());
app.use(express.json());

app.post('/api/book-kursi', async (req, res) => {
  const { acaraId, kursiId, userId } = req.body;
  res.json({ success: true, message: 'Booking successful' });
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
