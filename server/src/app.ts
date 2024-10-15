
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middleware/error-handler';
import { UserRouter } from './routes/user';



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



app.all('*',async ()=>{
    throw new NotFoundError()
})


//error handler should be used in end after all the usage of routes else error handler wont work
app.use(errorHandler)


export { app };
