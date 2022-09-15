import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  await mongoClient.connect();
  console.log("Mongodb connected");
} catch (err) {
  console.log(err.message);
}

const db = mongoClient.db("vest-store");

export default db;
