import * as CartService from "../services/carts.service.js";

export const GETAllCarts = async (req, res) => {
  const carts = await CartService.getAllCarts();
  res.send(carts);
};

export const GETCartById = async (req, res) => {
  const { cid } = req.params;
  const cart = await CartService.getCartById(cid);
  res.send(cart);
};

export const POSTNewCart = async (req, res) => {
  const cart = await CartService.postNewCart();
  res.send(cart);
};

export const POSTAddProduct = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await CartService.postAddProduct(cid, pid);
  res.send(cart);
};

export const DELETERemoveProduct = async (req, res) => {
  const { cid, pid } = req.params;
  const status = await CartService.deleteRemoveProduct(cid, pid);
  res.send(status);
};

export const DELETEAllProducts = async (req, res) => {
  const { cid } = req.params;
  const status = await CartService.deleteAllProducts(cid);
  res.send(status);
};

export const PUTQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const newQuantity = req.body;
  const update = await CartService.putQuantity(cid, pid, newQuantity);
  res.send(update);
};