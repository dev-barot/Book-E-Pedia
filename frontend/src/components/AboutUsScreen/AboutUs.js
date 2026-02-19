import React, { useState } from 'react';
import './AboutUs.css'; // Import your CSS file
import aboutUsImage from './aboutus-pic3.jpg.png';
import digitalDelights from './create-image-of-digital-delights-----------------e.png';
import tangibleTreasures from './create-image-of-400x150-resolution--of-tangible-tr.png';
import visualAdventures from './-create-image-of-visual-adventures-----------------removebg-preview.png';
import listenUp from './create-image-of-400x150px-resolution-listen-up----.png';

import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const AboutUs = () => {
  const [openFAQ, setOpenFAQ] = useState(null); // Track which FAQ is open

  const faqData = [
    {
      question: "What types of books do you offer?",
      answer:
        "We at Book-E-Pedia provide a wide range of books to cater to every reader's preference. Our collection includes e-books, audiobooks, videos, and physical books, ensuring accessibility and convenience for all. Whether you're into fiction, non-fiction, or specialized genres, we have something for everyone!",
    },
    {
      question: "How do I purchase a book?",
      answer:
        "Purchasing a book on our platform is simple and convenient. Just browse through our collection, select the books you like, and add them to your cart. Once you're ready, proceed to checkout, complete the payment process, and your books will be on your way!",
    },
    {
      question: "How do I access e-books?",
      answer:
        "Once you purchase an e-book, it will be available in your account for instant access. You can read it directly on our platform using any device with an internet connection. Enjoy the convenience of accessing your e-books anytime, anywhere!",
    },
    {
      question: "Can I listen to audiobooks online?",
      answer:
        "Yes, you can listen to audiobooks online directly from our platform. Once you purchase an audiobook, it becomes available for streaming in your account. Enjoy seamless access anytime, anywhere, without the need for downloads!",
    },
    {
      question: "Can I track my order after purchasing?",
      answer:
        'Yes, you can easily track your order through your account. Simply go to the "Order History" section, select your order, and view the current status and estimated delivery time.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index); // Toggle open FAQ
  };

  return (
    <div className="about-page">

      {/* About Us Intro */}
      <section className="about-us-intro">
        <h1>About Us</h1>
      </section>

      {/* About Us Section */}
      <section className="about-us">
        <div className="about-us-content">
          <div className="about-us-description">
            <h2>Best Choice For Learners</h2>
            <p>
              Welcome to Book-e-Pedia, your one-stop destination for all things books! At Book-e-Pedia, we believe that every story has the power to inspire, educate, and entertain. Our mission is to make books accessible to everyone, no matter how they prefer to read or learn. That's why our specialty is offering a diverse range of formats—including physical books, eBooks, audiobooks, and even video books. From timeless classics to contemporary bestsellers, academic resources to hidden literary treasures, our curated collection has something for everyone. With a user-friendly platform and a passion for promoting the joy of reading, we aim to connect you with the perfect books and formats to suit your lifestyle. Join us in exploring the endless possibilities of stories, one page, chapter, or video at a time!
            </p>
            <button className="about-us-contact-btn"><Nav.Link as={Link} to='/'>Explore</Nav.Link></button>
          </div>
          <div className="about-us-info">
            <div className="about-us-image">
              <img src={aboutUsImage} alt="Books tied with a ribbon" />
            </div>
            <ul className="about-us-categories">
              <li>
                ✔ Physical Books&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ E-Books&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Audio Books&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✔ Video Books
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Card Container */}
      <div className="card-container">
        <h1 className="cardcontainer-title">
          Dive Into the World of Stories
          <br />
          <hr />
          From Pages to Screens, Words That Speak and Visuals That Inspire
        </h1>
        <div className="types-card">
          <img src={digitalDelights} alt="Digital Delights" />
          <div className="card-content">
            <div className="card-title">Digital Delights</div>
            <div className="card-description">
              Explore our vast collection of e-books that fit in your pocket!
            </div>
          </div>
        </div>
        <div className="types-card">
          <img src={tangibleTreasures} alt="Tangible Treasures" />
          <div className="card-content">
            <div className="card-title">Tangible Treasures</div>
            <div className="card-description">
              Feel the pages turn with our stunning physical books!
            </div>
          </div>
        </div>
        <div className="types-card">
          <img src={visualAdventures} alt="Visual Adventures" />
          <div className="card-content">
            <div className="card-title">Visual Adventures</div>
            <div className="card-description">
              Watch and learn with our engaging video books!
            </div>
          </div>
        </div>
        <div className="types-card">
          <img src={listenUp} alt="Listen Up!" />
          <div className="card-content">
            <div className="card-title">Listen Up!</div>
            <div className="card-description">
              Immerse yourself in stories with our audiobooks!
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-container">
        <div className="faq-header">Frequently Asked Questions</div>
        {faqData.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)} // Toggle FAQ on click
            >
              {faq.question} <span>{openFAQ === index ? '×' : '+'}</span>
            </div>
            {openFAQ === index && (
              <div className="faq-answer">{faq.answer}</div> // Conditionally render answer
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
