import mongoose from "mongoose";

const connectDatabase = async (url: string) => {
  mongoose.set("strictQuery", false);

  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret.__v;
    },
  });

  await mongoose.connect(url);
};

export default connectDatabase;
