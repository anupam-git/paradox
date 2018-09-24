import * as Bcrypt from "bcrypt";
import { exec, ExecException } from "child_process";
import { NextFunction, Request, Response, Router } from "express";

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
      Bcrypt.compare(this.config.users[req.query.username], req.query.password, (cryptErr: Error, isMatch: boolean) => {
        if (this.config.users[req.query.username] && isMatch) {
          exec(this.config.scripts[req.params.script], (err: ExecException, stdout: string, stderr: string) => {
            if (req.query.waitForOutput) {
              res.json({
                status: "success",
                err,
                stdout,
                stderr
              });
            }
          });

          if (!req.query.waitForOutput) {
            res.json({
              status: "success"
            });
          }
        } else {
          res.json({
            status: "error",
            message: "Invalid Username and/or Password"
          });
        }
      });
    } else {
      res.json({
        status: "error",
        message: "Invalid Script"
      });
    }
  }
}