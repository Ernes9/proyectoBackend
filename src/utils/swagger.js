import __dirname from "./dirname.js";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "ECOMMERCE API",
      description: "Tienda de productos",
    },
  },
  apis: [__dirname + "/docs/*.yaml"],
};

export default options;
