import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { NotFoundError } from "../errors/not-found-error";
import { Event } from "../models/event";


const router = express.Router();
router.get("/api/events", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;

  const { name, email, picture } = currentUser(authorizationToken);

  const event = await Event.find({
    email: email
  }).populate('bookings');

  if(!event){
    throw new NotFoundError()
  }
  res.status(200).send(event);

});

export { router as GetEventsRouter };
