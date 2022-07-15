import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DATABASE = process.env.MONGO_DATABASE;

let db = null;
const mongoClient = new MongoClient(MONGO_URI);

try {
  mongoClient.connect();

  db = mongoClient.db(DATABASE);
  console.log("MongoDB connected");
} catch (error) {
  console.log("MongoDB connection error");
  console.log(error);
}
export default db;