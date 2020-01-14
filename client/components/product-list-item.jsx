import React from 'react';

function ProductListItem(props) {
  const price = (props.price / 100).toFixed(2);

  const handleClick = () => {
    props.viewDetails('details', {
      productId: props.productId
    });
  };

  return (
    <div
      className="card"
      onClick={handleClick}
      style={{ height: '100%', cursor: 'pointer' }}>
      <img
        alt=""
        src={props.image}
        className="card-img-top"
        style={{ objectFit: 'contain', height: '300px' }}
      />
      <div className="card-body">
        <h5 className="card-title">
          {props.name}
        </h5>
        <h6 className="card-subtitle text-muted pb-2">
            ${price}
        </h6>
        <p className="card-text">
          {props.shortDescription}
        </p>
      </div>
    </div>
  );
}

export default ProductListItem;
