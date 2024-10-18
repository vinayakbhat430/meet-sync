import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { Days, DaysDoc } from "../models/days";
import { BadRequestError } from "../errors/bad-request-error";
import { Availability } from "../models/availability";
import { NotFoundError } from "../errors/not-found-error";
import { Event } from "../models/event";


const router = express.Router();
router.get("/api/events", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;

  const { name, email, picture } = currentUser(authorizationToken);

  const event = await Event.findOne({
    email: email
  }).populate('bookings');

  if(!event){
    throw new NotFoundError()
  }
  res.status(200).send(Event);

});

export { router as GetEventsRouter };
