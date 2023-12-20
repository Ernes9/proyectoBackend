import * as CartService from "../services/carts.service.js";
import * as ProductService from "../services/products.service.js"
import TicketModel from "../schemas/ticket.schema.js";


export const GETAllCarts = async (req, res) => {
  const carts = await CartService.getAllCarts();
  res.status(200).json(carts);
};

export const GETCartById = async (req, res) => {
  const { cid } = req.params;
  const cart = await CartService.getCartById(cid);
  res.status(200).json(cart);
};

export const POSTNewCart = async (req, res) => {
  const cart = await CartService.postNewCart(req);
  res.status(200).json(cart);
};

export const POSTAddProduct = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await CartService.postAddProduct(cid, pid);
  res.status(200).json(cart);
};

export const DELETERemoveProduct = async (req, res) => {
  const { cid, pid } = req.params;
  const status = await CartService.deleteProduct(cid, pid);
  res.status(200).json(status);
};

export const DELETECartById= async (req, res) => {
  const { cid } = req.params;
  const deletedCart = await CartService.DeleteCartById(cid);
  res.status(200).json(deletedCart);
}

export const DELETEAllProducts = async (req, res) => {
  const { cid } = req.params;
  const status = await CartService.deleteAllProducts(cid);
  res.status(200).json(status);
};

export const PUTQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { newQuantity } = req.body;
  console.log("CANTIDAD: ", newQuantity)
  const update = await CartService.putQuantity(cid, pid, newQuantity);
  res.status(200).json(update);
};

// export const POSTPurchase = async (req, res) => {
//   try {
//     const { cid } = req.params;
//     const cart = await CartService.getCartById(cid);
//     console.log(cart)
//     if (!cart) {
//       res.status(404).json({ error: "Carrito no encontrado!" });
//     }

//     let totalAmount = 0;
//     const purchasedProducts = [];

//     const unprocessedProducts = cart.info.products.filter((item) => {
//       const product = item.product;
//       if (product.stock >= item.quantity) {
//         product.stock -= item.quantity;
//         totalAmount += product.price * item.quantity;
//         purchasedProducts.push(item);
//         return false;
//       } else {
//         return true;
//       }
//     });

//     if (unprocessedProducts.length > 0) {
//       res.status(400).json({ msg: "No se pudo completar la compra!" });
//     }

//     await Promise.all(
//       purchasedProducts.map(async (item) => {
//         const product = await ProductService.getProductById(item.product._id);
//         product.stock -= item.quantity;
//         await product.save();
//       })
//     );
//     const newTicket = await TicketModel.create({
//       code: Math.random().toString(36).substring(2, 10),
//       amount: totalAmount,
//       purchaser: req.user.email,
//     });
//     res.status(200).json({
//       msg: "Compra finalizada",
//       purchasedProducts,
//       ticket: newTicket,
//     });
//   } catch (e) {
//     res.status(500).json({ error: e });
//   }
// };

export const POSTPurchase = async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await CartService.getCartById(cid)
    console.log(cart)

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado!" });
  
    let unprocessedProducts = [];
    let purchasedProducts = [];
    let totalAmount = 0;

    try {
      cart.info.products.forEach(item => {
        const product = item.product;
        console.log(product)
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          totalAmount += product.price * item.quantity;
          purchasedProducts.push(item);
        } else {
          unprocessedProducts.push(item)
        }
      });
    } catch (error) {
      console.error(error); // Loggea el error completo
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    console.log("UNPROCESSED: " + unprocessedProducts + "dawmda")
    
    if (unprocessedProducts.length > 0) {
      return res.status(400).json({ msg: "No se pudo completar la compra!" });
    }

    await Promise.all(
      purchasedProducts.map(async (item) => {
        const result = await ProductService.getProductById(item.product._id);
        const product = result.product
        product.stock -= item.quantity;
        await product.save();
      })
    );

    const newTicket = await TicketModel.create({
      code: Math.random().toString(36).substring(2, 10),
      amount: totalAmount,
      purchaser: "NASHE",
    });

    res.status(200).json({
      msg: "Compra finalizada",
      purchasedProducts,
      ticket: newTicket,
    });

  } catch (error) {
    return res.status(500).json({ error });
  }
}

