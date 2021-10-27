const { addItem, data } = require('./inventoryController');

describe('addItem', () => {
  test('adding new items to the the inventory', () => {
    data.inventory = {};
    addItem('cheesecake', 5);
    expect(data.inventory.cheesecake).toBe(5);
  });
});
