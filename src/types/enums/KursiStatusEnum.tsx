import { BadRequestError } from "../errors/BadRequestError";

export enum KursiStatusEnum{
    OPEN = "OPEN",
    ONGOING = "ON GOING",
    BOOKED = "BOOKED",
}

export function toKursiStatusEnum(string: string): KursiStatusEnum{
    switch (string) {
        case "OPEN":
            return KursiStatusEnum.OPEN;
        case "ON GOING":
            return KursiStatusEnum.ONGOING;                
        case "BOOKED":
            return KursiStatusEnum.BOOKED;
        default:
            throw new BadRequestError("Invalid kursi status")
    }
}