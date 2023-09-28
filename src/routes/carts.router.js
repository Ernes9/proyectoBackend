import { Router } from "express";
import * as CartController from "../controllers/carts.controller.js";
import { isUser } from "../utils/auth.middleware.js";
import passport from "passport";
const cartRouter = Router();

cartRouter.post("/", CartController.POSTNewCart)

cartRouter.get("/", CartController.GETAllCarts);

cartRouter.get("/:id", CartController.GETCartById)

cartRouter.get("/:cid/purchase", passport.authenticate('local'), CartController.POSTPurchase)

cartRouter.post("/:cid/product/:pid", isUser, CartController.POSTAddProduct)

cartRouter.delete('/:cid/product/:pid', CartController.DELETERemoveProduct);

cartRouter.delete('/:cid', CartController.DELETEAllProducts)

cartRouter.put("/:cid/product/:pid", CartController.PUTQuantity);

export default cartRouter;