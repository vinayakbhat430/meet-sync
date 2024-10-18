import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { Bookings } from "../models/bookings";

const router = express.Router();
router.post("/api/bookings", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;

  const { name, email, picture } = currentUser(authorizationToken);
  const body = req.body;

  const booking = Bookings.build(body);
  await booking.save()


  res.status(201).send(booking);
});

export { router as PostBookingRouter };
