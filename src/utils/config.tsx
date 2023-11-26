import { join } from "path";

export const SERVER_FILE_FOLDER: string = join(__dirname, "../../resource/")
export const SERVER_API_KEY: string ="ticketServerApiToken"
export const SERVER_PORT: number = process.env.PORT? +process.env.PORT : 3100;

export const PG_USER: string = process.env.DB_USER? process.env.DB_USER : 'postgres';
export const PG_HOST: string = process.env.DB_HOST? process.env.DB_HOST : 'booking-db';
export const PG_NAME: string = process.env.DB_NAME? process.env.DB_NAME : 'booking';
export const PG_PASS: string = process.env.DB_PASS? process.env.DB_PASS : 'postgres';
export const PG_PORT: number = process.env.DB_PORT? +process.env.DB_PORT : 5432;

export const RABBITMQ_URL: string = process.env.RABBITMQ_URL? process.env.RABBITMQ_URL : 'amqp://test-user:test-user@central-queue:8200';
export const PAYMENT_SERVER_URL = process.env.PAYMENT_URL? process.env.PAYMENT_URL : 'http://[::1]:8190'
