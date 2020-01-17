require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.get('/api/products', (req, res, next) => {
  const sql = `
    select "productId",
           "name",
           "price",
           "image",
           "shortDescription"
      from "products";
  `;
  db.query(sql)
    .then(response => res.json(response.rows))
    .catch(err => next(err));
});

app.get('/api/products/:productId', (req, res, next) => {
  const { productId } = req.params;
  const sql = `
    select *
      from "products"
     where "productId" = $1;
  `;
  db.query(sql, [productId])
    .then(result => {
      const product = result.rows[0];
      if (!product) {
        return next(new ClientError(`Cannot find product with Id ${productId}.`, 404));
      }
      return res.status(200).json(product);
    })
    .catch(err => next(err));
});

app.get('/api/cart', (req, res, next) => {
  const { cartId } = req.session;
  if (!cartId) {
    return res.status(200).send([]);
  }
  const sql = `
        select "c"."cartItemId",
          "c"."price",
          "c"."quantity",
          "p"."productId",
          "p"."image",
          "p"."name",
          "p"."shortDescription"
      from "cartItems" as "c"
      join "products" as "p" using ("productId")
    where "c"."cartId" = $1
  `;
  const params = [cartId];
  db.query(sql, params)
    .then(response => res.status(200).json(response.rows))
    .catch(err => next(err));
});

app.post('/api/cart', (req, res, next) => {
  const { productId } = req.body;
  if (productId > 0 && typeof parseInt(productId) === 'number') {
    const params = [productId];
    const sql = `
      select "price"
      from "products"
      where "productId" = $1`;

    db.query(sql, params)
      .then(result => {
        const products = result.rows;

        if (products.length === 0) {
          return Promise.reject(new ClientError('There are no products by that Id.', 400));
        } else if (req.session.cartId) {
          const { price } = products[0];
          const { cartId } = req.session;
          return { cartId, price };
        }
        const sql = `
          insert into "carts" ("cartId", "createdAt")
          values (default, default)
          returning "cartId"
        `;
        return (
          db.query(sql)
            .then(result => {
              const { cartId } = result.rows[0];
              const { price } = products[0];
              return { cartId, price };
            })
        );
      })
      .then(cart => {
        const { price, cartId } = cart;
        req.session.cartId = cartId;
        // check if cart already has an item with the productId, if it does increment instead of insert
        const checkifItemExistsQuery = `
          select * from "cartItems"
          where "cartId" = $1 and "productId" = $2;
        `;
        const checkParams = [cartId, productId];
        return (
          db.query(checkifItemExistsQuery, checkParams)
            .then(result => {
              if (result.rowCount === 0) {
                const sql = `
                insert into "cartItems" ("cartId", "productId", "price", "quantity")
                values ($1, $2, $3, $4)
                returning "cartItemId";
              `;
                const params = [cartId, productId, price, 1];
                return db.query(sql, params);
              } else {
                const sql = `
                update "cartItems"
                   set "quantity" = quantity + 1
                 where "cartId" = $1 and "productId" = $2
                 returning "cartItemId";
              `;
                const params = [cartId, productId];
                // this query doesn't return anything, what gives?
                return db.query(sql, params);
              }
            })
        );
      })
      .then(result => {
        const { cartItemId } = result.rows[0];
        const sql = `
          select "c"."cartItemId",
                 "c"."price",
                 "c"."quantity",
                 "p"."productId",
                 "p"."image",
                 "p"."name",
                 "p"."shortDescription"
            from "cartItems" as "c"
            join "products" as "p" using ("productId")
           where "c"."cartItemId" = $1
        `;
        const params = [cartItemId];
        db.query(sql, params)
          .then(result => {
            res.status(201).json(result.rows[0]);
          });
      })
      .catch(err => next(err));
  } else {
    return next(new ClientError('Product ID must be a positive integer.', 400));
  }
});

app.post('/api/orders', (req, res, next) => {
  const { cartId } = req.session;
  const { name, creditCard, shippingAddress } = req.body;
  if (!cartId) {
    return next(new ClientError('No cart exists for that order.', 400));
  } else if (!name || !creditCard || !shippingAddress) {
    return next(new ClientError('Order must include name, address and payment information.', 400));
  } else {
    const sql = `
      insert into "orders" ("cartId", "name", "creditCard", "shippingAddress")
      values ($1, $2, $3, $4)
      returning "orderId", "createdAt", "name", "creditCard", "shippingAddress";
    `;
    const params = [cartId, name, creditCard, shippingAddress];

    db.query(sql, params)
      .then(result => {
        delete req.session.cartId;
        const order = result.rows[0];
        res.status(201).json(order);
      })
      .catch(err => next(err));
  }
});

app.delete('/api/cart', (req, res, next) => {
  const { cartId } = req.session;
  const { cartItemId } = req.body;
  if (!cartItemId) {
    return next(new ClientError('Must include item\'s ID to delete item', 400));
  }
  const sql = `
    delete from "cartItems"
    where "cartId"     = $1
      and "cartItemId" = $2;
  `;
  const params = [cartId, cartItemId];
  db.query(sql, params)
    .then(response => {
      res.sendStatus(204);
    })
    .catch(err => next(err));
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
