import mongoose from 'mongoose';
import {app} from './app';

const start = async () => {
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI Must be defined')
    }
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to mongo db')
    }
    catch(err){
        console.log(err)
    }
    app.listen(3000,()=>{
        console.log("listening -> server -> 3000");
    })
}
start();

