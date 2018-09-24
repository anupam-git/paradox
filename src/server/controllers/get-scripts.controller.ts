import { NextFunction, Request, Response, Router } from "express";

export class GetScriptsController {
  public static getInstance() {
    if (this.instance === undefined) {
      this.instance = new GetScriptsController();
    }

    return this.instance;
  }
  private static instance: GetScriptsController;

  private router: Router;

  private constructor() {
    this.router = Router();

    this.router.get("/", this.rootGetHandler);
  }

  public getRouter() {
    return this.router;
  }

  private rootGetHandler(req: Request, res: Response, next: NextFunction) {
    res.json([
      "1",
      "2",
      "3",
      "Boom!!!"
    ]);
  }
}