import React from 'react';

function Item(props) {
  const price = (props.price / 100).toFixed(2);
  return (
    <div className="d-flex flex-column align-items-center mb-5 mx-auto">
      <h3>{props.name}</h3>
      <img src={props.image} alt={props.name} className="img-fluid confirmation-img py-2"/>
      <h4 className="mb-2">Price: ${price}</h4>
      <h5>Quantity: {props.quantity}</h5>
    </div>
  );
}

function OrderConfirmation(props) {
  return (
    <>
      <h1 className="mb-5">Your Order:</h1>
      <div className="row">
        <div className="col-8">
          <div className="row flex-column">
            {
              props.cart.map(item => {
                return <Item key={item.cartItemId} {...item}/>;
              })
            }
          </div>
        </div>
        <div className="col-4 d-flex flex-column">
          <h3 className="my-5 text-center">Thank you for your order, please visit us again!</h3>
          <div
            onClick={() => props.confirmOrder()}
            className="btn btn-primary mx-auto w-50">
            Continue Shopping
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderConfirmation;
