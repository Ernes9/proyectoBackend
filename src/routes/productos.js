import { Router } from "express";
import productManager from "../dao/mongo/productManager.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    let {limit} = req.query;
    try{
        const productos = await productManager.getProducts()
        if (productos.length === 0) {
            res.status(404).json({ error: 'No se encontraron productos' });
        } else { 
            if(limit){
                res.render("index", {prods: productos.slice(0, parseInt(limit))})
            } else {
                res.render("index", {prods: productos})
            }
        }
    } catch(e){
        res.status(502).json({error: true});    
    }
})

export default productsRouter;