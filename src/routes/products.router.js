import { Router } from "express";
import * as ProductController from "../controllers/products.controller.js";
import passport from "passport";

const productsApiRouter = Router();

productsApiRouter.get('/', ProductController.GETAllProducts);

productsApiRouter.get('/:id', ProductController.GETProductById)

productsApiRouter.post("/", passport.authenticate('local'),ProductController.POSTNewProduct)

productsApiRouter.delete("/:id", passport.authenticate('local'), ProductController.DELETEProductById)

productsApiRouter.put("/:id", passport.authenticate('local'), ProductController.PUTUpdateProduct)

export default productsApiRouter;