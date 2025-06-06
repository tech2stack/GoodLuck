import React from "react";
import bgImage from '../assets/bg.jpg'; // All images will now point to bg.jpg as requested
import Kunal from '../assets/kunal.jpg';
import Shivam from '../assets/shivam.jpg';
import Shital from '../assets/shital.jpg';
import "../styles/Home.css"; // Ensure this path is correct

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section - Top Banner */}
      <section className="hero-section">
        <img src={bgImage} alt="Goodluck Book Store Banner" className="hero-background-image" />
        <div className="hero-overlay">
          <h1 className="hero-title">TURN THE PAGE TO YOUR DREAMS</h1>
          <h1 className="hero-subtitle">~ read with us!</h1>
          {/* <h1 className="hero-subtitle">Read today, build tommorow</h1> */}

          <button 
  className="hero-button"
  onClick={() => {
    window.open("https://www.google.com/maps/dir/?api=1&destination=Goodluck+Book+Store+Bhopal", "_blank");
  }}
>
  Visit Now
</button>

        </div>
      </section>

      {/* Good Luck Book Store - About Section */}
      <section className="goodluck-about-section">
        <div className="about-content">
          <div className="about-text-wrapper">
            <div className="about-header">
              {/* <img src={bgImage} alt="Goodluck Book Store Logo" className="goodluck-logo" /> */}
              <h2 className="about-heading">GOOD LUCK BOOK STORE</h2>
            </div>
            <p className="about-tagline">— Your gateway to knowledge and adventure!</p>
            <p className="about-description">
              At Goodluck Book Store, we're dedicated to enriching minds and fostering a love for reading. We provide a wide range of academic books, captivating fiction, and essential stationery for learners of all ages. Our commitment to quality and customer satisfaction makes us your trusted partner in education and literature. Experience the joy of discovery with every page you turn.
            </p>
            <div className="about-buttons">
              {/* <button className="btn-primary">Learn More</button> */}
              <a href="/contact"><button className="btn-secondary">Contact Us</button></a>
            </div>
          </div>
          <div className="about-image-container">
            <img src={bgImage} alt="Goodluck Book Store Interior" className="about-store-image" />
          </div>
        </div>
      </section>

      {/* Your Bookstore, Your Benefits Section */}
      <section className="benefits-section" id="benefits">
        <h2 className="section-title">Your Bookstore, Your Benefits</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <img src="https://miro.medium.com/v2/resize:fit:675/1*GcwyDKN76j6Le4B1EMApOA.jpeg" alt="Complete School Book Sets" className="benefit-image" />
            <div className="benefit-text-content">
              <h3>Complete School Book Sets</h3>
              <p>Pre-packed sets of textbooks, notebooks, and stationery for major schools.</p><br></br>
              <button className="benefit-button">Learn More</button>
            </div>
          </div>
          <div className="benefit-card">
            <img src="https://www.shutterstock.com/image-vector/combo-offers-labels-promotion-banner-600nw-2076677263.jpg" alt="Exclusive Discounts & Combos" className="benefit-image" />
            <div className="benefit-text-content">
              <h3>Exclusive Discounts & Combos</h3>
              <p>Save up to 50% with seasonal discounts and combo deals.</p><br></br>
              <br />
              <button className="benefit-button">Learn More</button>
            </div>
          </div>
          <div className="benefit-card">
            <img src={bgImage} alt="Home Delivery Service" className="benefit-image" />
            <div className="benefit-text-content">
              <h3>Home Delivery Service</h3>
              <p>Fast and reliable delivery right to your doorstep.</p>
              <br />  <br />
              <button className="benefit-button">Learn More</button>
            </div>
          </div>
          {/* <div className="benefit-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfAZKxC8BfNxZQJAbBzAu5QbiTZzQY84WBPF0DIkdokqv7YrkC3hdZkE5FE3SIbk1aHrc&usqp=CAU" alt="Pre-order Facility" className="benefit-image" />
            <div className="benefit-text-content">
              <h3>Pre-Order Facility for New Academic Sessions</h3>
              <p>Reserve your books ahead of academic sessions to get priority delivery.</p>
              <button className="benefit-button">Learn More</button>
            </div>
          </div> */}
        </div>
      </section>

      {/* Our Favorite Customers Section */}
      <section className="customers-section" id="review">
        <h2 className="section-title">Our favorite customers</h2>
        <div className="customer-reviews-grid">
          <div className="customer-review-card">
            <img src={Kunal} alt="Customer 1" className="customer-avatar" />
            <div className="customer-info">
              <h4>Kunal Nagwanshi</h4>
              <p className="stars">⭐⭐⭐⭐⭐</p>
              <p>"Excellent collection and amazing service. Highly recommended!"</p>
            </div>
          </div>
          <div className="customer-review-card">
            <img src={Shivam} alt="Customer 2" className="customer-avatar" />
            <div className="customer-info">
              <h4>Shivam Malviya</h4>
              <p className="stars">⭐⭐⭐⭐⭐</p>
              <p>"Affordable prices and prompt delivery. I love shopping here."</p>
            </div>
          </div>
          <div className="customer-review-card">
            <img src={Shital} alt="Customer 3" className="customer-avatar" />
            <div className="customer-info">
              <h4>Shital Gokhe</h4>
              <p className="stars">⭐⭐⭐⭐⭐</p>
              <p>"The pre-order option is a lifesaver for busy parents."</p>
            </div>
          </div>
        </div>
      </section>

     
     
    </div>
  );
};

export default Home;