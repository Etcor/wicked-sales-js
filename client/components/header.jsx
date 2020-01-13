import React from 'react';

function Header(props) {
  return (
    <header className="container-fluid bg-dark">
      <div className="row p-3">
        <div className="d-flex align-items-center pl-5">
          <i className="fas fa-dollar-sign text-light"></i>
          <div
            className="text-light ml-1">
            Wicked Sales
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
