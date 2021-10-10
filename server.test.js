const { app } = require('./server');
const { carts, addItemToCart } = require('./cartControler');
const { inventory } = require('./inventoryController');
const request = require('supertest');

describe('add items to cart', () => {
  test('adding available items', async () => {
    inventory.set('cheesecake', 3);
    const response = await request(app)
      .post('/carts/test_user/items/cheesecake')
      .send({ item: 'cheesecake', quantity: 3 })
      .expect(200)
      .expect('Content-Type', /json/);

    const newItems = ['cheesecake', 'cheesecake', 'cheesecake'];
    expect(response.body).toEqual(newItems);
    expect(inventory.get('cheesecake')).toEqual(0);
    expect(carts.get('test_user')).toEqual(newItems);
  });
});

afterAll(() => app.close());
