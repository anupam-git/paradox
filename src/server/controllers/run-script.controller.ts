import { NextFunction, Request, Response, Router } from "express";

import { exec, ExecException } from "child_process";
import { IConfig } from "../../_shared/IConfig";
import { IController } from "../../_shared/IController";

export class RunScriptController implements IController {
  private config: IConfig;
  private router: Router;

  public constructor(config: IConfig) {
    this.config = config;
    this.router = Router();

    this.rootPostHandler = this.rootPostHandler.bind(this);

    this.router.post("/:script", this.rootPostHandler);
  }

  public getRouter() {
    return this.router;
  }

  private rootPostHandler(req: Request, res: Response, next: NextFunction) {
    if (this.config.scripts[req.params.script]) {
      exec(this.config.scripts[req.params.script], (err: ExecException, stdout: string, stderr: string) => {
        if (req.query.waitForResponse) {
          res.json({
            status: "success",
            err,
            stdout,
            stderr
          });
        }
      });

      if (!req.query.waitForResponse) {
        res.json({
          status: "success"
        });
      }
    } else {
      res.json({
        status: "error",
        message: "Invalid Script"
      });
    }
  }
}