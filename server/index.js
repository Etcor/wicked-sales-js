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
        throw new ClientError(`Cannot find product with Id ${productId}.`, 404);
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
  const idIsValid = productId > 0 && typeof parseInt(productId) === 'number';
  if (idIsValid) {
    const params = [productId];
    const sql = `
      select "price"
      from "products"
      where "productId" = $1`;
    db.query(sql, params)
      .then(result => {
        const products = result.rows;
        if (products.length === 0) {
          throw new ClientError('There are no products by that Id.', 400);
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
        const doesItemExist = `
          select * from "cartItems"
          where "cartId" = $1 and "productId" = $2;
        `;
        const params = [cartId, productId];
        return (
          db.query(doesItemExist, params)
            .then(result => {
              if (result.rowCount === 0) {
                const sql = `
                insert into "cartItems" ("cartId", "productId", "price", "quantity")
                values ($1, $2, $3, 1)
                returning "cartItemId";
              `;
                const params = [cartId, productId, price];
                return db.query(sql, params);
              } else {
                const sql = `
                update "cartItems"
                   set "quantity" = "quantity" + 1
                 where "cartId" = $1 and "productId" = $2
                 returning "cartItemId";
              `;
                const params = [cartId, productId];
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
    return next(new ClientError('Product ID and quantity must be a positive integer.', 400));
  }
});

app.patch('/api/cart', (req, res, next) => {
  const { operand, cartItemId } = req.body;
  const hasValidOperand = operand === '+' || operand === '-';
  if (!cartItemId || !hasValidOperand) {
    return next(new ClientError('Must have a numeric Id and an operand to update cart.', 400));
  }
  let sql = '';
  if (operand === '+') {
    sql = `
    update "cartItems"
       set "quantity" = "quantity" + 1
     where "cartItemId" = $1
      returning *;
  `;
  } else if (operand === '-') {
    sql = `
    update "cartItems"
       set "quantity" = "quantity" - 1
     where "cartItemId" = $1
      returning *;
  `;
  }
  const params = [cartItemId];
  db.query(sql, params)
    .then(result => {
      const updatedItem = result.rows[0];
      if (!updatedItem) {
        throw new ClientError('There are no products in the cart by that Id.', 400);
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
           where "c"."cartItemId" = $1
        `;
      const params = [cartItemId];
      return (
        db.query(sql, params)
          .then(result => {
            res.status(200).json(result.rows[0]);
          })
      );
    })
    .catch(err => next(err));
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

app.post('/api/orders', (req, res, next) => {
  const { cartId } = req.session;
  const { fullName, email, phoneNumber, creditCard, expirationDate, cvv, shippingAddress } = req.body;
  if (!cartId) {
    return next(new ClientError('No cart exists for that order.', 400));
  } else if (!fullName || !email || !phoneNumber || !creditCard || !expirationDate || !cvv || !shippingAddress) {
    return next(new ClientError('Order must include a name, an email, a phone number, an address and payment information.', 400));
  } else {
    const sql = `
      insert into "orders" ("cartId", "fullName", "email", "phoneNumber", "creditCard", "expirationDate", "cvv", "shippingAddress")
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning "orderId";
    `;
    const params = [cartId, fullName, email, phoneNumber, creditCard, expirationDate, cvv, shippingAddress];

    db.query(sql, params)
      .then(result => {
        delete req.session.cartId;
        const order = result.rows[0];
        res.status(201).json(order);
      })
      .catch(err => next(err));
  }
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
