const Koa = require('koa');
const Router = require('koa-router');
const { addItemToCart } = require('./cartControler');
const bodyParser = require('koa-body-parser');
const {
  users,
  hashPasswords,
  authenticationMiddleware,
} = require('./authenticationController');

const app = new Koa();
const router = new Router();
app.use(bodyParser());

app.use(async (ctx, next) => {
  if (ctx.url.startsWith('/carts')) {
    return await authenticationMiddleware(ctx, next);
  }
  await next();
});

router.post('/carts/:username/items/:item', (ctx) => {
  const { username } = ctx.params;
  const { item, quantity } = ctx.request.body;

  for (let i = 0; i < quantity; i++) {
    try {
      const newItems = addItemToCart(username, item);
      ctx.body = newItems;
    } catch (e) {
      ctx.body = { message: e.message };
      ctx.status = e.code;
      return;
    }
  }
});
router.put('/users/:username', (ctx) => {
  const { username } = ctx.params;
  const { email, password } = ctx.request.body;
  const userAlredyExists = users.has(username);
  if (userAlredyExists) {
    ctx.body = { message: `${username} alredy exists` };
    ctx.status = 409;
    return;
  }

  users.set(username, { email, passwordHash: hashPasswords(password) });
  return (ctx.body = { message: `${username} created successfuly.` });
});
app.use(router.routes());

module.exports = {
  app: app.listen(4000),
};
