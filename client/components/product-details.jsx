import React from 'react';

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null
    };
    this.viewCatalog = this.viewCatalog.bind(this);
  }

  componentDidMount() {
    const { productId } = this.props.viewProduct;
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(product => {
        this.setState({ product });
      })
      .catch(err => console.error(err));
  }

  viewCatalog() {
    this.props.viewCatalog('catalog', {});
  }

  render() {
    const { product } = this.state;
    return !product
      ? <h1>Loading</h1>
      : (
        <div className="container">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center pl-3">
                <i className="fas fa-chevron-left pb-3 mr-2"></i>
                <p
                  style={{ cursor: 'pointer' }}
                  onClick={this.viewCatalog}>
                  Back to catalog
                </p>
              </div>
              <div className="row">
                <img
                  alt=""
                  src={product.image}
                  className="col-lg-7 col-md-12"
                  style={{ objectFit: 'contain', height: '400px' }}
                />
                <div className="card-body col-lg-5 col-md-12">
                  <h2 className="card-title">
                    {product.name}
                  </h2>
                  <h5 className="card-subtitle text-muted pb-4">
                  ${(product.price / 100).toFixed(2)}
                  </h5>
                  <p className="card-text">
                    {product.shortDescription}
                  </p>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    {product.longDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

export default ProductDetails;
