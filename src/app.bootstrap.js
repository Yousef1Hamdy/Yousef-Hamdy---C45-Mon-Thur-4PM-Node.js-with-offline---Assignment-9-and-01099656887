import { port } from "../config/config.service.js";
import { globalErrorHandling } from "./common/utils/response/error.response.js";
import { authenticateDB } from "./DB/connection.db.js";
import {  noteRouter, userRouter } from "./modules/index.js";
import express from "express";

async function bootstrap() {
  const app = express();
  //convert buffer data
  app.use(express.json());
  // DB
  await authenticateDB();
  //application routing
  app.get("/", (req, res) => res.send("Hello World!"));
  // app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/note", noteRouter);

  //invalid routing
  app.use("{/*dummy}", (req, res) => {
    return res.status(404).json({ message: "Invalid application routing" });
  });

  //error-handling
  app.use(globalErrorHandling);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
export default bootstrap;
