import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import UserDAO from "../dao/mongo/user.dao.js";
import jwt from "passport-jwt";
import { SECRET, generateToken } from "../utils/jwt.js";
import cookieExtractor from "../utils/cookieJWT.js";
import ENV_CONFIG from "./config.js";

const JWTStrategy = jwt.Strategy;
const LocalStrategy = local.Strategy;

const userDao = new UserDAO()

const InitLocalStrategy = () => {
  // passport.use(
  //   "github",
  //   new GithubStrategy(
  //     {
  //       clientID: "Iv1.7d2d60846fbe19d8",
  //       clientSecret: ENV_CONFIG.GITHUB_KEY,
  //       callbackURL: "http://localhost:8080/api/auth/callback",
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       console.log(profile);
  //       const username = profile._json.login;
  //       const user = await userDao.findByUsername(username);
        
  //       if (user) return done(null, user);

  //       const userCreate = await userDao.create({
  //         first_name: profile._json.name?.split(" ")[0] ?? "",
  //         last_name: profile._json.name?.split(" ")[1] ?? "",
  //         username,
  //         email: profile._json.email ?? "",
  //         password: "",
  //         role:
  //           profile._json.email == "admincoder@coder.com" ? "admin" : "user",
  //       });

  //       done(null, userCreate);
  //     }
  //   )
  // );
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.7d2d60846fbe19d8",
        clientSecret: ENV_CONFIG.GITHUB_KEY,
        callbackURL: "http://localhost:8080/api/auth/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const username = profile._json.login;
          let user = await userDao.findByUsername(username);

          if (!user) {
            // Crea un nuevo usuario si no existe
            user = await userDao.create({
              first_name: profile._json.name?.split(" ")[0] ?? "",
              last_name: profile._json.name?.split(" ")[1] ?? "",
              username,
              email: profile._json.email ?? "",
              password: "",
              role: profile._json.email == "admincoder@coder.com" ? "admin" : "user",
            });
          }

          const token = generateToken({ sub: user._id, user: { email: user.email } });

          done(null, user, { token });
        } catch (error) {
          done(error);
        }
      }
    )
  );
  

  passport.use(
    "local",
    new LocalStrategy({usernameField:"email"}, (email, password, done) => {
      console.log(email + " " + password)
      if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        return done(null, { email, role: "admin" });
      } else {
        return done(null, false, { message: "No tiene permisos!" });

      }
    })
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET,
      },
      async (payload, done) => {
        const user = await userDao.findById(payload.sub);
        if (!user) return done("Credenciales no válidas!");
        done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userDao.findById(id);
      done(null, user);
    } catch (e) {
      done(null, false);
    }
  });
};

export default InitLocalStrategy;
