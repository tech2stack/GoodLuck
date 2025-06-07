import React, { useEffect } from 'react'; // useEffect ko import karna zaroori hai
import '../styles/Contact.css';
import bgImage from '../assets/bg.jpg';

const ContactForm = () => {

  // Yeh useEffect hook Formspree ke _replyto field ko dynamically update karega.
  // Jab component mount hoga, yeh email field par ek 'input' event listener add karega.
  useEffect(() => {
    const emailInput = document.getElementById('email');
    const replytoEmailInput = document.getElementById('replytoEmail');

    if (emailInput && replytoEmailInput) {
      const updateReplyTo = () => {
        // Customer ke email ko _replyto hidden field mein set karein
        replytoEmailInput.value = emailInput.value;
      };

      // Email field mein koi bhi change hone par _replyto ko update karein
      emailInput.addEventListener('input', updateReplyTo);

      // Component unmount hone par event listener ko remove kar dein
      return () => {
        emailInput.removeEventListener('input', updateReplyTo);
      };
    }
  }, []); // Empty dependency array means this effect runs only once after the initial render

  return (
    <div className="contact-form-container">
      <div className="form-wrapper">

        {/* Background Image + Info Section */}
        <div className="image-wrapper">
        <div
  className="background-image"
  style={{
    backgroundImage: `url('https://img.freepik.com/free-vector/dna-biotechnology-science-background-vector-blue-futuristic-style-with-blank-space_53876-114114.jpg?semt=ais_hybrid&w=740')`
  }}
></div>


          <div className="contact-info">
            {/* Note: If these phone numbers are different, you might want to adjust them */}
            <InfoItem icon="fas fa-phone" title="Phone" detail="+91 7024136476" />
            {/* <InfoItem icon="fas fa-phone" title="Phone" detail="+91 7024136476" /> */}
            <InfoItem icon="fas fa-envelope" title="Email" detail="goodluckbookstorebhopal@gmail.com" />
            <InfoItem icon="fas fa-map-marker-alt" title="Ashoka Garden Store" detail="Shop No. 2, Shriji Tower, Near Manpreet Hotel, New Ashoka Garden, Bhopal, Madhya Pradesh 462023" />
          </div>
        </div>

        {/* Form Content Section */}
        <div className="form-content">
          <h1 className="form-title">We're here to help</h1>
          <p className="form-description">Our dedicated team is ready to support you.</p>

          {/* Formspree action URL. Make sure this is correct for your Formspree form. */}
          <form className="form" action="https://formspree.io/f/xyzjkvdj" method="POST" noValidate>

            {/* --- Hidden Fields for Email Customization --- */}
            {/* _subject: Email ka subject set karega. Jab aapko email milega, toh uska subject yahi hoga. */}
            <input type="hidden" name="_subject" value="New Inquiry: Website Contact Form - Goodluck Bookstore" />

            {/* _replyto: Isse aap seedhe customer ko reply kar sakte hain.
                Iski value JavaScript se 'email' field se copy ki jayegi. */}
            <input type="hidden" name="_replyto" id="replytoEmail" />

            {/* _template: (Optional) Isse aap Formspree ke email template ko override kar sakte hain.
                Default ya Formspree dashboard mein set kiya gaya template use hoga agar yeh commented hai.
                Agar aap use karna chahte hain, toh 'box' ya 'card' jaise options choose kar sakte hain.
                <input type="hidden" name="_template" value="box" />
            */}
            {/* --- End of Hidden Fields --- */}

            <div className="form-row">
              <FormGroup id="firstName" name="firstName" label="First name" placeholder="First name" required />
              <FormGroup id="lastName" name="lastName" label="Last name" placeholder="Last name" required />
            </div>

            <FormGroup id="email" name="email" label="Email" type="email" placeholder="example@gmail.com" required />

            {/* Phone with Country Code Dropdown */}
            <div className="form-group">
              <label htmlFor="phone">
                Phone number <span className="required">*</span>
              </label>
              <div className="phone-input">
                {/* Country code ke liye 'name' attribute */}
                <select className="country-code-button" name="countryCode" id="country" required defaultValue="+91">
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
                {/* Phone number input ke liye 'name' attribute */}
                <input id="phone" name="phoneNumber" placeholder="Enter phone number" required type="tel" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="topic">
                Choose a topic <span className="required">*</span>
              </label>
              {/* Topic dropdown ke liye 'name' attribute */}
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
              {/* Message textarea ke liye 'name' attribute */}
              <textarea id="message" name="message" placeholder="Share your message..." rows="3"></textarea>
            </div>

            {/* <div className="privacy-policy">
              <input id="privacy" name="privacy" type="checkbox" required />
              <label htmlFor="privacy">
                By checking this, you agree to our{' '}
                <a href="#" className="privacy-link">privacy policy</a>.
              </label>
            </div> */}

            <button className="submit-button" type="submit">
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// InfoItem component mein koi change nahi hai
const InfoItem = ({ icon, title, detail }) => (
  <div className="info-item">
    <div className="icon-wrapper"><i className={icon}></i></div>
    <p className="info-title">{title}</p>
    <p className="info-detail">{detail}</p>
  </div>
);

// FormGroup component mein 'name' prop accept kiya gaya hai aur use kiya gaya hai
const FormGroup = ({ id, label, placeholder, type = 'text', required = false, name }) => (
  <div className="form-group">
    <label htmlFor={id}>
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      id={id}
      name={name} // 'name' prop yahan use ho raha hai
      type={type}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default ContactForm;