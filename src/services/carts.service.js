import CartDAO from "../dao/mongo/cart.dao.js";
// import UserDAO from "../dao/mongo/user.dao.js";

const cartDAO = new CartDAO();
// const userDAO = new UserDAO();

export const getAllCarts = async () => {
  try {
    const carts = await cartDAO.find();
    const result = {
      error: false,
      msg: "¡Carritos encontrados!",
      info: carts,
    };
    return result;
  } catch (e) {
    const result = {
      error: true,
      msg: "Error, no se ha podido encontrar los carritos",
      info: e,
    };
    return result;
  }
};

export const getCartById = async (id) => {
  try {
    const cart = await cartDAO.getCartById(id);
    const result = {
      error: false,
      msg: "¡Carrito encontrado por ID!",
      info: cart,
    };
    return result;
  } catch (e) {
    const result = {
      error: true,
      msg: "Error, no se ha podido encontrar el carrito solicitado",
      info: e,
    };
    return result;
  }
};

export const postNewCart = async (req) => {
  try {
    const cart = await cartDAO.create();
    const result = { error: false, msg: "¡Carrito creado!", info: cart };
    // const user = await userDAO.findById(req.user.id)
    // user.cart._id = cart._id;
    // await user.save()
    return result;
  } catch (e) {
    const result = {
      error: true,
      msg: "Error, no se pudo crear el carrito",
      info: e,
    };
    return result;
  }
};

export const postAddProduct = async (cartId, productId) => {
  try {
    const cart = await cartDAO.getCartById(cartId);
    cart.products.push({ product: productId });
    await cartDAO.update(cart._id, cart);
    const cartUpdated = await cartDAO.getCartById(cart._id);
    const result = {
      error: false,
      msg: "¡Producto agregado al carrito!",
      update: cartUpdated,
    };
    return result;
  } catch (e) {
    const result = {
      error: true,
      msg: "Error, no se ha podido agregar el producto solicitado al carrito",
      info: e,
    };
    return result;
  }
};

export const deleteProduct = async (cartId, productId) => {
  try {
    const cart = await cartDAO.getCartById(cartId);
    const filter = cart.products.filter(
      (prods) => prods.product._id != productId
    );
    cart.products = filter;
    await cartDAO.update(cart._id, cart);
    const productRemoved = await cartDAO.getCartById(cart._id);
    const result = {
      error: false,
      msg: "Producto removido con éxito",
      update: productRemoved,
    };
    return result;
  } catch (e) {
    const result = {
      error: true,
      msg: "Error, no se ha podido remover el producto solicitado",
      info: e,
    };
    return result;
  }
};

export const DeleteCartById = async(cid)=>{
  try {
    const cartDeleted = await cartDAO.delete(cid);
    const result = {
      error: false,
      msg: "Carrito eliminado con éxito",
      update: cartDeleted,
    };
    return result
  } catch (e) {
    const result = {
      error: true,
      msg: "Error, no se ha podido eliminar el carrito solicitado",
      info: e,
    };
    return result
  }
}

export const deleteAllProducts = async (cartId) => {
  try {
    const cart = await cartDAO.getCartById(cartId);
    cart.products = [];
    await cartDAO.update(cart._id, cart);
    const cartEmpty = await cartDAO.getCartById(cart._id);
    const result = { error: false, msg: "Carrito vaciado", update: cartEmpty };
    return result;
  } catch (e) {
    const result = {
      error: true,
      msg: "Error, no se pudo vaciar el carrito",
      error: e,
    };
    return result;
  }
};

export const putQuantity = async (cartId, productId, newQuantity) => {
  try {
    const cart = await cartDAO.getCartById(cartId);
    const indexProduct = cart.products.findIndex(
      (prod) => prod.product._id == productId
    );

    const selectedProduct = cart.products.find(
      (prod) => prod.product._id == productId
    );

    selectedProduct.quantity = selectedProduct.quantity + newQuantity;
    cart.products[indexProduct] = selectedProduct;
    await cartDAO.update(cart._id, cart);
    const updatedCart = await cartDAO.getCartById(cart._id);
    const result = {
      error: false,
      msg: "¡Cantidad del producto actualizada!",
      info: updatedCart,
    };
    return result;
  } catch (e) {
    const result = {
      error: true,
      msg: "Error, no se pudo actualizar la cantidad del producto solicitado",
      info: e,
    };
    return result;
  }
};
