import mongoose from "mongoose";

interface DaysAttrs {
    day:string;
    startTime:string;
    endTime:string;
}

interface DaysModel extends mongoose.Model<DaysDoc> {
  build(attrs: DaysAttrs): DaysDoc;
}

export interface DaysDoc extends mongoose.Document {
    day:string;
    startTime:string;
    endTime:string;
}

const daysSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  startTime:{
    type:String,
    required:true
  },
  endTime:{
    type:String,
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
