import mongoose from "mongoose";
import { BookingsDoc } from "./bookings";

interface EventAttrs {
    title:string;
    description:string;
    duration: number;
    userId:string;
    isPrivate:string;
    bookings:BookingsDoc[]

}

interface EventModel extends mongoose.Model<EventDoc> {
  build(attrs: EventAttrs): EventDoc;
}

export interface EventDoc extends mongoose.Document {
    title:string;
    description:string;
    duration: number;
    userId:string;
    isPrivate:string;
    bookings:BookingsDoc[]
}

const eventSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration:{
    type:Number,
    required:true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  isPrivate:{
    type:Boolean,
    required:true,
  },
  bookings:[
    {
        type:String,
        ref:'Bookings',
        required:true
    }
  ]
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

eventSchema.statics.build = (attr: EventAttrs) => {
  return new Event(attr);
};

const Event = mongoose.model<EventDoc, EventModel>("Event", eventSchema);

export { Event };
