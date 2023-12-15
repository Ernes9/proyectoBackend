import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {});

authRouter.get("/callback", passport.authenticate("github", {
    failureRedirect: "/session/login"
  }),
  (req, res) => {
    const token = req.authInfo.token;
    const user = req.user;

    res.cookie("accessToken", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    req.session.user = user; 

    res.redirect("/productos")
  }
);
export default authRouter;