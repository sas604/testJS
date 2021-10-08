const { db } = require('./dbConnection');

const createCart = (username) => {
  return db('carts').insert({ username });
};
const addItem = (cartId, itemName) => {
  return db('cart_items').insert({ cartId, itemName });
};

module.exports = {
  createCart,
  addItem,
};
