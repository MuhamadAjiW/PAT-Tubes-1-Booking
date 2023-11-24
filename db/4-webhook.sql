CREATE TABLE IF NOT EXISTS webhook_client (
    client_id SERIAL PRIMARY KEY,
    ip VARCHAR(256) UNIQUE NOT NULL,
    token VARCHAR(256) NOT NULL
);


CREATE TABLE IF NOT EXISTS webhook (
    webhook_id SERIAL UNIQUE PRIMARY KEY,
    client_id INT NOT NULL,
    endpoint VARCHAR(256) NOT NULL,
    event_name VARCHAR(256) NOT NULL,

    UNIQUE(client_id, endpoint),
    FOREIGN KEY(client_id) REFERENCES webhook_client(client_id)
);