import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { NotFoundError } from "../errors/not-found-error";
import { Bookings } from "../models/bookings";

const router = express.Router();

router.get("/api/booked-slots/:email/:date", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;

  const { name, email: loggedInEmail, picture } = currentUser(authorizationToken);

  // Extract email and date from URL params
  const { email, date } = req.params;

  // Convert the provided date string into a JavaScript Date object for comparison
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setDate(endOfDay.getDate() + 1);
  endOfDay.setSeconds(endOfDay.getSeconds()-1); // End of the day

  // Find bookings that match both email and start date'
  console.log(startOfDay, endOfDay);
  const bookings = await Bookings.find({
    email: email,
    startTime: { $gte: startOfDay, $lte: endOfDay }
  });

  // Collect all slot arrays from matching bookings into a single array
  const slots = bookings && bookings.length ? bookings.flatMap(booking => booking.slot):[];

  res.status(200).send(slots);
});

export { router as GetBookedSlots };


