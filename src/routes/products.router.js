import { Router } from "express";
import * as ProductController from "../controllers/products.controller.js";
import { isAdminOrPremium } from "../utils/auth.middleware.js";

const productsApiRouter = Router();

productsApiRouter.get('/', ProductController.GETAllProducts);

productsApiRouter.get('/:pid', ProductController.GETProductById)

productsApiRouter.post("/", ProductController.POSTNewProduct)

productsApiRouter.delete("/:pid", ProductController.DELETEProductById)

productsApiRouter.put("/:pid", ProductController.PUTUpdateProduct)

export default productsApiRouter;