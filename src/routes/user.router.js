import { Router } from "express";
import * as UserController from "../controllers/users.controller.js";
import { isAuthenticated, isLogged } from "../utils/auth.middleware.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";
import { getUserByEmail, loginUser, registerUser } from "../services/users.service.js";
import UserDAO from "../dao/mongo/user.dao.js";
import transport from "../utils/mailing.js";

const userDao = new UserDAO()

const sessionRouter = Router();

sessionRouter.get("/login", isLogged, (req, res) => {
  res.render("login");
});

sessionRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user =
      await loginUser(email, password) ||
      email == "adminCoder@coder.com";
    if (!user) res.status(401).json({ message: "Credenciales inválidas." });
    console.log("cookie:", res.cookie)
    const userSession = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
    req.session.user = userSession;
    const token = generateToken({ sub: user._id, user: { email } });
    res.cookie("accessToken", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json({ message: "Inicio de sesión exitoso", redirectUrl: "../productos" });
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
    const { first_name, last_name, email, username, password } = req.body;
    const exists = await getUserByEmail(email);
    if (exists)
      return res
        .status(401)
        .json({ message: "El correo ya se asignó a otra cuenta" });
    let user = await registerUser({  
      first_name,
      last_name,
      username,
      email,
      password
    });

    delete user.password;
    delete user.salt;
    req.session.user = user;

    const token = generateToken({ sub: user._id, user: { email } });
    res.cookie("accessToken", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).redirect("../productos");
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

sessionRouter.get("/logout", isAuthenticated, async (req, res) => {
    req.session.destroy((er) => {
    res.status(200).redirect("/session/login");
  });
});

sessionRouter.get("/recoverPassword", async (req, res) => {
  res.render("recoverPassword")
})

sessionRouter.post("/recoverPassword", async (req,res) =>{
  const email = req.body.email
  const user = await userDao.findByEmail(email)
  if (!user) {
    return res.status(404).json({ status: 'error', error: 'User not found' });
  }
  try {
    await transport.sendMail({
      from: 'kathryne49@ethereal.email',
      to: email,
      subject: 'Reset your password',
      html: `<h1> Reset your password</h1>
        <hr>Debes resetear tu password haciendo click en el siguiente <a href="http://localhost:8080/sessions/resetPassword/:${email}" target="_blank">LINK</a>
        <hr>
        Saludos cordiales,<br>
        <b>The Coder e-commerce API Backend</b>`
    })
    res.json({
      status: 'success',
      message: `Email enviado con exito a ${email} para restablecer la contraseña`
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
  })
  }
})

sessionRouter.get("/resetpassword/:email", async (req, res) => {
  const email = req.params.email
  res.render("resetPassword", {email})
})

sessionRouter.post('/resetpassword/:email', async (req, res) => {
  try {
      const email = req.params.email
      const user = await userDao.findByEmail(email)
      const newPassword = req.body.newPassword;
      const passwordsMatch = await bcrypt.compareSync(newPassword, user.password);
      if (passwordsMatch) {
          return res.json({ status: 'error', message: 'No puedes usar la misma contraseña' });
      } 
      await userDao.findByIdAndUpdate(user._id, { password: createHash(newPassword) })
      res.render("Contraseña creada exitosamente!")
  } catch (err) {
      res.json({
          status: 'error',
          message: 'No se ha podido crear la nueva contraseña'
      })
  }
})

export default sessionRouter;
