import { Router } from "express";
import CartDAO from "../dao/mongo/cart.dao.js";

const cartRouter = Router()

const cartDao = new CartDAO();

cartRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    if (id === "null") return res.render("cart", null)
    const cart = await cartDao.getCartById(id)
    return res.render("cart", {cart})
})

export default cartRouter;