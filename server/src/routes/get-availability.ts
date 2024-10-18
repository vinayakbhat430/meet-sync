import express, { Request, Response } from "express";
import { currentUser } from "../middleware/current-user";
import { Days, DaysDoc } from "../models/days";
import { BadRequestError } from "../errors/bad-request-error";
import { Availability } from "../models/availability";
import { NotFoundError } from "../errors/not-found-error";


const router = express.Router();
router.get("/api/availability", async (req: Request, res: Response) => {
  const authorizationToken = req.headers.authorization;

  const { name, email, picture } = currentUser(authorizationToken);

  const availability = await Availability.findOne({
    email: email
  }).populate('days');

  if(!availability){
    throw new NotFoundError()
  }
  res.status(200).send(availability);

});

export { router as GetAvailabilityRouter };
