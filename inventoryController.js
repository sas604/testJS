const { db } = require('./dbConnection');
const logger = require('./logger');

const removeFromInventory = async (item) => {
  const itemFromInventorty = await db('inventory')
    .select()
    .where({ itemName: item })
    .first();
  if (!itemFromInventorty || !itemFromInventorty.quantity > 0) {
    const err = new Error(`${item} is unavailable`);
    err.code = 400;
    throw err;
  }
  await db('inventory')
    .where({ id: itemFromInventorty.id })
    .update({ quantity: itemFromInventorty.quantity-- });
};

const addToInventory = async (item, n) => {
  if (typeof n !== 'number') throw new Error('Quantity must be a number');
  const itemFromDb = await db('inventory')
    .select()
    .where({ itemName: item })
    .first();
  if (!itemFromDb) {
    await db('inventory').insert({ itemName: item, quantity: n });
  } else {
    await db('inventory')
      .where({ id: itemFromDb.id })
      .update({ quantity: itemFromDb.quantity + n });
  }

  logger.logInfo(
    { item, n, memoryUsage: process.memoryUsage().rss },
    'Item added to the inventory'
  );
  return itemFromDb?.quantity || 0 + n;
};

const getInventory = async () => {
  const contentArray = await db('inventory').select();
  const contents = contentArray.reduce(
    (contents, { itemName, quantity }) => ({
      ...contents,
      [itemName]: quantity,
    }),
    {}
  );
  logger.logInfo({ contents }, 'Inventory items fetched');
  return {
    ...contents,
    generatedAt: new Date(new Date()),
  };
};

module.exports = {
  addToInventory,
  getInventory,
  removeFromInventory,
};
