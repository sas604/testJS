const { db, closeConnection } = require('./dbConnection');
const {
  addToInventory,
  getInventory,
  removeFromInventory,
} = require('./inventoryController');
const logger = require('./logger');
afterEach(() => db('inventory').truncate());
beforeAll(() => jest.spyOn(logger, 'logInfo').mockImplementation(jest.fn()));
afterEach(() => logger.logInfo.mockClear());
afterAll(() => closeConnection());

describe('addToInventory', () => {
  beforeEach(() => {
    jest.spyOn(process, 'memoryUsage').mockImplementation(() => {
      return { rss: 1223456, heapTotal: 1, heapUsed: 2, external: 3 };
    });
  });

  test('Logging new items', async () => {
    jest.spyOn(logger, 'logInfo');
    await addToInventory('cheesecake', 2);
    expect(logger.logInfo.mock.calls).toHaveLength(1);

    const [firstArg, secondArg] = logger.logInfo.mock.calls[0];
    expect(firstArg).toEqual({
      item: 'cheesecake',
      n: 2,
      memoryUsage: 1223456,
    });
    expect(secondArg).toEqual('Item added to the inventory');
  });
  test('cancels operation for invalid quantities', async () => {
    await db('inventory').insert({ itemName: 'cheesecake', quantity: 0 });
    await expect(
      addToInventory('cheesecake', 'not a number')
    ).rejects.toThrow();
    const inventory = await db('inventory')
      .select()
      .where({ itemName: 'cheesecake' })
      .first();
    expect(inventory.quantity).toBe(0);
  });
});

describe('getInventory', () => {
  beforeEach(
    async () =>
      await db('inventory').insert({ itemName: 'cheesecake', quantity: 3 })
  );
  test('generatedAt in the past', async () => {
    const result = await getInventory();
    const currentTime = new Date(Date.now() + 1);
    expect(result.generatedAt).toBeBefore(currentTime);
  });
  test('logging fetches', async () => {
    await getInventory();
    expect(logger.logInfo.mock.calls).toHaveLength(1);
    const [firstArg, secondArg] = logger.logInfo.mock.calls[0];
    expect(firstArg).toEqual({ contents: { cheesecake: 3 } });
    expect(secondArg).toEqual('Inventory items fetched');
  });
});

describe('removeFromInventory', () => {
  test('removing unavailable item from inventory', async () => {
    await db('inventory').insert({ itemName: 'cheesecake', quantity: 0 });
    try {
      await removeFromInventory('cheesecake');
    } catch (e) {
      const expectedError = new Error(`cheesecake is unavailable`);
      expectedError.code = 400;

      expect(e).toEqual(expectedError);
    }
    const itemQuantity = await db('inventory')
      .select()
      .where({ itemName: 'cheesecake' })
      .first();
    expect(itemQuantity.quantity).toBe(0);
    expect.assertions(2);
  });
});
