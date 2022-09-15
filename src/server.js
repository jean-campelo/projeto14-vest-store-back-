import "./setup.js"
import express from "express";
import cors from "cors";
import router from "./routes/routes.js";
import dotenv from "dotenv";

dotenv.config();

const server = express();
server.use(router);

server.use(cors());
server.use(express.json());

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
