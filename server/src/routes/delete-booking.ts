import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { NotFoundError } from "../errors/not-found-error";
import { Event } from "../models/event";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { Bookings } from "../models/bookings";


const router = express.Router();
router.delete("/api/bookings/:eventId", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;

  const { name, email, picture } = currentUser(authorizationToken);
  
  const eventId = req.params.eventId;

  const booking = await Bookings.findById(eventId);

  if(!booking){
    throw new NotFoundError()
  }

  if(booking.email !== email){
    throw new NotAuthorizedError()
  }

  await booking.deleteOne();


  res.status(204).send({});

});

export { router as DeleteBookingsRouter };
