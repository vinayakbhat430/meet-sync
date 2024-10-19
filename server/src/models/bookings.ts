import mongoose from "mongoose";

interface BookingsAttrs {
    eventId?:string;
    name: string;
    email:string;
    additionalInfo:string;
    startTime:Date;
    endTime:Date;
    slot:string[];
    attendees:string[];
    meetLink:string;
    googleEventId:string;
}

interface BookingsModel extends mongoose.Model<BookingsDoc> {
  build(attrs: BookingsAttrs): BookingsDoc;
}

export interface BookingsDoc extends mongoose.Document {
    eventId?:string;
    name: string;
    email:string;
    additionalInfo:string;
    startTime:Date;
    endTime:Date;
    slot:string[];
    attendees:string[]
    meetLink:string;
    googleEventId:string;
}

const bookingsSchema = new mongoose.Schema(
    {
        eventId: {
            type: String, 
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        additionalInfo: {
            type: String,
            default: "",
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        slot:[
            {
                type:String,
                required:true
            }
        ],
        attendees:[
            {
                type:String,
                required:true
            }
        ],
        meetLink: {
            type: String,
            required: true,
        },
        googleEventId: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);


bookingsSchema.statics.build = (attr: BookingsAttrs) => {
  return new Bookings(attr);
};

const Bookings = mongoose.model<BookingsDoc, BookingsModel>("Bookings", bookingsSchema);

export { Bookings };
