import { BadRequestError } from "../errors/BadRequestError";

export enum PaymentStatusEnum{
    ERROR = "",
    DONE = "SUCCESS",
    PENDING = "PENDING",
    FAILED = "FAILED"
}

export function toPaymentStatus(string: string): PaymentStatusEnum{
    switch (string) {
        case "":
            return PaymentStatusEnum.ERROR;
        case "SUCCESS":
            return PaymentStatusEnum.DONE;                
        case "PENDING":
            return PaymentStatusEnum.PENDING;
        case "FAILED":
            return PaymentStatusEnum.FAILED;    
        default:
            throw new BadRequestError("Invalid payment status")
    }
}