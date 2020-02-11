import React from 'react';
import Form from './form';

function CheckoutForm(props) {
  const { cart } = props;
  const total = cart.length === 0
    ? '0.00'
    : cart.map(item => item.price)
      .reduce((subTotal, price) => subTotal + price) / 100
      .toFixed(2);
  return (
    <>
      <div className="d-flex align-items-center">
        <a href="#" onClick={() => props.setView('catalog', {})}
        ><i className="fas fa-chevron-left pb-3 mr-2"/>
            Back to catalog
        </a>
      </div>
      <h1>My Cart</h1>
      <h4 className="text-muted pb-2">Order Total: ${total}</h4>
      <Form placeOrder={props.placeOrder}/>
    </>
  );
}

export default CheckoutForm;
