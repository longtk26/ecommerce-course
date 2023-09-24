import mongoose from "mongoose";
import { countConnect } from "../helpers/check.connect";
import config from "../configs/config.mongodb";

const {
  db: { host, port, name },
} = config;

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  private static instance: Database;

  private constructor() {
    this.connect();
  }

  public connect(type = "mongodb") {
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

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
export default instanceMongodb;
