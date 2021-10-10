const Koa = require('koa');
const Router = require('koa-router');
const { addItemToCart } = require('./cartControler');
const bodyParser = require('koa-body-parser');

const app = new Koa();
const router = new Router();
app.use(bodyParser());

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

app.use(router.routes());

module.exports = {
  app: app.listen(4000),
};
