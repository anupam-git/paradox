import { json } from "body-parser";
import * as Express from "express";
import * as Morgan from "morgan";

import { GetScriptsController } from "./controllers/get-scripts.controller";
import { RunScriptController } from "./controllers/run-script.controller";

export class Server {
  private host: string;
  private port: number;
  private expressApp: Express.Application;

  public constructor(host: string, port: number) {
    this.host = host;
    this.port = port;

    this.expressApp = Express();
    this.setupExpressApp();
    this.registerControllers();
  }

  public start() {
    this.expressApp
      .listen(this.port, this.host, () => {
        console.log(`Paradox Server Started on ${this.host}:${this.port}`);
      })
      .on("error", (err: any) => {
        if (err.code && err.code === "EADDRINUSE") {
          console.error(`Paradox Server already running on ${this.host}:${this.port}`);
        }
      });
  }

  private setupExpressApp() {
    this.expressApp.use(json());
    this.expressApp.use(Morgan("dev"));
  }

  private registerControllers() {
    this.expressApp.use("/getScripts", GetScriptsController.getInstance().getRouter());
    this.expressApp.use("/runScript", RunScriptController.getInstance().getRouter());
  }
}