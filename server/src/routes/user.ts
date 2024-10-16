import express, { Request, Response } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

function decodeToken(token: string) {
  return JSON.parse(atob(token.split(".")[1]));
}

const router = express.Router();
router.get("/api/user", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;
  console.log(authorizationToken);
  if (!authorizationToken) {
    throw new NotAuthorizedError();
  }
  const token = authorizationToken.replace("Bearer ", "");

  if (!token) {
    throw new BadRequestError("Invalid token");
  }

  const { name, email, picture } = decodeToken(authorizationToken);

  const user = await User.find({ email: email });

  if (user.length) {
    res.send({ message: "Sign In Successful", user: user });
  } else {
    const buildUser = User.build({ name, email, picture });
    await buildUser.save();
    res.send({ message: "Sign up Successful", user: buildUser });
  }
});

export { router as UserRouter };
