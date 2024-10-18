import mongoose from "mongoose";
import { DaysDoc } from "./days";

interface AvailabilityAttrs {
  email: string;
  days: DaysDoc[];
}

interface UserModel extends mongoose.Model<AvailabilityDoc> {
  build(attrs: AvailabilityAttrs): AvailabilityDoc;
}

interface AvailabilityDoc extends mongoose.Document {
  email: string;
  days: DaysDoc[];
}

const availabilitySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    days: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Days',
        required: true,
      },
    ],
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

availabilitySchema.statics.build = (attr: AvailabilityAttrs) => {
  return new Availability(attr);
};

const Availability = mongoose.model<AvailabilityDoc, UserModel>("Availability", availabilitySchema);

export { Availability };
