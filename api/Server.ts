import express from "express";
// import fileUpload from "express-fileupload";
import { Server, ServerOptions } from "lambert-server";
import path from "path";
// import { Authorization } from "./middlewares/Authorization";
import { Console } from "./util/Console";
import { initDatabase } from "./util/Database";
import cors from "cors";
import { registerRoutes } from "./util/TraverseDirectory";

export class API extends Server {
  console: Console;

  constructor(opts?: Partial<ServerOptions>) {
    // @ts-ignore
    super({ ...opts, errorHandler: false, jsonBody: false });
    this.console = new Console();
  }

  async start() {
    await initDatabase();

    this.app
      // .use(Authorization)
      .use(express.urlencoded({ extended: true }))
      .use(cors())
      .use(express.json());

    this.routes = await registerRoutes(
      this,
      path.join(__dirname, "routes", "/")
    );

    this.app.use(function (req, res) {
      res.status(404).json({
        message: "404 Not Found",
        status: 404,
      });
    });
    this.app.use(function (req, res) {
      res.status(500).json({
        message: "500 Internal Server Error",
        status: 500,
      });
    });

    this.console.log("Starting API server...", "Server", "blue");

    return await super.start();
  }
}
