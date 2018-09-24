import { NextFunction, Request, Response, Router } from "express";

import { IConfig } from "../../_shared/IConfig";
import { IController } from "../../_shared/IController";

export class GetScriptsController implements IController {
  private config: IConfig;
  private router: Router;

  public constructor(config: IConfig) {
    this.config = config;
    this.router = Router();

    this.rootGetHandler = this.rootGetHandler.bind(this);

    this.router.get("/", this.rootGetHandler);
  }

  public getRouter() {
    return this.router;
  }

  private rootGetHandler(req: Request, res: Response, next: NextFunction) {
    res.json(Object.keys(this.config.scripts));
  }
}