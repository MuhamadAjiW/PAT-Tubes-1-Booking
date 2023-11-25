// import { RabbitMQConnectionFactory } from "../types/others/RabbitMQConnectionFactory";

// export class PaymentController {
//     initialize(){
//         RabbitMQConnectionFactory.addListener(
//             "payment-exchange",
//             "outgoing-invoice-queue",
//             this.testFunction
//         )
//     }

//     testFunction(message: any){
//         console.log("Message received for test1");
//         console.log(message.content.toString());
//     }
// }