import { NextFunction, Request, Response, Router } from "express";

export class RunScriptController {
  public static getInstance() {
    if (this.instance === undefined) {
      this.instance = new RunScriptController();
    }

    return this.instance;
  }
  private static instance: RunScriptController;

  private router: Router;

  private constructor() {
    this.router = Router();

    this.router.post("/:script", this.rootPostHandler);
  }

  public getRouter() {
    return this.router;
  }

  private rootPostHandler(req: Request, res: Response, next: NextFunction) {
    console.log(req.params.script);
    res.json({
      status: "success"
    });
  }
}