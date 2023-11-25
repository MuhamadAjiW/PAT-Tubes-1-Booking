export const SERVER_FILE_FOLDER: string ="./resource/"
export const SERVER_PORT: number = process.env.PORT? +process.env.PORT : 3000;

export const PG_USER: string = process.env.DB_USER? process.env.DB_USER : 'postgres';
export const PG_HOST: string = process.env.DB_HOST? process.env.DB_HOST : 'localhost';
export const PG_NAME: string = process.env.DB_NAME? process.env.DB_NAME : 'bookingdb';
export const PG_PASS: string = process.env.DB_PASS? process.env.DB_PASS : 'Aa123456';
export const PG_PORT: number = process.env.DB_PORT? +process.env.DB_PORT : 8181;

export const RABBITMQ_URL: string = process.env.RABBITMQ_URL? process.env.RABBITMQ_URL : 'amqp://test-user:test-user@central-queue:5672';
