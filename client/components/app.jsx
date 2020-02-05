import React from 'react';
import Header from './header';
import CartSummary from './cart-summary';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CheckoutForm from './checkout-form';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: {
        name: 'catalog',
        params: {}
      },
      cart: []
    };
    this.setView = this.setView.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.deleteFromCart = this.deleteFromCart.bind(this);
  }

  componentDidMount() {
    this.getCartItems();
  }

  getCartItems() {
    fetch('/api/cart')
      .then(res => res.json())
      .then(cart => {
        this.setState({ cart });
      });
  }

  addToCart(product) {
    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
      .then(result => {
        const cart = [...this.state.cart];
        const productIds = cart.map(item => item.productId);
        if (productIds.includes(result.productId)) {
          cart.map((item, index) => {
            if (item.productId === result.productId) {
              cart[index] = result;
            }
          });
          return this.setState({ cart });
        }
        return this.setState({ cart: [...cart, result] });
      })
      .catch(err => console.error(err));
  }

  deleteFromCart(itemId) {
    const { cartItemId } = itemId;
    fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemId)
    })
      .then(res => {
        const cart = this.state.cart.filter(item => item.cartItemId !== cartItemId);
        this.setState({ cart });
      })
      .catch(err => console.error(err));
  }

  placeOrder(orderDetails) {
    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderDetails)
    })
      .then(res => res.json())
      .then(() => {
        this.setState({
          view: { name: 'catalog', params: {} },
          cart: []
        });
      })
      .catch(err => console.error(err));
  }

  setView(name, params) {
    this.setState({ view: { name, params } });
  }

  findItemCountInCart() {
    const { cart } = this.state;
    if (cart.length) {
      return cart
        .map(item => item.quantity)
        .reduce((totalItems, item) => totalItems + item);
    }
    return 0;
  }

  renderView() {
    const { view: { name, params }, cart } = this.state;
    const renderViews = {
      catalog: <ProductList
        viewDetails={this.setView}/>,
      details: <ProductDetails
        viewProduct={params}
        viewCatalog={this.setView}
        addToCart={this.addToCart}/>,
      cart: <CartSummary
        cart={cart}
        setView={this.setView}
        deleteItem={this.deleteFromCart}/>,
      checkout: <CheckoutForm
        cart={cart}
        setView={this.setView}
        placeOrder={this.placeOrder}/>
    };
    return renderViews[name];
  }

  render() {
    const itemsInCart = this.findItemCountInCart();
    return (
      <React.Fragment>
        <div
          className="container-fluid bg-light p-0"
          style={{ height: '100vh', overflow: 'auto' }}>
          <Header
            viewCart={this.setView}
            cartItemCount={itemsInCart}
          />
          <div className="container">
            { this.renderView() }
          </div>
        </div>
      </React.Fragment>
    );
  }
}
