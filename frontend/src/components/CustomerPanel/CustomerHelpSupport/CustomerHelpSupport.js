import React from 'react';
import CustomerSidebar from '../CustomerSidebar/CustomerSidebar';
import './CustomerHelpSupport.css';
import help from './hs.jpg';

const helpsupport = [
  {
    icon: "fa-book-open",
    question: "What types of books do you offer?",
    answer: "We at Book-E-Pedia provide a wide range of books to cater to every reader's preference. Our collection includes e-books, audiobooks, videos, and physical books. Whether you're into fiction, non-fiction, or specialized genres, we have something for everyone!",
  },
  {
    icon: "fa-cart-shopping",
    question: "How do I purchase a book?",
    answer: "Purchasing a book is simple. Browse through our collection, select the books you like, and add them to your cart. Proceed to checkout, complete the payment process, and your books will be ready!",
  },
  {
    icon: "fa-tablet-screen-button",
    question: "How do I access e-books?",
    answer: "Once purchased, your e-book will be instantly available in your account. Read it directly on our platform using any device with an internet connection. Enjoy the convenience of accessing your library anytime, anywhere!",
  },
  {
    icon: "fa-headphones",
    question: "Can I listen to audiobooks online?",
    answer: "Yes, you can stream audiobooks directly from our platform. Once purchased, they become available in your library. Enjoy seamless access without the need for additional downloads!",
  },
  {
    icon: "fa-truck-fast",
    question: "Can I track my order after purchasing?",
    answer: "Yes! Simply navigate to the 'Ordered Books' section in your dashboard. You can view the current shipment status, tracking history, and estimated delivery dates.",
  },
];

function CustomerHelpSupport() {
  return (
    <div className='cust-lux-body'>
      <CustomerSidebar />
      
      <div className="cust-lux-main">
        
        <div className="hs-header-lux mb-5">
          <div className="hs-header-text">
            <h1 className="hs-title-lux">Help & Support</h1>
            <p className="hs-subtitle-lux">Got questions? We're here to guide you through your Book-E-Pedia experience.</p>
          </div>
          <div className="hs-header-img-box">
            <img src={help} alt="Support Team" className="hs-header-img" />
          </div>
        </div>

        <div className="hs-grid-lux">
          {helpsupport.map((support, index) => (
            <div className="hs-glass-card" key={index}>
              <div className="hs-card-inner">
                
                {/* Front of Card */}
                <div className="hs-card-front">
                  <div className="hs-icon-circle">
                    <i className={`fas ${support.icon}`}></i>
                  </div>
                  <h3 className="hs-question-lux">{support.question}</h3>
                  <div className="flip-hint-lux">
                    <i className="fas fa-undo"></i> Hover for Answer
                  </div>
                </div>

                {/* Back of Card */}
                <div className="hs-card-back">
                  <div className="hs-answer-box">
                    <h4 className="hs-answer-title"><i className="fas fa-lightbulb text-warning me-2"></i> Answer</h4>
                    <p className="hs-answer-text">{support.answer}</p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default CustomerHelpSupport;
