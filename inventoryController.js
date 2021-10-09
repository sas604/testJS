const logger = require('./logger');

const inventory = new Map();

const removeFromInventory = (item) => {
  if (!inventory.has(item) || !inventory.get(item) > 0) {
    const err = new Error(`${item} is unavailable`);
    err.code = 400;
    throw err;
  }
  inventory.set(item, inventory.get(item) - 1);
};

const addToInventory = (item, n) => {
  if (typeof n !== 'number') throw new Error('Quantity must be a number');
  const currentQuantity = inventory.get(item) || 0;
  const newQuantity = currentQuantity + n;
  inventory.set(item, newQuantity);
  logger.logInfo(
    { item, n, memoryUsage: process.memoryUsage().rss },
    'Item added to the inventory'
  );
  return newQuantity;
};

const getInventory = () => {
  const contentArray = Array.from(inventory.entries());
  const contents = contentArray.reduce(
    (contents, [name, quantity]) => ({ ...contents, [name]: quantity }),
    {}
  );
  logger.logInfo({ contents }, 'Inventory items fetched');
  return {
    ...contents,
    generatedAt: new Date(new Date()),
  };
};

module.exports = {
  inventory,
  addToInventory,
  getInventory,
  removeFromInventory,
};
