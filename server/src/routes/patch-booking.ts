import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { Bookings } from "../models/bookings"; // Import the Bookings model

const router = express.Router();

// PATCH route for updating a booking
router.patch(
  "/api/booking-update/:bookingId",
  async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const authorizationToken = req.headers.authorization;

    const { name, email, picture } = currentUser(authorizationToken);

    const booking = await Bookings.findById(bookingId);

    if (!booking) {
      return res.status(404).send({ message: "Booking not found" });
    }

    const updates = req.body;
    Object.assign(booking, updates);

    await booking.save();
    res.status(200).send(booking);
  }
);

export { router as PatchBookingRouter };
