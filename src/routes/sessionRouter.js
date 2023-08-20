import { Router } from "express";
import userManager from "../dao/mongo/userManager.js";
import { isAuthenticated, isLogged } from "../utils/auth.middleware.js";

const sessionRouter = Router()

sessionRouter.get("/login", isLogged, (req, res) => {
    res.render("login")
})

sessionRouter.post("/login", isLogged, async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userManager.validateUser(email, password) || email == "adminCoder@coder.com";
        if (!user) res.status(401).json({ message: 'Credenciales inválidas.' });
        const userSession = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        };
        req.session.user = userSession;
        res.status(200).redirect("../productos");
    } catch (e){
        console.log(e)
        res.status(500).json({ message: 'Error en el servidor '})
    }
});

sessionRouter.get("/register", (req, res) => {
    res.render("register")
})

sessionRouter.post("/register", async (req, res) => {
    try{
        console.log("Post en /register")
        console.log(req.body)
        const { first_name, last_name, email, username, password } = req.body;
        const exists = await userManager.getUsuarioByEmail(email);
        if (exists) return res.status(401).json({ message: 'El correo ya se asignó a otra cuenta' });
        let user = await userManager.createUser(first_name, last_name, username, email, password);
        console.log(user)

        delete user.password;
        delete user.salt;
        req.session.user = user;
        // console.log("Usuario", req.session.user)
        res.status(200).redirect("../productos");

    } catch(e) {
        console.log(e)
    }
})

sessionRouter.get("/logout", isAuthenticated, async (req, res) => {
    req.session.destroy((er) => {
        res.status(200).redirect("/session/login")
    });
  });

export default sessionRouter;