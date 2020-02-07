import React from 'react';
import AddItemModal from './confirmation-modal';

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      showAddItemModal: false
    };
    this.viewCart = this.viewCart.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.viewCatalog = this.viewCatalog.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
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

  viewCart() {
    this.props.viewCart('cart', {});
  }

  handleAdd() {
    const { product } = this.state;
    this.props.addToCart(product);
    this.toggleAddModal();
  }

  toggleAddModal() {
    this.setState({
      showAddItemModal: !this.state.showAddItemModal
    });
  }

  render() {
    const { product } = this.state;
    const { showAddItemModal } = this.state;
    return !product
      ? <h3 className="text-center">Loading...</h3>
      : (
        <>
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
                  <button
                    onClick={this.handleAdd}
                    className="btn btn-primary">
                  Add to Cart
                  </button>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    {product.longDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <AddItemModal
            viewCart={this.viewCart}
            productImage={product.image}
            viewCatalog={this.viewCatalog}
            toggleModal={this.toggleAddModal}
            showAddItemModal={showAddItemModal}
          />
        </>
      );
  }
}

export default ProductDetails;
