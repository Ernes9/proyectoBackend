import passport from "passport";
import GithubStrategy from "passport-github2"
import userManager from "../dao/mongo/userManager.js";
import jwt from 'passport-jwt'
import { SECRET } from "../utils/jwt.js";
import cookieExtractor from "../utils/cookieJWT.js";

const JWTStrategy = jwt.Strategy;


const InitLocalStrategy = () => {
  
  passport.use("github", new GithubStrategy(
        {
          clientID: "df0987077061235b5315",
          clientSecret: "4aebb044b075d3c6522dd7ae18887a44c9c17037",
          callbackURL: "http://localhost:8080/api/auth/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          console.log(profile);
          const username = profile._json.login;
          const user = await userManager.getUsuarioByUsername(username);
  
          if (user) return done(null, user);
  
          const userCreate = await userManager.createUser({
            first_name: profile._json.name?.split(" ")[0] ?? "",
            last_name: profile._json.name?.split(" ")[1] ?? "",
            username,
            email: profile._json.email ?? "",
            password: "",
            role:
              profile._json.email == "admincoder@coder.com" ? "admin" : "user",
          });
          done(null, userCreate);
        }
      )
    );

    passport.use('jwt', new JWTStrategy({
      jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: SECRET,
    }, async (payload, done) => {
      const user = await userManager.getUsuarioById(payload.sub)
      if(!user) return done("Credenciales no válidas!")
      done(null, user)
    }))
  
    passport.serializeUser((user, done) => {
      console.log(user);
      done(null, user._id);
    });
  
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await userManager.getUsuarioById(id);
        done(null, user);
      } catch (e) {
        done(null, false);
      }
    });
}

export default InitLocalStrategy;