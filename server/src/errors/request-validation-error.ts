import { ValidationError } from "express-validator";
import { GeneralErrors, ICustomError } from "./interfaces";
import { CustomError } from "./custom-error-class";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    //only because we are extending builtin class we are setting prototype
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): GeneralErrors[] {
    return this.errors.map(err=>({
        message: err.msg,
        field: err.type
    }))
  }
}
