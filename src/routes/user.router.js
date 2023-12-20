import { Router } from "express";
import * as UserController from "../controllers/users.controller.js";
import { isAuthenticated, isLogged } from "../utils/auth.middleware.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";
import { getUserByEmail, loginUser, registerUser } from "../services/users.service.js";
import UserDAO from "../dao/mongo/user.dao.js";
import transport from "../utils/mailing.js";
import bcrypt from "bcrypt"
import UserModel from "../schemas/user.schema.js";


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
    const userSession = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
    req.session.user = userSession;
    req.session.role = userSession.role;
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
        <hr>Debes resetear tu password haciendo click en el siguiente <a href="http://localhost:8080/sessions/resetpassword/:${email}" target="_blank">LINK</a>
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
      console.log(user)
      let newPassword = req.body.newPassword;
      const passwordsMatch = await bcrypt.compareSync(newPassword, user.password);
      if (passwordsMatch) {
        return res.status(401).json({ status: 'error', message: 'No puedes usar la misma contraseña' });
      } 
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);
      await userDao.findByIdAndUpdate(user._id, { password: newPassword })
      res.status(200).send("Contraseña creada exitosamente!")
  } catch (err) {
      console.error(err)
      res.status(500).json({
          status: 'error',
          message: 'No se ha podido crear la nueva contraseña'
      })
  }
})

sessionRouter.get("/premium/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userDao.findById(id)
    if (user.role == "premium") {
      return res.status(401).render("role_changed", {message: "El usuario ya tiene el rol Premium"})
    }
    user.role = "premium"
    await user.save()
    return res.status(200).render("role_changed", {message: "El rol del usuario ha sido cambiado a Premium"})
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})


// Acá podría ponerlo para que solo se ejecute en entorno de DEVELOPMENT
sessionRouter.delete("/test/:id", async (req, res) => {
  // if (process.env.NODE_ENV === "production") {
  //   res.status(401).send("Acceso denegado");
  //   return;
  // }
  const { id } = req.params;
  try {
    const usuarioEliminado = await UserModel.findByIdAndDelete(id)
    res.status(200).json({
      message: "Usuario eliminado con exito",
      usuario: usuarioEliminado
    })
  } catch (error) {
    res.status(500).json({error: error})
  }
})

sessionRouter.get("/test/user/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const usuario = await UserModel.findOne({username: username})
    res.status(200).json({
      message: "Usuario encontrado!",
      usuario
    })
  } catch (error) {
    
  }
})

export default sessionRouter;
