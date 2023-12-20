import { Router } from "express";
import ProductDAO from "../dao/mongo/product.dao.js";
import { isAdminOrPremium } from "../utils/auth.middleware.js";
import passport from "passport";

const productDAO = new ProductDAO()

const realTimeProductsRouter = Router();

realTimeProductsRouter.get("/", passport.authenticate("jwt", { session: false }), isAdminOrPremium, async (req, res) => {
    try{
        const userInfo = {
            email: req.user.email,
            role: req.user.role,
        };
        res.render("realTimeProducts", {userInfo})
    } catch(e){
        console.log(e)
        res.status(502).json({error: e});    
    }
})

export default realTimeProductsRouter;