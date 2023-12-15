import { Router } from "express";
import ProductModel from "../schemas/product.schema.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    let {limit, page, query, sort} = req.query;
    let productos;
    console.log(req.cookies)
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
            console.log("Sesion:", req.session.user)
            res.render("index", {prods: productos.docs, user: req.session.user})
        }
    } catch(e){
        res.status(502).json({error: true});    
    }
})

export default productsRouter;