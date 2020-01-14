import React from 'react';
import ProductListItem from './product-list-item';

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  componentDidMount() {
    fetch('/api/products')
      .then(response => response.json())
      .then(products => {
        this.setState({ products });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { products } = this.state;
    const { viewDetails } = this.props;
    return (
      <div className="row">
        {products.map(product => {
          return (
            <div
              key={product.productId}
              className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <ProductListItem
                name={product.name}
                image={product.image}
                price={product.price}
                viewDetails={viewDetails}
                productId={product.productId}
                shortDescription={product.shortDescription}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default ProductList;
