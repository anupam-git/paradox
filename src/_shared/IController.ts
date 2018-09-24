import { Router } from "express-serve-static-core";

export interface IController {
  getRouter(): Router;
}