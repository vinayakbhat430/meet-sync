import { CustomError } from "./custom-error-class";
import { GeneralErrors } from "./interfaces";

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super("Not Found");

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors(): GeneralErrors[] {
    return [{ message: "Not found!" }];
  }
}
