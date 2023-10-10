import { generateProduct } from "../utils/faker.js";

export const GETFakeProducts = (req, res) => {
  let products = [];
  for( i=0; i <= 100; i++ ){
    products.push(generateProduct())
  }
  res.status(200).json(products)
};
