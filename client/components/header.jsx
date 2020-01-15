import React from 'react';

function Header(props) {
  const viewCart = () => {
    props.viewCart('cart', {});
  };

  return (
    <header className="container-fluid bg-dark text-light mb-5">
      <div className="d-flex justify-content-between px-5 py-3">
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
    </header>
  );
}

export default Header;
