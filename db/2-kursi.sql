CREATE TYPE status_enum AS ENUM ('OPEN', 'ON GOING', 'BOOKED');

CREATE TABLE IF NOT EXISTS kursi (
    kursi_id SERIAL PRIMARY KEY,
    acara_id INT NOT NULL,
    status status_enum NOT NULL DEFAULT 'OPEN',
    FOREIGN KEY(acara_id) REFERENCES acara(acara_id)
);


-- Dummy data for kursi table
INSERT INTO kursi (acara_id, status) VALUES
  (1, 'OPEN'),
  (1, 'OPEN'),
  (1, 'OPEN'),
  (2, 'OPEN'),
  (2, 'OPEN'),
  (3, 'OPEN');
