import { Router } from "express";
import ProductModel from "../schemas/product.schema.js";
import UserDTO from "../dto/user.dto.js";
import passport from "passport";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    let {limit, page, query, sort} = req.query;
    let productos;
    let user = req.user || req.session.user;
    let isAdminOrPremium;
    console.log(user)
    if(user){
        isAdminOrPremium = user.role == "admin" || user.role == "premium"
        user = new UserDTO(user)
    }
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
            console.log("Sesion:", user)
            res.render("index", {prods: productos.docs, user: user, isAdminOrPremium})
        }
    } catch(e){
        res.status(502).json({error: true});    
    }
})

export default productsRouter;