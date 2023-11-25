import { randomInt } from "crypto";

export class FailureSimulator{
    static simulate(){
        // Jika true maka gagal disimulasikan
        return randomInt(0, 5) == 0;
    }
}