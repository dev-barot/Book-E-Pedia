import React, { useState } from 'react';
import './AboutUs.css';
import aboutUsImage from './aboutus-pic3.jpg.png';
import digitalDelights from './create-image-of-digital-delights-----------------e.png';
import tangibleTreasures from './create-image-of-400x150-resolution--of-tangible-tr.png';
import visualAdventures from './-create-image-of-visual-adventures-----------------removebg-preview.png';
import listenUp from './create-image-of-400x150px-resolution-listen-up----.png';

import { Link } from 'react-router-dom';

const AboutUs = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqData = [
    {
      question: "What types of books do you offer?",
      answer: "We at Book-E-Pedia provide a wide range of books to cater to every reader's preference. Our collection includes e-books, audiobooks, video books, and physical books, ensuring accessibility and convenience for all. Whether you're into fiction, non-fiction, or specialized genres, we have something for everyone!",
    },
    {
      question: "How do I purchase a book?",
      answer: "Purchasing a book on our platform is simple and convenient. Just browse through our collection, select the books you like, and add them to your cart. Once you're ready, proceed to checkout, complete the payment process, and your books will be on your way!",
    },
    {
      question: "How do I access e-books?",
      answer: "Once you purchase an e-book, it will be available in your account for instant access. You can read it directly on our platform using any device with an internet connection. Enjoy the convenience of accessing your e-books anytime, anywhere!",
    },
    {
      question: "Can I listen to audiobooks online?",
      answer: "Yes, you can listen to audiobooks online directly from our platform. Once you purchase an audiobook, it becomes available for streaming in your account. Enjoy seamless access anytime, anywhere, without the need for downloads!",
    },
    {
      question: "Can I track my order after purchasing?",
      answer: "Yes, you can easily track your order through your account. Simply go to the \"Order History\" section, select your order, and view the current status and estimated delivery time.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="about-lux-page">
      <div className="container-xxl py-5">

        {/* Asymmetrical Hero Card Exactly Copying Screenshot */}
        <div className="about-hero-card mb-5 mx-auto">
          <div className="row m-0 h-100">
            
            {/* Left Box: Content */}
            <div className="col-lg-7 about-hero-left">
              <h1 className="about-hero-title">Best Choice For Learners</h1>
              <p className="about-hero-desc">
                Welcome to Book-e-Pedia, your one-stop destination for all things books! At Book-e-Pedia, we believe that every story has the power to inspire, educate, and entertain. Our mission is to make books accessible to everyone, no matter how they prefer to read or learn.
              </p>
                <div className="about-hero-pills">
                <span className="hero-pill"><i className="fa-solid fa-book-open"></i> Physical</span>
                <span className="hero-pill"><i className="fa-solid fa-tablet-screen-button"></i> E-Books</span>
                <span className="hero-pill"><i className="fa-solid fa-headphones"></i> Audio</span>
                <span className="hero-pill"><i className="fa-solid fa-circle-play"></i> Video</span>
              </div>
              <p className="about-hero-desc">
                That's why our specialty is offering a diverse range of formats—including physical books, eBooks, audiobooks, and even video books. From timeless classics to contemporary bestsellers, academic resources to hidden literary treasures, our curated collection has something for everyone.
              </p>
              
              {/* Format Pills */}
            

              {/* Action Button */}
              <Link to="/products" className="btn-hero-explore">
                Explore The Collection
              </Link>
            </div>
            
            {/* Right Box: Image Flush Top + Story Below */}
            <div className="col-lg-5 about-hero-right">
              <div className="hero-image-clip">
                <img src={aboutUsImage} alt="Bookstore" className="img-fluid" />
              </div>
              
              <div className="hero-story-text text-center mt-5 px-3">
                <span className="hero-badge">OUR STORY</span>
                <p className="hero-story-desc mt-4">
                  Connecting readers with stories matching their perfect lifestyle, one page, audio clip, or video at a time.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Pillars Section */}
        <div className="text-center mt-5 pt-5 mb-5">
          <h2 className="section-title-lux mb-3">Dive Into the World of Stories</h2>
          <p className="section-subtitle-lux mx-auto">From Pages to Screens, Words That Speak and Visuals That Inspire</p>
        </div>

        <div className="row g-4 mb-5 pb-5">
          
          <div className="col-md-6 col-lg-3">
            <div className="glass-feature-card h-100">
              <div className="feature-img-box">
                <img src={digitalDelights} alt="Digital Delights" />
              </div>
              <div className="feature-content-lux">
                <h4 className="feature-title-lux">Digital Delights</h4>
                <p className="feature-desc-lux">Explore our vast collection of e-books that conveniently fit right into your pocket!</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="glass-feature-card h-100">
              <div className="feature-img-box">
                <img src={tangibleTreasures} alt="Tangible Treasures" />
              </div>
              <div className="feature-content-lux">
                <h4 className="feature-title-lux">Tangible Treasures</h4>
                <p className="feature-desc-lux">Feel the pages turn and physically hold stories with our stunning physical books.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="glass-feature-card h-100">
              <div className="feature-img-box">
                <img src={visualAdventures} alt="Visual Adventures" />
              </div>
              <div className="feature-content-lux">
                <h4 className="feature-title-lux">Visual Adventures</h4>
                <p className="feature-desc-lux">Watch and learn with our highly engaging and beautifully curated video books!</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="glass-feature-card h-100">
              <div className="feature-img-box">
                <img src={listenUp} alt="Listen Up!" />
              </div>
              <div className="feature-content-lux">
                <h4 className="feature-title-lux">Listen Up!</h4>
                <p className="feature-desc-lux">Immerse yourself completely in stories on the go with our premium audiobooks.</p>
              </div>
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="faq-lux-container mt-5">
          <div className="text-center mb-5">
            <span className="badge-lux mb-3">Support</span>
            <h2 className="section-title-lux">Frequently Asked Questions</h2>
          </div>

          <div className="faq-lux-accordion">
            {faqData.map((faq, index) => (
              <div className={`faq-lux-item ${openFAQ === index ? 'active' : ''}`} key={index}>
                <div 
                  className="faq-lux-question" 
                  onClick={() => toggleFAQ(index)}
                >
                  <h5 className="mb-0 fw-bold">{faq.question}</h5>
                  <span className="faq-lux-icon">
                    <i className={`fa-solid ${openFAQ === index ? 'fa-minus' : 'fa-plus'}`}></i>
                  </span>
                </div>
                <div className="faq-lux-answer" style={{ maxHeight: openFAQ === index ? '300px' : '0' }}>
                  <p className="mb-0">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
