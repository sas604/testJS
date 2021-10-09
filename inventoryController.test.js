const {
  inventory,
  addToInventory,
  getInventory,
  removeFromInventory,
} = require('./inventoryController');
const logger = require('./logger');
beforeEach(() => inventory.set('cheesecake', 0));
beforeAll(() => jest.spyOn(logger, 'logInfo').mockImplementation(jest.fn()));
afterEach(() => logger.logInfo.mockClear());

describe('addToInventory', () => {
  beforeEach(() => {
    jest.spyOn(process, 'memoryUsage').mockImplementation(() => {
      return { rss: 1223456, heapTotal: 1, heapUsed: 2, external: 3 };
    });
  });

  test('Logging new items', () => {
    jest.spyOn(logger, 'logInfo');
    addToInventory('cheesecake', 2);
    expect(logger.logInfo.mock.calls).toHaveLength(1);

    const [firstArg, secondArg] = logger.logInfo.mock.calls[0];
    expect(firstArg).toEqual({
      item: 'cheesecake',
      n: 2,
      memoryUsage: 1223456,
    });
    expect(secondArg).toEqual('Item added to the inventory');
  });
  test('cancels operation for invalid quantities', () => {
    expect(() => addToInventory('cheesecake', 'not a number')).toThrow();
    expect(inventory.get('cheesecake')).toBe(0);
    expect(Array.from(inventory.entries())).toHaveLength(1);
  });
});

describe('getInventory', () => {
  test('generatedAt in the past', () => {
    const result = getInventory();
    const currentTime = new Date(Date.now() + 1);
    expect(result.generatedAt).toBeBefore(currentTime);
  });
  test('logging fetches', () => {
    inventory.set('cheesecake', 2);
    getInventory('cheesecake', 2);
    expect(logger.logInfo.mock.calls).toHaveLength(1);
    const [firstArg, secondArg] = logger.logInfo.mock.calls[0];

    expect(firstArg).toEqual({ contents: { cheesecake: 2 } });
    expect(secondArg).toEqual('Inventory items fetched');
  });
});

describe('removeFromInventory', () => {
  test('removing unavailable item from inventory', () => {
    inventory.set('cheesecake', 0);
    try {
      removeFromInventory('cheesecake');
    } catch (e) {
      const expectedError = new Error(`cheesecake is unavailable`);
      expectedError.code = 400;

      expect(e).toEqual(expectedError);
    }
    expect(inventory.get('cheesecake')).toEqual(0);
    expect.assertions(2);
  });
});
