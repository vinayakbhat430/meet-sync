import { CustomError } from "./custom-error-class";
import { GeneralErrors, ICustomError } from "./interfaces";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error Connecting to Database";

  constructor() {
    super('Error Connecting to Database');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors():GeneralErrors[] {
    return [{ message: this.reason }];
  }
}
