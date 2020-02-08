import React from 'react';

function RemoveItemModal(props) {
  return (
    <div className={`position-fixed modal-overlay w-100 h-100 ${props.displayModal ? 'd-flex' : 'd-none'}`}>
      <div className="m-auto modal-text bg-white p-3">
        <h5 className="text-center">{props.name}</h5>
        <img src={props.image} className="modal-img mb-3" />
        <p className="text-center">Are you sure you want to remove this item?</p>
        <div className="btn-group w-100">
          <button className="btn btn-secondary w-100"
            onClick={() => props.toggleModal()}>
            Cancel
          </button>
          <button className="btn btn-primary w-100"
            onClick={() => props.deleteItem()}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemoveItemModal;
