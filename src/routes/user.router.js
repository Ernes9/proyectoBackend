import { Router } from "express";
import * as UserController from "../controllers/users.controller.js";
import userManager from "../dao/mongo/user.dao.js";
import { isAuthenticated, isLogged } from "../utils/auth.middleware.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";
import { getUserByEmail, loginUser, registerUser } from "../services/users.service.js";

const sessionRouter = Router();

sessionRouter.get("/login", isLogged, (req, res) => {
  res.render("login");
});

sessionRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user =
      loginUser(email, password) ||
      email == "adminCoder@coder.com";
    if (!user) res.status(401).json({ message: "Credenciales inválidas." });
    const token = generateToken({ sub: user._id, user: { email } });
    res.cookie("accessToken", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const userSession = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
    req.session.user = userSession;
    res.status(200).redirect("../productos");
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error en el servidor " });
  }
});

sessionRouter.get("/current", passport.authenticate("jwt", { session: false }), UserController.GETCurrentUser);

sessionRouter.get("/register", isLogged, (req, res) => {
  res.render("register");
});

sessionRouter.post("/register", async (req, res) => {
  try {
    console.log("Post en /register");
    console.log(req.body);
    const { first_name, last_name, email, username, password } = req.body;
    const exists = await getUserByEmail(email);
    if (exists)
      return res
        .status(401)
        .json({ message: "El correo ya se asignó a otra cuenta" });
    let user = await registerUser(
      first_name,
      last_name,
      username,
      email,
      password
    );
    console.log(user);

    delete user.password;
    delete user.salt;
    req.session.user = user;
    res.status(200).redirect("../productos");
  } catch (e) {
    console.log(e);
  }
});

sessionRouter.get("/logout", isAuthenticated, async (req, res) => {
  req.session.destroy((er) => {
    res.status(200).redirect("/session/login");
  });
});

export default sessionRouter;
