const { removeFromInventory } = require('./inventoryController');
const logger = require('./logger');

const carts = new Map();

const addItemToCart = (username, item) => {
  removeFromInventory(item);
  const newItems = (carts.get(username) || []).concat(item);
  carts.set(username, newItems);
  logger.log(`${item} added to ${username}'s cart`);
  return newItems;
};

const compliesToLimit = (cart) => {
  const unitPerItem = cart.reduce((itemMap, itemName) => {
    const quantity = (itemMap[itemName] || 0) + 1;
    return { ...itemMap, [itemName]: quantity };
  }, {});

  return Object.values(unitPerItem).every((quantity) => quantity <= 3);
};

module.exports = { addItemToCart, carts, compliesToLimit };
