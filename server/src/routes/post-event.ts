import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { Event } from "../models/event";

const router = express.Router();
router.post("/api/events", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;

  const { name, email, picture } = currentUser(authorizationToken);
  const body = req.body;

  const event = Event.build(body);
  await event.save()

  const returnObj = await Event.findOne({email: email}).populate("bookings");

  res.status(201).send(returnObj);
});

export { router as PostEventRouter };
