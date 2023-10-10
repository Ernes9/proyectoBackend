import { Router } from "express";
import { GETFakeProducts } from "../controllers/mocking.controller";

const mockingRouter = Router();

mockingRouter.get("/", GETFakeProducts)

export default mockingRouter;