import { Router } from "express";
import CartDAO from "../dao/mongo/cart.dao.js";

const cartRouter = Router()

const cartDao = new CartDAO();

cartRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const user = await cartDao.getCartById(id);
    console.log("USUARIO: ", user)
    res.render("cart", user)
})

export default cartRouter;