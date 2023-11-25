// import { BookRequest } from '../types/BookRequest';
// import { WebhookRegisterRequest } from '../types/WebhookRegisterRequest';
// import { PostgresConnection } from '../utils/connection';

// export class WebhookRepository{
//     //TODO: Implement
//     async insertWebhookClient(ip: String, token: String){
//         const result = await PostgresConnection.query(
//             'INSERT INTO webhook_client (ip, token) VALUES ($1, $2) RETURNING client_id, ip, token',
//             [ip, token]
//         )

//         return result.rows[0];
//     }
    
//     async insertWebhook(webhookRegisterRequest: WebhookRegisterRequest, client_id: number){
//         const result = await PostgresConnection.query(
//             'INSERT INTO webhook (client_id, endpoint, event_name) VALUES ($1, $2, $3) RETURNING webhook_id, client_id, endpoint, event_name',
//             [client_id, webhookRegisterRequest.endpoint, webhookRegisterRequest.eventName]
//         )

//         return result.rows[0];
//     }

//     async cleanWebhook(){
//         const result = await PostgresConnection.query(
//             'DELETE FROM webhook WHERE true',
//         )
//         return
//     }

//     async getWebhookById(webhook_id: number){
//         const result = await PostgresConnection.query(
//             'SELECT * FROM webhook WHERE webhook_id = $1',
//             [webhook_id]
//         )
//         return result.rows[0];
//     }

//     async getWebhookUniqueEndpoints(){
//         const result = await PostgresConnection.query(
//             'SELECT DISTINCT endpoint FROM webhook',
//         )
//         return result.rows.map((row: { endpoint: any; }) => row.endpoint);
//     }
    
//     async getWebhookClientById(client_id: number){
//         const result = await PostgresConnection.query(
//             'SELECT * FROM webhook_client WHERE client_id = $1',
//             [client_id]
//         )
//         return result.rows[0];
//     }

//     async getWebhookClientByIp(ip: String){
//         const result = await PostgresConnection.query(
//             'SELECT * FROM webhook_client WHERE ip = $1',
//             [ip]
//         )
//         return result.rows[0];
//     }
// }