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

    const bookings = await Bookings.find({ googleEventId: bookingId });

    if (!bookings.length) {
      return res.status(404).send({ message: "Bookings not found" });
    }

    const updates = req.body;

    // Use Promise.all to handle the async saves in parallel
    const savePromises = bookings.map((booking) => {
      booking.name = updates.name || booking.name;
      booking.additionalInfo = updates.additionalInfo || booking.additionalInfo;
      return booking.save();
    });

    await Promise.all(savePromises);

    res.status(200).send(bookings);
  }
);

export { router as PatchBookingRouter };
