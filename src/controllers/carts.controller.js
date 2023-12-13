import * as CartService from "../services/carts.service.js";

export const GETAllCarts = async (req, res) => {
  const carts = await CartService.getAllCarts();
  res.json(carts);
};

export const GETCartById = async (req, res) => {
  const { cid } = req.params;
  const cart = await CartService.getCartById(cid);
  res.json(cart);
};

export const POSTNewCart = async (req, res) => {
  const cart = await CartService.postNewCart();
  res.json(cart);
};

export const POSTAddProduct = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await CartService.postAddProduct(cid, pid);
  res.json(cart);
};

export const DELETERemoveProduct = async (req, res) => {
  const { cid, pid } = req.params;
  const status = await CartService.deleteProduct(cid, pid);
  res.json(status);
};

export const DELETEAllProducts = async (req, res) => {
  const { cid } = req.params;
  const status = await CartService.deleteAllProducts(cid);
  res.json(status);
};

export const PUTQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const newQuantity = req.body;
  const update = await CartService.putQuantity(cid, pid, newQuantity);
  res.json(update);
};

export const POSTPurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartService.getCartById(cid);
    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado!" });
    }

    let totalAmount = 0;
    const purchasedProducts = [];

    const unprocessedProducts = cart.products.filter((item) => {
      const product = item.product;
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        totalAmount += product.price * item.quantity;
        purchasedProducts.push(item);
        return false;
      } else {
        return true;
      }
    });

    if (purchasedProducts.length == 0) {
      res.status(400).json({ msg: "No se pudo completar ninguna compra!" });
    }

    await Promise.all(
      purchasedProducts.map(async (item) => {
        const product = await ProductModel.findById(item.product._id);
        product.stock -= item.quantity;
        await product.save();
      })
    );
    const newTicket = await Ticket.create({
      code: Math.random().toString(36).substring(2, 10),
      amount: totalAmount,
      purchaser: req.user.email,
    });
    res.status(200).json({
      msg: "Compra finalizada",
      purchasedProducts,
      unprocessedProducts,
      ticket: newTicket,
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};
