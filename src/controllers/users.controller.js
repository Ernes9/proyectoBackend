import UserDTO from "../dto/user.dto.js";
import * as UserService from "../services/users.service.js";


export const GETCurrentUser = async (req, res) => {
  let user = req.user;
  if (!user) return res.send("No existe usuario loggeado");
  user = new UserDTO(user)
  res.render("current", user);
};

export const GETUserById = async (req, res) => {
  const { uid } = req.params;
  const user = await UserService.getUserById(uid);
  res.send(user);
};
