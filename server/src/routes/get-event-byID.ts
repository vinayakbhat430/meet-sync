import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { NotFoundError } from "../errors/not-found-error";
import { Event } from "../models/event";


const router = express.Router();
router.get("/api/event/:eventId", async (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  const event = await Event.findById(eventId).populate('bookings');

  if(!event){
    throw new NotFoundError()
  }
  res.status(200).send(event);

});

export { router as GetEventByIdRouter };
