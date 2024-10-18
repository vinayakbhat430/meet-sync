import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { Days, DaysDoc } from "../models/days";
import { BadRequestError } from "../errors/bad-request-error";
import { Availability } from "../models/availability";

const router = express.Router();
router.post("/api/availability", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;

  const { name, email, picture } = currentUser(authorizationToken);
  const body = req.body;

  const days = await Days.insertMany(body);
  const dayIds = days.map((d) => d.id);

  const availability = await Availability.findOne({ email: email }).populate("days");

  if (availability) {
    //update case
    availability.days.forEach(async (data) => {
      await Days.deleteOne({ id: data.id });
    });
    availability.days = dayIds;
    await availability.save();
  } else {
    //new case
    const newAvailability = Availability.build({
      email,
      days: dayIds,
    });
    await newAvailability.save();
  }

  const returnObj = await Availability.findOne({ email: email }).populate("days");

  res.status(201).send(returnObj);
});

export { router as PostAvailabilityRouter };
