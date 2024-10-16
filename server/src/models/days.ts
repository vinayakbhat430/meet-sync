import mongoose from "mongoose";

interface DaysAttrs {
    availabilityId:string;
    day:string;
    startTime:string;
    endTime:string;
}

interface DaysModel extends mongoose.Model<DaysDoc> {
  build(attrs: DaysAttrs): DaysDoc;
}

export interface DaysDoc extends mongoose.Document {
    availabilityId:string;
    day:string;
    startTime:Date;
    endTime:Date;
}

const daysSchema = new mongoose.Schema({
    availabilityId: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  startTime:{
    type:mongoose.Schema.Types.Date,
    required:true
  },
  endTime:{
    type:mongoose.Schema.Types.Date,
    required:true
  }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

daysSchema.statics.build = (attr: DaysAttrs) => {
  return new Days(attr);
};

const Days = mongoose.model<DaysDoc, DaysModel>("Days", daysSchema);

export { Days };
