import React from 'react';

function CartSummaryItems(props) {

  const price = (props.price / 100).toFixed(2);
  const deleteItem = () => {
    const { cartItemId } = props;
    props.deleteItem({ cartItemId });
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row">
          <img
            src={props.image}
            className="col-6"
            style={{ objectFit: 'contain', height: '300px' }}
          />
          <div className="card-body col-6 pt-5">
            <h3 className="card-title pt-4">
              {props.name}
            </h3>
            <h5 className="card-subtitle text-muted py-2">
              ${price}
            </h5>
            <p className="card-text">
              {props.shortDescription}
            </p>
            <p>Quantity: {props.quantity}</p>
            <button
              onClick={deleteItem}
              className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSummary(props) {

  const viewCart = () => {
    return props.cart.length === 0
      ? <h3 className="text-center text-muted">Your cart is empty.</h3>
      : props.cart.map(item => {
        return <CartSummaryItems deleteItem={props.deleteItem} key={item.cartItemId} {...item} />;
      });
  };

  const showCatalog = () => {
    props.setView('catalog', {});
  };

  const showCheckout = () => {
    props.setView('checkout', {});
  };

  const totalPrice = () => {
    if (props.cart.length === 0) {
      return '0.00';
    }
    const prices = props.cart.map(item => item.price * item.quantity);
    const total = prices.reduce((subTotal, price) => subTotal + price);
    const formatTotal = (total / 100).toFixed(2);
    return formatTotal;
  };

  const buttonIsActive = props.cart.length === 0 ? 'disabled' : '';

  return (
    <>
      <div className="d-flex align-items-center">
        <i className="fas fa-chevron-left pb-3 mr-2"></i>
        <p
          onClick={showCatalog}
          style={{ cursor: 'pointer' }}>
          Back to catalog
        </p>
      </div>
      <div className="d-flex justify-content-between align-items-center py-3">
        <h1 className="text-left">My Cart</h1>
        <h2 className="text-right">Total: ${totalPrice()}</h2>
      </div>
      {viewCart()}
      <div className="d-flex flex-row-reverse align-items-center py-3 ">
        <a
          onClick={showCheckout}
          style={{ cursor: 'pointer' }}
          className={`btn btn-primary text-white ${buttonIsActive}`}>
          Checkout
        </a>
      </div>
    </>
  );
}

export default CartSummary;
