
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middleware/error-handler';
import { UserRouter } from './routes/user';
import { PostAvailabilityRouter } from './routes/post-availablity';
import { GetAvailabilityRouter } from './routes/get-availability';
import { GetEventsRouter } from './routes/get-events';
import { PostEventRouter } from './routes/post-event';
import { GetBookingsRouter } from './routes/get-bookings';
import { PostBookingRouter } from './routes/post-bookings';
import { DeleteEventsRouter } from './routes/delete-event';
import { GetEventByIdRouter } from './routes/get-event-byID';
import { GetBookedSlots } from './routes/get-booked-slots';
import { DeleteBookingsRouter } from './routes/delete-booking';
import { GetDashboardRouter } from './routes/get-dashboard';
import { PatchBookingRouter } from './routes/patch-booking';



const app = express()
app.set('trust proxy',true)

app.use(express.json())

app.use(
    cookieSession({
        signed:false,
        secure:process.env.NODE_ENV !== 'test'
    })
)

app.use(UserRouter);
app.use(PostAvailabilityRouter);
app.use(GetAvailabilityRouter);
app.use(GetEventsRouter);
app.use(PostEventRouter);
app.use(GetEventByIdRouter);
app.use(DeleteEventsRouter);
app.use(GetBookingsRouter);
app.use(PostBookingRouter);
app.use(GetBookedSlots);
app.use(DeleteBookingsRouter);
app.use(GetDashboardRouter);
app.use(PatchBookingRouter);



app.all('*',async ()=>{
    throw new NotFoundError()
})


//error handler should be used in end after all the usage of routes else error handler wont work
app.use(errorHandler)


export { app };
