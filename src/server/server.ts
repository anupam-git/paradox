import { json } from "body-parser";
import * as Express from "express";
import * as Morgan from "morgan";

import { IConfig } from "../_shared/IConfig";
import { GetScriptsController } from "./controllers/get-scripts.controller";
import { RunScriptController } from "./controllers/run-script.controller";

export class Server {
  private host: string;
  private port: number;
  private config: IConfig;
  private expressApp: Express.Application;

  public constructor(host: string, port: number, config: IConfig) {
    this.host = host;
    this.port = port;
    this.config = config;

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
    this.expressApp.use("/getScripts", new GetScriptsController(this.config).getRouter());
    this.expressApp.use("/runScript", new RunScriptController(this.config).getRouter());
  }
}