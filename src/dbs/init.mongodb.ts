import mongoose from "mongoose";
import { countConnect } from "../helpers/check.connect";
const connectString = process.env.MONGODB_CONNECT_STRING;

class Database {
  static instance: Database;

  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString!)
      .then(() => {
        countConnect();
        console.log("Connected to Mongo");
      })
      .catch(() => console.log("Error connecting to Mongo"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

export default instanceMongodb;
