import React from 'react';
import '../styles/Contact.css';
import bgImage from '../assets/bg.jpg';

const ContactForm = () => {
  return (
    <div className="contact-form-container">
      <div className="form-wrapper">

        {/* Background Image + Info Section */}
        <div className="image-wrapper">
          <div
            className="background-image"
            style={{ backgroundImage: `url(${bgImage})` }}
          ></div>

          <div className="contact-info">
            <InfoItem icon="fas fa-phone" title="Phone" detail="+91 7024136476" />
            <InfoItem icon="fas fa-phone" title="Phone" detail="+91 7024136476" />
            <InfoItem icon="fas fa-envelope" title="Email" detail="info@goodluckbookstore.com" />
            <InfoItem icon="fas fa-map-marker-alt" title="Ashoka Garden Store" detail="Shop No. 2, Shriji Tower, Near Manpreet Hotel, New Ashoka Garden, Bhopal, Madhya Pradesh 462023" />
          </div>
        </div>

        {/* Form Content Section */}
        <div className="form-content">
          <h1 className="form-title">We're here to help</h1>
          <p className="form-description">Our dedicated team is ready to support you.</p>

          <form className="form" noValidate>
            <div className="form-row">
              <FormGroup id="firstName" label="First name" placeholder="First name" required />
              <FormGroup id="lastName" label="Last name" placeholder="Last name" required />
            </div>

            <FormGroup id="email" label="Email" type="email" placeholder="example@gmail.com" required />

            {/* Phone with Country Code Dropdown */}
            <div className="form-group">
              <label htmlFor="phone">
                Phone number <span className="required">*</span>
              </label>
              <div className="phone-input">
                <select className="country-code-button" name="country" id="country" required defaultValue="+91">
                  <option value="+1">🇺🇸 +1 (USA)</option>
                  <option value="+91">🇮🇳 +91 (India)</option>
                  <option value="+44">🇬🇧 +44 (UK)</option>
                  <option value="+61">🇦🇺 +61 (Australia)</option>
                  <option value="+81">🇯🇵 +81 (Japan)</option>
                  <option value="+49">🇩🇪 +49 (Germany)</option>
                  <option value="+33">🇫🇷 +33 (France)</option>
                  <option value="+971">🇦🇪 +971 (UAE)</option>
                  <option value="+86">🇨🇳 +86 (China)</option>
                  <option value="+880">🇧🇩 +880 (Bangladesh)</option>
                </select>
                <input id="phone" name="phone" placeholder="Enter phone number" required type="tel" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="topic">
                Choose a topic <span className="required">*</span>
              </label>
              <select id="topic" name="topic" required defaultValue="">
                <option value="" disabled>Select from list</option>
                <option value="general">General Inquiry</option>
                <option value="support">Support</option>
                <option value="sales">Sales</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message <span className="optional">(optional)</span>
              </label>
              <textarea id="message" name="message" placeholder="Share your message..." rows="3"></textarea>
            </div>

            <div className="privacy-policy">
              <input id="privacy" name="privacy" type="checkbox" required />
              <label htmlFor="privacy">
                By checking this, you agree to our{' '}
                <a href="#" className="privacy-link">privacy policy</a>.
              </label>
            </div>

            <button className="submit-button" type="submit">
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, title, detail }) => (
  <div className="info-item">
    <div className="icon-wrapper"><i className={icon}></i></div>
    <p className="info-title">{title}</p>
    <p className="info-detail">{detail}</p>
  </div>
);

const FormGroup = ({ id, label, placeholder, type = 'text', required = false }) => (
  <div className="form-group">
    <label htmlFor={id}>
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default ContactForm;
