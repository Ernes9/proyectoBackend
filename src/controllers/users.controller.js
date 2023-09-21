import * as UserService from "../services/users.service.js";

export const GETCurrentUser = async (req, res) => {
  const user = req.user;
  if (!user) return res.send("No existe usuario loggeado");
  res.send({ user: user });
};

export const GETUserById = async (req, res) => {
  const { uid } = req.params;
  const user = await UserService.getUserById(uid);
  res.send(user);
};
