const { carts, addItemToCart, compliesToLimit } = require('./cartControler');
const { inventory } = require('./inventoryController');
const fs = require('fs');

afterEach(() => inventory.clear());
afterEach(() => carts.clear());

describe('addItemToCart', () => {
  beforeEach(() => {
    fs.writeFileSync('/tmp/logs.out', '');
  });
  test('logging added items', () => {
    carts.set('test_user', 'cheesecake');
    inventory.set('cheesecake', 1);

    addItemToCart('test_user', 'cheesecake');
    const logs = fs.readFileSync('/tmp/logs.out', 'utf-8');
    expect(logs).toContain("cheesecake added to test_user's cart");
  });

  test('adding unavailable items to cart', () => {
    carts.set('test_user', []);
    inventory.set('cheesecake', 0);

    try {
      addItemToCart('test_user', 'cheesecake');
    } catch (e) {
      const expectedError = new Error(`cheesecake is unavailable`);
      expectedError.code = 400;

      expect(e).toEqual(expectedError);
    }
    expect(carts.get('test_user')).toEqual([]);
    expect.assertions(2);
  });
});

describe('compliesToItemLimit', () => {
  test('returns true for carts with no more than 3 items of a kind', () => {
    const cart = [
      'cheesecake',
      'cheesecake',
      'cheesecake',
      'almond brownie',
      'apple pie',
    ];
    expect(compliesToLimit(cart)).toBe(true);
  });
  test('returns false for carts with  more than 3 items of a kind', () => {
    const cart = [
      'cheesecake',
      'cheesecake',
      'cheesecake',
      'cheesecake',
      'almond brownie',
      'apple pie',
    ];
    expect(compliesToLimit(cart)).toBe(false);
  });
});
