import React from 'react';

function AddItemModal(props) {
  return (
    <div className={`position-fixed modal-overlay w-100 h-100 ${props.showAddItemModal ? 'd-flex' : 'd-none'}`}>
      <div className="m-auto modal-text bg-white p-3">
        <div className="d-flex">
          <i className="fas fa-times ml-auto close-modal"
            onClick={() => props.toggleModal()}/>
        </div>
        <h4 className="text-center">{props.productName}</h4>
        <img src={props.productImage} className="modal-img mb-3"/>
        <h5 className="text-center">Item has been added to cart.</h5>
        <div className="btn-group w-100">
          <button className="btn btn-secondary w-100"
            onClick={() => props.viewCatalog()}>
              Keep Shopping
          </button>
          <button className="btn btn-primary w-100"
            onClick={() => props.viewCart()}>
              View Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddItemModal;
