import React from 'react';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      creditCard: '',
      shippingAddress: ''
    };
    this.showCatalog = this.showCatalog.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePaymentChange = this.handlePaymentChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handlePaymentChange(event) {
    this.setState({ creditCard: event.target.value });
  }

  handleAddressChange(event) {
    this.setState({ shippingAddress: event.target.value });
  }

  handleSubmit(event) {
    this.props.placeOrder(this.state);
    this.showCatalog();
    return event.preventDefault();
  }

  showCatalog() {
    this.props.setView('catalog', {});
  }

  render() {
    const { cart } = this.props;
    const total = cart.length === 0
      ? '0.00'
      : (cart.map(item => item.price).reduce((subTotal, price) => subTotal + price) / 100).toFixed(2);
    return (
      <React.Fragment>
        <h1 className="py-3">My Cart</h1>
        <h4 className="text-muted pb-5">Order Total: ${total}</h4>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name-input">Name:</label>
            <input
              required
              type="text"
              id="name-input"
              className="form-control"
              onChange={this.handleNameChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="credit-card-input">Credit Card:</label>
            <input
              required
              type="number"
              id="credit-card-input"
              className="form-control"
              onChange={this.handlePaymentChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="shipping-address-input">Shipping Address:</label>
            <textarea
              rows="5"
              required
              className="form-control"
              id=" shipping-address-input"
              onChange={this.handleAddressChange}>
            </textarea>
          </div>
          <div className="form-group">
            <div className="d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center">
                <i className="fas fa-chevron-left pb-3 mr-2"></i>
                <p
                  onClick={this.showCatalog}
                  style={{ cursor: 'pointer' }}>
                  Back to catalog
                </p>
              </div>
              <button
                type="submit"
                className="btn btn-primary">
                Place Order
              </button>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default CheckoutForm;
