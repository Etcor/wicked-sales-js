import React from 'react';
import Header from './header';
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
        const cart = [...this.state.cart];
        cart.push(result);
        this.setState({ cart });
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
    const { view } = this.state;
    return (
      view.name === 'catalog'
        ? <ProductList
          viewDetails={this.setView}
        />
        : <ProductDetails
          viewProduct={view.params}
          viewCatalog={this.setView}
          addToCart={this.addToCart}
        />
    );
  }

  render() {
    return (
      <React.Fragment>
        <div
          style={{ height: '100vh' }}
          className="container-fluid bg-light p-0">
          <Header
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
