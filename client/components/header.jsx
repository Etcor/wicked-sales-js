import React from 'react';

function Header(props) {
  const viewCart = () => {
    props.viewCart('cart', {});
  };

  return (
    <div className="bg-dark py-3 sticky-top header">
      <div className="container">
        <div className="d-flex justify-content-between text-light">
          <div className="d-flex align-items-center">
            <i className="fas fa-dollar-sign text-light"></i>
            <div
              className="text-left ml-1"
              style={{ fontSize: '1.1em' }}>
              Wicked Sales
            </div>
          </div>
          <div
            onClick={viewCart}
            className="text-right"
            style={{ cursor: 'pointer' }}>
            {props.cartItemCount} items
            <i className="fas fa-2x fa-shopping-cart ml-2"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
