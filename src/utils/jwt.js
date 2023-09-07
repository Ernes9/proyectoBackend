import jwt from "jsonwebtoken";

export const SECRET = "ofn270amf7342hlp0860om8f92hfa";

export const generateToken = (object) =>
  jw.sign(object, SECRET, { expiresIn: "1hr" });

export const JWTMW = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).send({ msg: "Sin autorización" });

  const token = authHeader.split(" ")[1]
  try{
    const user = jwt.verify(token, SECRET);
    req.user = user.user;
    next()
  } catch (e){
    return res.status(403).send({ msg: "Sin autorización" });
  }
};


export const JWTCookieMW = (req, res, next) => {
    const token = req.cookies.accessToken;
    if(!token) return res.send({error: true})
    try{
        const valid = jwt.verify(token, SECRET)
        next()
    } catch (e){
        return res.send({error: true})
    }
}
