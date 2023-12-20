import { Router } from "express";
import CartDAO from "../dao/mongo/cart.dao.js";
import TicketModel from "../schemas/ticket.schema.js"

const cartRouter = Router()

const cartDao = new CartDAO();

cartRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    if (id === "null") return res.render("cart", null)
    const cart = await cartDao.getCartById(id)
    return res.render("cart", {cart})
})

// cartRouter.get("/:cid/ticket/:tid", async (req, res) => {
//     const cartId = req.params.cid;
//     const ticketId = req.params.tid;
//     const cart = await cartDao.getCartById(cartId)
//     const ticket = await TicketModel.findById(ticketId)
//     res.render("purchaseCompleted", {cart, ticket})
// })

export default cartRouter;