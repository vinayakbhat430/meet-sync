import { GeneralErrors, ICustomError } from "./interfaces";

export abstract class CustomError extends Error implements ICustomError { 
    constructor(public message:string){
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype)
    }
    abstract statusCode: number;
    abstract serializeErrors(): GeneralErrors[];
}