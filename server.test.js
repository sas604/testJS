const { app } = require('./server');
const { carts } = require('./cartControler');
const { inventory } = require('./inventoryController');
const request = require('supertest');
const { users, hashPasswords } = require('./authenticationController');
const { db, closeConnection } = require('./dbConnection');

const user = 'test_user';
const password = 'test_password';
const validAuth = Buffer.from(`${user}:${password}`).toString('base64');
const authHeader = `Basic ${validAuth}`;
const createUser = () =>
  users.set(user, {
    email: 'test_user@example.com',
    passwordHash: hashPasswords(password),
  });

beforeEach(() => db('users').truncate());
afterAll(() => closeConnection());

describe('add items to cart', () => {
  beforeEach(createUser);
  test('adding available items', async () => {
    inventory.set('cheesecake', 3);
    const response = await request(app)
      .post('/carts/test_user/items/cheesecake')
      .set('authorization', authHeader)
      .send({ item: 'cheesecake', quantity: 3 })
      .expect(200)
      .expect('Content-Type', /json/);

    const newItems = ['cheesecake', 'cheesecake', 'cheesecake'];
    expect(response.body).toEqual(newItems);
    expect(inventory.get('cheesecake')).toEqual(0);
    expect(carts.get('test_user')).toEqual(newItems);
  });
});
describe('create accounts', () => {
  test('creating a new account', async () => {
    const response = await request(app)
      .put('/users/test_user')
      .send({ email: 'test_user@example.com', password: 'a_password' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual({
      message: 'test_user created successfuly.',
    });
    const user = await db('users')
      .select()
      .where({ username: 'test_user' })
      .first();
    expect(user).toEqual({
      id: 1,
      username: 'test_user',
      email: 'test_user@example.com',
      passwordHash: hashPasswords('a_password'),
    });
  });

  test('creating account with name alredy exists', async () => {
    await db('users').insert({
      username: 'test_user',
      email: 'test_user@example.com',
      passwordHash: hashPasswords('test_password'),
    });
    const response = await request(app)
      .put('/users/test_user')
      .send({ email: 'test_user@example.com', password: 'a_password' })
      .expect(409)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual({ message: `test_user alredy exists` });
  });
});

afterAll(() => app.close());
