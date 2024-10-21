import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { Bookings } from "../models/bookings";
import { Event } from "../models/event";

interface Dashboard {
    name:string;
    email:string;
    picture:string;
    bookings:number;
    events:number;
}
const router = express.Router();
router.get("/api/dashboard", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;

  const { name, email, picture } = currentUser(authorizationToken);

  const dashboard:Dashboard = {
      email, name, picture,
      bookings: 0,
      events: 0
  };

  const bookings = await Bookings.find({
    email: email
  });

  dashboard['bookings'] =  bookings.length || 0

  const events = await Event.find({
    email:email
  });

  dashboard['events'] = events.length || 0
  res.status(200).send(dashboard);

});

export { router as GetDashboardRouter };
