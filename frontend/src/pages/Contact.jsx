import React from 'react';
import '../styles/Contact.css';// Import the CSS file
import bgImage from '../assets/bg.jpg'; // Import the image

const ContactForm = () => {
  return (
    <div className="contact-form-container">
      <div className="form-wrapper">
        <div className="image-wrapper">
          <div className="background-image" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="contact-info">
              <div className="info-item">
                <div className="icon-wrapper"><i className="fas fa-envelope"></i></div>
                <p className="info-title">Email</p>
                <p className="info-detail">info@metaballs.studio</p>
              </div>
              <div className="info-item">
                <div className="icon-wrapper"><i className="fas fa-phone"></i></div>
                <p className="info-title">Phone</p>
                <p className="info-detail">+1 (800) 123-4567</p>
              </div>
              <div className="info-item">
                <div className="icon-wrapper"><i className="fas fa-map-marker-alt"></i></div>
                <p className="info-title">US Office</p>
                <p className="info-detail">123 Metaballs Lane, Innovation City, TX 78901</p>
              </div>
              <div className="info-item">
                <div className="icon-wrapper"><i className="fas fa-map-marker-alt"></i></div>
                <p className="info-title">BD Office</p>
                <p className="info-detail">7/53 Metaballs Lane, Modern City, Jhenaidah</p>
              </div>
            </div>
          </div>
        </div>
        <div className="form-content">
          <h1 className="form-title">We're here to help</h1>
          <p className="form-description">Our dedicated team is ready to support you.</p>
          <form className="form" noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First name <span className="required">*</span></label>
                <input id="firstName" name="firstName" placeholder="First name" required type="text" />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last name <span className="required">*</span></label>
                <input id="lastName" name="lastName" placeholder="Last name" required type="text" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input id="email" name="email" placeholder="hi@metaballs.studio" required type="email" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone number <span className="required">*</span></label>
              <div className="phone-input">
                <button type="button" className="country-code-button">
                  <img alt="US flag" className="flag-icon" src="https://flagcdn.com/us.svg" />
                  <span className="country-code">+1</span>
                </button>
                <input id="phone" name="phone" placeholder="(555) 000-0000" required type="tel" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="topic">Choose a topic <span className="required">*</span></label>
              <select id="topic" name="topic" required>
                <option disabled selected>Select from list</option>
                <option>General Inquiry</option>
                <option>Support</option>
                <option>Sales</option>
                <option>Feedback</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message <span className="optional">(optional)</span></label>
              <textarea id="message" name="message" placeholder="Share your message..." rows="3"></textarea>
            </div>
            <div className="privacy-policy">
              <input id="privacy" name="privacy" type="checkbox" />
              <label htmlFor="privacy">
                By checking this, you agree to our <a href="#" className="privacy-link">privacy policy</a>.
              </label>
            </div>
            <button className="submit-button" type="submit">Send message </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
