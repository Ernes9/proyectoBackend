import { Router } from "express";
import * as CartController from "../controllers/carts.controller.js";
import { userOrPremium } from "../utils/auth.middleware.js";
import passport from "passport";
const cartRouter = Router();


cartRouter.post("/",userOrPremium, passport.authenticate('jwt', { session: true }), CartController.POSTNewCart)

cartRouter.get("/", CartController.GETAllCarts);

cartRouter.get("/:cid", CartController.GETCartById)

cartRouter.post("/:cid/purchase", CartController.POSTPurchase)

cartRouter.post("/:cid/product/:pid", CartController.POSTAddProduct)

cartRouter.delete('/:cid/product/:pid', CartController.DELETERemoveProduct);

cartRouter.delete('/:cid', CartController.DELETEAllProducts)

cartRouter.delete("/test/:cid", CartController.DELETECartById);

cartRouter.put("/:cid/product/:pid", CartController.PUTQuantity);

export default cartRouter;