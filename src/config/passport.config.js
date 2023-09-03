import passport from "passport";
import GithubStrategy from "passport-github2"
import userManager from "../dao/mongo/userManager.js";

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
  
    passport.serializeUser((user, done) => {
      console.log(user);
      done(null, user.username);
    });
  
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await userManager.getUsuarioByUsername(id);
        done(null, user);
      } catch (e) {
        done(null, false);
      }
    });
}

export default InitLocalStrategy;