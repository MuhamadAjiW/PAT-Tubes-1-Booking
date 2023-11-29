CREATE TABLE IF NOT EXISTS acara (
    acara_id SERIAL PRIMARY KEY,
    nama_acara VARCHAR(256) NOT NULL
);

-- Dummy data for acara table
INSERT INTO acara (nama_acara) VALUES
  ('Event A'),
  ('Event B'),
  ('Event C'),
  ('Event D'),
  ('Event E'),
  ('Event F'),
  ('Event G'),
  ('Event H'),
  ('Event I'),
  ('Event J');
