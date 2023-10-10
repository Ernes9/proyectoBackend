export const generateProductErrorInfo = (product) => {
  return `One or more properties were incomplete or not valid.
    * title        : needs to be a String, received ${product.title}
    * description  : needs to be a String, received ${product.description}
    * code         : needs to be a String, received ${product.code}
    * price        : needs to be a Number, received ${product.price}`;
};
