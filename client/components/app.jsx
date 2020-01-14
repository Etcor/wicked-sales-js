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
      }
    };
    this.setView = this.setView.bind(this);
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
          viewDetails={this.setView} />
        : <ProductDetails
          viewProduct={view.params}
          viewCatalog={this.setView} />
    );
  }

  render() {
    return (
      <React.Fragment>
        <Header/>
        <div className="container-fluid bg-light pt-5">
          <div className="container">
            { this.renderView() }
          </div>
        </div>
      </React.Fragment>
    );
  }
}
