import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { NotFoundError } from "../errors/not-found-error";
import { Event } from "../models/event";
import { NotAuthorizedError } from "../errors/not-authorized-error";


const router = express.Router();
router.delete("/api/events/:eventId", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;

  const { name, email, picture } = currentUser(authorizationToken);
  
  const eventId = req.params.eventId;

  const event = await Event.findById(eventId);

  if(!event){
    throw new NotFoundError()
  }

  if(event.email !== email){
    throw new NotAuthorizedError()
  }

  await event.deleteOne();


  res.status(204).send({});

});

export { router as DeleteEventsRouter };
