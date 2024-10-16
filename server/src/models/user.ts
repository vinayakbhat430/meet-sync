import mongoose from "mongoose";

interface UserAttrs {
    name:string,
    email:string,
    picture:string
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
    name:string,
    email:string,
    picture:string
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  picture:{
    type:String
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

userSchema.statics.build = (attr: UserAttrs) => {
  return new User(attr);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
