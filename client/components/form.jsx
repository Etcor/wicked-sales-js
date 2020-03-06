/* eslint-disable no-useless-escape */
import React from 'react';
import NumberFormat from 'react-number-format';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      terms: false,
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
      isValidated: {
        terms: true,
        CVV: true,
        city: true,
        email: true,
        state: true,
        zipCode: true,
        fullName: true,
        address1: true,
        creditCard: true,
        phoneNumber: true,
        expirationDate: true
      }
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (name === 'terms') {
      return this.setState({ terms: !this.state.terms });
    }
    if (name === 'phoneNumber' || name === 'CVV' || name === 'zipCode') {
      if (/^\d+$/.test(value) || value === '') {
        this.setState({ [name]: value });
      }
      return;
    }
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { CVV, city, email, state, zipCode, fullName, address1, creditCard, phoneNumber, expirationDate, terms } = this.state;
    const isValidated = JSON.parse(JSON.stringify(this.state.isValidated));
    const emailTest = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const nameTest = new RegExp(/^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/);

    if (!nameTest.test(fullName.trim()) || fullName.trim().length < 5) {
      isValidated.fullName = false;
    } else {
      isValidated.fullName = true;
    }

    if (phoneNumber.length < 10) {
      isValidated.phoneNumber = false;
    } else {
      isValidated.phoneNumber = true;
    }

    if (CVV.length < 3) {
      isValidated.CVV = false;
    } else {
      isValidated.CVV = true;
    }

    if (address1.length < 6) {
      isValidated.address1 = false;
    } else {
      isValidated.address1 = true;
    }

    if (city.trim().length < 3) {
      isValidated.city = false;
    } else {
      isValidated.city = true;
    }

    if (state.length < 2) {
      isValidated.state = false;
    } else {
      isValidated.state = true;
    }

    if (zipCode.length < 5) {
      isValidated.zipCode = false;
    } else {
      isValidated.zipCode = true;
    }

    if (creditCard.trim().length < 16) {
      isValidated.creditCard = false;
    } else {
      isValidated.creditCard = true;
    }

    if (expirationDate.length < 7) {
      isValidated.expirationDate = false;
    } else {
      isValidated.expirationDate = true;
    }

    if (!terms) {
      isValidated.terms = false;
    } else {
      isValidated.terms = true;
    }

    if (!emailTest.test(email) || email.length < 6) {
      isValidated.email = false;
    } else {
      isValidated.email = true;
    }

    if (Object.values(isValidated).indexOf(false) === -1) {
      const order = {
        fullName: fullName.trim(),
        email: email,
        phoneNumber: phoneNumber,
        creditCard: creditCard.trim(),
        expirationDate: expirationDate,
        cvv: CVV,
        shippingAddress: `${address1.trim()} \n${this.state.address2} \n${city.trim()}, ${state} ${zipCode}}`
      };
      this.props.placeOrder(order);
    } else {
      this.setState({ isValidated });
    }
  }

  render() {
    return (
      <form className="p-4 border rounded bg-white needs-validation"
        onSubmit={() => this.handleSubmit(event)}>
        <div className="form-group">
          <h5>Shipping Address</h5>
        </div>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            maxLength="65"
            name="fullName"
            className={`form-control ${this.state.isValidated.fullName ? '' : 'is-invalid'}`}
            value={this.state.fullName}
            autoComplete="new-password"
            onChange={() => this.handleChange(event)}/>
          <div className="invalid-feedback">
            <p>Name must be a minimum of five characters and have a first and last name or an initial.</p>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              maxLength="11"
              className={`form-control ${this.state.isValidated.phoneNumber ? '' : 'is-invalid'}`}
              value={this.state.phoneNumber}
              onChange={() => this.handleChange(event)}
            />
            <div className="invalid-feedback">
              <p>Please enter a valid phone number with no spaces or special characters.</p>
            </div>
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              maxLength="254"
              className={`form-control ${this.state.isValidated.email ? '' : 'is-invalid'}`}
              value={this.state.email}
              onChange={() => this.handleChange(event)}
            />
            <div className="invalid-feedback">
              <p>Please enter a valid email, e.g. user@example.com.</p>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="address1">Address Line 1</label>
            <input
              type="text"
              maxLength="42"
              name="address1"
              className={`form-control ${this.state.isValidated.address1 ? '' : 'is-invalid'}`}
              value={this.state.address1}
              onChange={() => this.handleChange(event)}
            />
            <div className="invalid-feedback">
              <p>Please enter a valid shipping address, e.g. 123 Main St.</p>
            </div>
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="address2">Address Line 2</label>
            <input
              type="text"
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
              maxLength="50"
              value={this.state.city}
              className={`form-control ${this.state.isValidated.city ? '' : 'is-invalid'}`}
              onChange={() => this.handleChange(event)}
            />
            <div className="invalid-feedback">
              <p>Please enter your city.</p>
            </div>
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="state">State</label>
            <select
              name="state" className={`form-control ${this.state.isValidated.state ? '' : 'is-invalid'}`}
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
            <div className="invalid-feedback">
              <p>Please select a state.</p>
            </div>
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="tel"
              maxLength="5"
              name="zipCode"
              className={`form-control ${this.state.isValidated.zipCode ? '' : 'is-invalid'}`}
              value={this.state.zipCode}
              onChange={() => this.handleChange(event)}
            />
            <div className="invalid-feedback">
              <p>Please enter a 5 digit zipcode.</p>
            </div>
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
              className={`form-control ${this.state.isValidated.creditCard ? '' : 'is-invalid'}`}
              onValueChange={() => this.handleChange(event)}
            />
            <div className="invalid-feedback">
              <p>A valid, 16 digit credit card number is required.</p>
            </div>
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="expirationDate">Expiration Date</label>
            <NumberFormat
              type="tel"
              format="##/####"
              placeholder="MM/YYYY"
              name="expirationDate"
              className={`form-control ${this.state.isValidated.expirationDate ? '' : 'is-invalid'}`}
              mask={['M', 'M', 'Y', 'Y', 'Y', 'Y']}
              value={this.state.expirationDate}
              onValueChange={() => this.handleChange(event)}
            />
            <div className="invalid-feedback">
              <p>Expiration date is required.</p>
            </div>
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="CVV">CVV</label>
            <input
              type="tel"
              name="CVV"
              maxLength="4"
              className={`form-control ${this.state.isValidated.CVV ? '' : 'is-invalid'}`}
              value={this.state.CVV}
              onChange={() => this.handleChange(event)}
            />
            <div className="invalid-feedback">
              <p>CVV is required.</p>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="form-check">
            <input
              name="terms"
              type="checkbox"
              id="gridCheck"
              className={`form-check-input ${this.state.isValidated.terms ? '' : 'is-invalid'}`}
              onChange={() => this.handleChange(event)}
            />
            <label
              className="form-check-label text-dark"
              htmlFor="gridCheck">
              I accept that Wicked Sales is for demonstration purposes only.  Please know that no purchase will be made!  Personal information such as addresses, email or physical, and credit card numbers should not be used!
            </label>
            <div className="invalid-feedback">
              <p>Acknowledgement of these terms is required to continue.</p>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary"
        >Place Order</button>
      </form>
    );
  }
}

export default Form;
