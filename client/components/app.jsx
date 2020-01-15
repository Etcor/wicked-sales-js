import React from 'react';
import Header from './header';
import CartSummary from './cart-summary';
import ProductList from './product-list';
import ProductDetails from './product-details';

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
        this.setState({
          cart: [...this.state.cart, result]
        });
      })
      .catch(err => console.error(err));
  }

  setView(name, params) {
    this.setState({
      view: {
        name,
        params
      }
    });
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
        viewCatalog={this.setView}/>
    };
    return renderViews[name];
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="container-fluid bg-light p-0"
          style={{ height: '100vh', overflow: 'auto' }}>
          <Header
            viewCart={this.setView}
            cartItemCount={this.state.cart.length}
          />
          <div className="container">
            { this.renderView() }
          </div>
        </div>
      </React.Fragment>
    );
  }
}
