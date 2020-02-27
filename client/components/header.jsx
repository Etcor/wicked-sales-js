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
            <div className="text-left ml-1 header-title">
              Wicked Sales
            </div>
          </div>
          <div onClick={viewCart} className="ml-auto cart-icon">
            {props.cartItemCount} items
            <i className="fas fa-shopping-cart ml-2"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
