import React from 'react';
import NumberFormat from 'react-number-format';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CVV: '',
      city: '',
      email: '',
      state: '',
      zipCode: '',
      fullName: '',
      address1: '',
      address2: '',
      creditCard: '',
      phoneNumber: '',
      expirationDate: '',
      needsValidation: {
        city: true,
        email: true,
        zipCode: true,
        fullName: true,
        address1: true,
        address2: true,
        phoneNumber: true
      }
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <form className="p-4 border rounded bg-white"
        onChange={() => this.handleChange}
        onSubmit={() => this.handleSubmit}>
        <div className="form-group">
          <h5>Shipping Address</h5>
        </div>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            minLength="5"
            maxLength="65"
            name="fullName"
            className="form-control"
            value={this.state.fullName}
            autoComplete="new-password"
            onChange={() => this.handleChange(event)}/>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              minLength="10"
              maxLength="11"
              className="form-control"
              value={this.state.phoneNumber}
              onChange={() => this.handleChange(event)}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              minLength="6"
              maxLength="254"
              className="form-control"
              value={this.state.email}
              onChange={() => this.handleChange(event)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="address1">Address Line 1</label>
            <input
              type="text"
              minLength="6"
              maxLength="42"
              name="address1"
              className="form-control"
              value={this.state.address1}
              onChange={() => this.handleChange(event)}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="address2">Address Line 2</label>
            <input
              type="text"
              minLength="0"
              maxLength="42"
              name="address2"
              className="form-control"
              value={this.state.address2}
              onChange={() => this.handleChange(event)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="city">City</label>
            <input
              type="text"
              name="city"
              minLength="3"
              maxLength="50"
              value={this.state.city}
              className="form-control"
              onChange={() => this.handleChange(event)}
            />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="state">State</label>
            <select
              name="state" className="form-control"
              onChange={() => this.handleChange(event)}>
              <option defaultValue hidden></option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="tel"
              minLength="5"
              maxLength="5"
              name="zipCode"
              className="form-control"
              value={this.state.zipCode}
              onChange={() => this.handleChange(event)}
            />
          </div>
        </div>
        <div className="form-group">
          <h5>Payment Information</h5>
        </div>
        <div className="form-row border p-3">
          <div className="form-group col-md-6">
            <label htmlFor="creditCard">Credit Card</label>
            <NumberFormat
              type="tel"
              name="creditCard"
              format="#### #### #### ####"
              value={this.state.creditCard}
              className="form-control"
              onValueChange={() => this.handleChange(event)}
            />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="expirationDate">Expiration Date</label>
            <NumberFormat
              type="tel"
              format="##/##"
              placeholder="MM/YY"
              name="expirationDate"
              className="form-control"
              mask={['M', 'M', 'Y', 'Y']}
              value={this.state.expirationDate}
              onValueChange={() => this.handleChange(event)}
            />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="CVV">CVV</label>
            <input
              type="tel"
              name="CVV"
              minLength="3"
              maxLength="4"
              className="form-control"
              value={this.state.CVV}
              onChange={() => this.handleChange(event)}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="form-check">
            <input
              name="TOS"
              type="checkbox"
              id="terms-of-service"
              className="form-check-input"
            />
            <label
              className="form-check-label"
              htmlFor="terms-of-service">
              I accept that Wicked Sales is for demonstration purposes only.  Please know that no purchase will be made!  Personal information such as addresses, email or physical, and credit card numbers should not be used!
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary"
        >Place Order</button>
      </form>
    );
  }
}

export default Form;
