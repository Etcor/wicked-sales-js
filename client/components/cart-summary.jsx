import React from 'react';
import RemoveItemModal from './remove-item-modal';

class CartSummaryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeleteModal: false
    };
    this.deleteItem = this.deleteItem.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
  }

  deleteItem() {
    const { cartItemId } = this.props;
    this.props.deleteItem({ cartItemId });
  }

  handleQuantityChange(operand) {
    const { cartItemId } = this.props;
    if (this.props.quantity === 1 && operand === '-') {
      return this.showDeleteModal();
    }
    this.props.updateQuantity(cartItemId, operand);
  }

  showDeleteModal() {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  }

  render() {
    const price = (this.props.price / 100).toFixed(2);
    return (
      <>
        <div className="card mb-3">
          <div className="row border bg-white rounded item-card p-3">
            <div className="d-flex justify-content-between w-100">
              <h3 className="card-title">{this.props.name}</h3>

            </div>
            <img
              src={this.props.image}
              className="col-md-4"
              style={{ objectFit: 'contain', maxHeight: '250px' }}
            />
            <div className="col-md-8 m-auto">
              <h4 className="text-muted">
                ${price}
              </h4>
              <p className="card-text">
                {this.props.shortDescription}
              </p>
              <div className="d-flex">
                <h5 className="my-auto">Quantity:</h5>
                <div className="d-flex btn-grp mx-3 my-auto border border-dark">
                  <div className="btn btn-light" onClick={() => this.handleQuantityChange('-')}>
                    <i className="fas fa-minus"/>
                  </div>
                  <div className="d-flex px-3">
                    <h5 className="m-auto">{this.props.quantity}</h5>
                  </div>
                  <div className="btn btn-light" onClick={() => this.handleQuantityChange('+')}>
                    <i className="fas fa-plus" />
                  </div>
                </div>
                <div onClick={this.showDeleteModal} className="btn btn-danger ml-auto">Delete</div>
              </div>
            </div>
          </div>
        </div>
        <RemoveItemModal
          {...this.props}
          deleteItem={this.deleteItem}
          toggleModal={this.showDeleteModal}
          displayModal={this.state.showDeleteModal}
        />
      </>
    );
  }
}

function CartSummary(props) {

  const viewCart = () => {
    return props.cart.length === 0
      ? <h3 className="text-center text-muted">Your cart is empty.</h3>
      : props.cart.map(item => {
        return <CartSummaryItem updateQuantity={props.updateQuantity} deleteItem={props.deleteItem} key={item.cartItemId} {...item} />;
      });
  };

  const showCatalog = () => {
    props.setView('catalog', {});
  };

  const showCheckout = () => {
    props.setView('checkout', {});
  };

  const totalPrice = () => {
    if (props.cart.length === 0) {
      return '0.00';
    }
    const prices = props.cart.map(item => item.price * item.quantity);
    const total = prices.reduce((subTotal, price) => subTotal + price);
    const formatTotal = (total / 100).toFixed(2);
    return formatTotal;
  };

  const buttonIsActive = props.cart.length === 0 ? 'disabled' : '';

  return (
    <>
      <div className="d-flex align-items-center">
        <i className="fas fa-chevron-left pb-3 mr-2"></i>
        <p
          onClick={showCatalog}
          style={{ cursor: 'pointer' }}>
          Back to catalog
        </p>
      </div>
      <h1 className="mb-3">My Cart</h1>
      {viewCart()}
      <div className="d-flex justify-content-between">
        <h2 className="text-right">Total: ${totalPrice()}</h2>
        <a
          onClick={showCheckout}
          style={{ cursor: 'pointer' }}
          className={`btn btn-primary text-white my-auto ${buttonIsActive}`}>
          Checkout
        </a>
      </div>
    </>
  );
}

export default CartSummary;
