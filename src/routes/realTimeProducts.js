import { Router } from "express";
import productManager from "../dao/mongo/productManager.js";

const realTimeProductsRouter = Router();

realTimeProductsRouter.get("/", async (req, res) => {
    try{
        const productos = await productManager.getProducts()
        if (productos.length === 0) {
            res.status(404).json({ error: 'No se encontraron productos' });
        } else {
            res.render("realTimeProducts", {})
        }
    } catch(e){
        res.status(502).json({error: true});    
    }
})

export default realTimeProductsRouter;