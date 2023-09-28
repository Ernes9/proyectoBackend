import config from "../config/config.js";

export let ProductDAO;

switch (config.persistence) {
  case "MONGO":
    const {default: productsMongo} = await import("./mongo/product.dao.js");
    ProductDAO = productsMongo;
    break;
}
