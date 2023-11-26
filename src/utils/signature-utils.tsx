import * as crypto from 'crypto';
import moment from 'moment';

export class SignatureUtil{
    // TODO: Implement
    public static PDFExpiry: number = 300 * 1000 // in milis
    public static secretKey: string = "signedsignedsignedsignedsignedee";
    public static dateFormat = "YYYY-MM-DDTHH-mm-ss.SSS";

    public static generateSignature(identifier: string, expiry: number): string | null{
        try{
            const expiration: number = Date.now() + expiry;
            const formattedTimestamp: string = moment(expiration).format(this.dateFormat)
            const salt: string = crypto.randomBytes(10).toString('hex');
            return this.encryptSignature(identifier + "|" + formattedTimestamp + "|" + salt);
        } catch (error){
            console.error(error);
            return null;
        }
    }

    public static verifySignature(signature: string): boolean{
        const decryptedSignature = this.decryptSignature(signature);
        const parts = decryptedSignature.split("|");

        if (parts.length == 3){
            const expirationTime = moment(parts[1], this.dateFormat);
            return expirationTime.isAfter(moment());
        } else {
            return false;
        }
    }

    public static getIdentifier(signature: string){
        const decryptedSignature = this.decryptSignature(signature);
        const parts = decryptedSignature.split("|");

        if (parts.length == 3){
            return parts[0];
        } else {
            return null;
        }
    }

    private static encryptSignature(signature: string): string{
        try {
            const cipher = crypto.createCipher('aes-256-cbc', this.secretKey)
            let encryptedBytes = cipher.update(signature, 'utf-8', 'base64url');
            encryptedBytes += cipher.final('base64url');
            return encryptedBytes;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    private static decryptSignature(signature: string): string{
        try {
            const cipher = crypto.createDecipher('aes-256-cbc', this.secretKey)
            let decryptedBytes = cipher.update(signature, 'base64url', 'utf-8');
            decryptedBytes += cipher.final('utf-8');
            return decryptedBytes;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
}