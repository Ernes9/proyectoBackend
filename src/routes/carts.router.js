import { Router } from "express";
import * as CartController from "../controllers/carts.controller.js";
const cartRouter = Router();

cartRouter.post("/", CartController.POSTNewCart)

cartRouter.get("/", CartController.GETAllCarts);

cartRouter.get("/:id", CartController.GETCartById)

cartRouter.post("/:cid/product/:pid", CartController.POSTAddProduct)

cartRouter.delete('/:cid/product/:pid', CartController.DELETERemoveProduct);

cartRouter.delete('/:cid', CartController.DELETEAllProducts)

cartRouter.put("/:cid/product/:pid", CartController.PUTQuantity);

export default cartRouter;