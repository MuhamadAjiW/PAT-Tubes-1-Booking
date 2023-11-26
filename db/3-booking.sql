CREATE TYPE booking_status_enum AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

CREATE TABLE IF NOT EXISTS booking (
    booking_id SERIAL PRIMARY KEY,
    acara_id INT NOT NULL,
    kursi_id INT NOT NULL,
    status booking_status_enum NOT NULL DEFAULT 'PENDING',
    UNIQUE(acara_id, kursi_id),
    FOREIGN KEY(kursi_id) REFERENCES kursi(kursi_id),
    FOREIGN KEY(acara_id) REFERENCES acara(acara_id)
);