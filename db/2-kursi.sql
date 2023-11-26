CREATE TYPE status_enum AS ENUM ('OPEN', 'ON GOING', 'BOOKED');

CREATE TABLE IF NOT EXISTS kursi (
    kursi_id INT NOT NULL,
    acara_id INT NOT NULL,
    status status_enum NOT NULL DEFAULT 'OPEN',
    PRIMARY KEY (kursi_id, acara_id),
    FOREIGN KEY(acara_id) REFERENCES acara(acara_id)
);


-- Dummy data for kursi table
INSERT INTO kursi (kursi_id, acara_id, status) VALUES
  (1, 1, 'OPEN'),
  (2, 1, 'OPEN'),
  (3, 1, 'OPEN'),
  (1, 2, 'OPEN'),
  (2, 2, 'OPEN'),
  (1, 3, 'OPEN');
