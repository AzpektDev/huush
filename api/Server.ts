import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Server, ServerOptions } from "lambert-server";
import mongoose from "mongoose";
import path from "path";
import { Console } from "../util/Console";
import { registerRoutes } from "../util/TraverseDirectory";

dotenv.config();

export default class API extends Server {
  console: Console;

  constructor(opts?: Partial<ServerOptions>) {
    // @ts-ignore
    super({ ...opts, errorHandler: false, jsonBody: false });
    this.console = new Console();
  }

  async start() {
    // await mongoose.connect("mongodb://127.0.0.1:27017/gtfs").then(() => {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      this.console.log("Connected to MongoDB", "mongo", "green");
    });



    // const app = this.app;
    // const api = Router();

    // this.app = api;

    // api.use(Authorization);

    this.app
      .use(express.urlencoded({ extended: true }))
      .use(express.json())
      .use(cors());

    this.routes = await registerRoutes(this, path.join(__dirname, "routes", "/"));

    // 404 is not an error in express, so this should not be an error middleware
    // this is a fine place to put the 404 handler because its after we register the routes
    // and since its not an error middleware, our error handler below still works.
    // ^^^ From fosscord-server
    // api.use("*", (req: Request, res: Response) => {
    // res.status(404).json({
    // message: "404 endpoint not found",
    // code: 0,
    // });
    // });

    // this.app = app;

    //app.use("/__development", )
    //app.use("/__internals", )
    // app.use("/api/v1", api);
    // app.use("/api", api); // allow unversioned requests
    console.log("Starting API server...");

    await super.start();
  }
}