import React from 'react';

function WelcomeModal(props) {
  return (
    <div className={`position-fixed modal-overlay w-100 h-100 ${props.displayModal ? 'd-flex' : 'd-none'}`}>
      <div className="m-auto p-3">
        <div className="modal-text bg-white p-3">
          <h5 className="text-center">Welcome to Wicked Sales</h5>
          <p className="text-center">Wicked Sales is for demonstration purposes only.  Please know that no purchase will be made!  Personal information such as addresses, email or physical, and credit card numbers should not be used.</p>
          <div className="btn-group w-100">
            <button className="btn btn-primary w-100"
              onClick={() => props.hideWelcomeModal()}>
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeModal;
