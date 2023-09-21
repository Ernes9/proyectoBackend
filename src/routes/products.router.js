import { Router } from "express";
import * as ProductController from "../controllers/products.controller.js";

const productsApiRouter = Router();

productsApiRouter.get('/', ProductController.GETAllProducts);

productsApiRouter.get('/:id', ProductController.GETProductById)

productsApiRouter.post("/", ProductController.POSTNewProduct)

productsApiRouter.delete("/:id", ProductController.DELETEProductById)

productsApiRouter.put("/:id", ProductController.PUTUpdateProduct)

export default productsApiRouter;