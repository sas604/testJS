const Koa = require('koa');
const Router = require('koa-router');
const { addItemToCart } = require('./cartControler');

const app = new Koa();
const router = new Router();

router.get('/carts/:username/items', (ctx) => {
  const cart = carts.get(ctx.params.username);
  cart ? (ctx.body = cart) : (ctx.status = 404);
});

router.post('/carts/:username/items/:item', (ctx) => {
  try {
    const { username, item } = ctx.params;
    const newItems = addItemToCart(username, item);
    ctx.body = newItems;
  } catch (e) {
    ctx.body = { message: e.message };
    ctx.status = e.code;
    return;
  }
});

router.delete('/carts/:username/items/:item', (ctx) => {
  const { username, item } = ctx.params;
  if (!carts.has(username) || !carts.get(username).includes(item)) {
    ctx.body = { message: `${item} is not in the cart` };
    ctx.status = 400;
    return;
  }

  const newItems = (carts.get(username) || []).filter((i) => i !== item);
  inventory.set(item, (inventory.get(item) || 0) + 1);
  carts.set(username, newItems);
  ctx.body = newItems;
});

app.use(router.routes());

// This method is designed especifically for testability.
// Because we keep `carts` in memory, we must reset it back
// to its inital state by deleting all items in it.
// If you were dealing with a database, you'd have to do
// something similar in your tests by ensuring the database
// is reset to its initial state before each test.
const resetState = () => {
  carts = new Map();
};

module.exports = {
  app: app.listen(4000),
};
