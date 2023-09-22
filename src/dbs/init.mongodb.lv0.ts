import mongoose from "mongoose";

const connectString = process.env.MONGODB_CONNECT_STRING;

mongoose
  .connect(connectString!)
  .then(() => console.log("Connected to Mongo"))
  .catch(() => console.log("Error connecting to Mongo"));

export default mongoose;
