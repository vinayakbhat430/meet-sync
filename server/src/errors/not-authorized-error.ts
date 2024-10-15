import { CustomError } from "./custom-error-class";
import { GeneralErrors } from "./interfaces";

export class NotAuthorizedError extends CustomError{
    statusCode = 401;
    constructor(){
        super('Not Authorized');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }

    serializeErrors(): GeneralErrors[] {
        return [{message: 'Not Authorized'}]
    }
}