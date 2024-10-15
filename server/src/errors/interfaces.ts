export interface GeneralErrors{
    message:string;
    field?:string;
}


// interface to get serialized error messages (I am adding this to make consitency by implementing this interface to class)
export interface ICustomError{
    statusCode: number;
    serializeErrors(): GeneralErrors[];
}

export interface UserAttrs { 
    email:string;
    password: string;
}