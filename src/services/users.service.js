import UserDAO from "../dao/mongo/user.dao.js";
import bcrypt from "bcrypt";

const userDAO = new UserDAO();

export const getUserById = async (userId) => {
  const user = await userDAO.findById(userId);
  return user;
};

export const getUserByName = async (username) => {
  const user = await userDAO.findByName(username);
  return user;
};

export const getUserByEmail = async (email) => {
  const user = await userDAO.findByEmail(email);
  return user;
};

export const registerUser = async (newUser) => {
  try {
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const register = await userDAO.create(newUser);
    return register;
  } catch {
    return false;
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await userDAO.findByEmail(email);
    if (!user) return false;
    const result = await bcrypt.compare(password, user.password);
    return result ? user.toObject() : false;
  } catch {
    return false;
  }
};