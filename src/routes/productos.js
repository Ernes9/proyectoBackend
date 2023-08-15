import { Router } from "express";
import ProductModel from "../schemas/product.schema.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    let {limit, page, query, sort} = req.query;
    let productos;
    try{
        productos = await ProductModel.paginate(query || {}, {
            lean: true,
            limit: limit ?? 10,
            page: page ?? 1,
            sort: sort

        })
        if (productos.length === 0) {
            res.status(404).json({ error: 'No se encontraron productos' });
        } else { 
            res.render("index", {prods: productos})
        }
    } catch(e){
        res.status(502).json({error: true});    
    }
})

export default productsRouter;