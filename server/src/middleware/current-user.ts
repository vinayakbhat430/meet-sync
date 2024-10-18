import { BadRequestError } from "../errors/bad-request-error";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const currentUser = (authToken:string|undefined)=> {
  if (!authToken) {
    throw new NotAuthorizedError();
  }
  const token = authToken.replace("Bearer ", "");

  if (!token) {
    throw new BadRequestError("Invalid token");
  }

  const { name, email, picture } = decodeToken(token);

  return { name, email, picture}
}


function decodeToken(token: string) {
  return JSON.parse(atob(token.split(".")[1]));
}