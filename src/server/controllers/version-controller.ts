import { NextFunction, Request, Response, Router } from "express";
import { IController } from "../../_shared/IController";

export class VersionController implements IController {
  private router: Router;
  private version: string;

  public constructor(version: string) {
    this.router = Router();
    this.version = version;

    this.rootGetHandler = this.rootGetHandler.bind(this);

    this.router.get("/", this.rootGetHandler);
  }

  public getRouter() {
    return this.router;
  }

  private rootGetHandler(req: Request, res: Response, next: NextFunction) {
    res.json({
      version: this.version
    });
  }
}