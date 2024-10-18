import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { NotFoundError } from "../errors/not-found-error";
import { Bookings } from "../models/bookings";


const router = express.Router();
router.get("/api/bookings", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;

  const { name, email, picture } = currentUser(authorizationToken);

  const bookings = await Bookings.find({
    email: email
  })

  if(bookings){
    throw new NotFoundError()
  }
  res.status(200).send(bookings);

});

export { router as GetBookingsRouter };
