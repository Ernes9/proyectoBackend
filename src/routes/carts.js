import { Router } from "express";
import cartManager from "../dao/mongo/cartManager.js";
import productManager from "../dao/mongo/productManager.js";

const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
    try {
        const result = await cartManager.addCart();
        res.json({message: "carrito agregado", cart: result});
    } catch(e) {
        console.log(e);
        res.status(403).json({error: true})
    }
})

cartRouter.get("/", async (req, res) => {
    try {
      const carts = await cartManager.getCarts();
      if (carts) {
        res.json(carts);
      } else {
        res.status(404).json({ error: "No se encontraron carritos" });
      }
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: true });
    }
  });

cartRouter.get("/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const cartById = await cartManager.getCartById(id)
        const products = cartById.products;
        if (cartById){
            console.log(products)
            res.render('cart', {prods: products, id})
        }
        else{
            res.status(404).json({error: "No se encontró un carrito con ese ID"})
        }
    } catch (e) {
        console.log(e);
        res.status(403).json({error: true})
    }
})

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    try{
        const {cid, pid} = req.params;
        const foundCart = await cartManager.getCartById(cid);
        const foundProduct = await productManager.getProductById(pid);
        if (!foundCart && !foundProduct){
            res.status(404).json({error: true, message: "producto y carrito no encontrados!"})
        }
        else if (!foundCart){
            res.status(404).json({error: true, message: "carrito no encontrado!"})
        }
        else if (!foundProduct){
            res.status(404).json({error: true, message: "producto no encontrado!"})
        } else {
            const result = await cartManager.addProductInCart(cid, foundProduct)
            res.json({message: "producto añadido", result: result})
        }
    } catch (e) {
        console.log(e);
        res.status(403).json({error: true})
    }
})

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartManager.deleteProd(cid, pid);
        res.send(result);
      } catch (e) {
        res.status(502).send({ error: true });
      }
    });

cartRouter.delete('/:cid', async (req, res) => {
    try{
        const cid = req.params.cid;
        await cartManager.emptyCart(cid)
        res.json({deleted: true})
    } catch (e){
        res.status(502).send({error: true})
    }
})

cartRouter.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const prod = req.body;
    const updatedCart = await cartManager.updateCart(cid, prod);
    res.send(updatedCart);
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const updatedQuantity = await cartManager.updateQuantity(
        cid,
        pid,
        quantity
    );
    res.send(updatedQuantity);
});



export default cartRouter;