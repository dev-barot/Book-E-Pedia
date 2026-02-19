import React from 'react'
import CustomerSidebar from '../CustomerSidebar/CustomerSidebar'
import './CustomerHelpSupport.css'
import help from './hs.jpg';

const helpsupport = [
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

function CustomerHelpSupport() {
  return (
    <div className='cust-hs-body'>
      <CustomerSidebar />
    <div className="cust-hs-container">
      <header className='cust-hs-header'>
        <div className="cust-hs-logo">
          {/* Replace with your logo image */}
          <img src={help} alt="Company Logo" style={{ height: '200px', width: '200px',borderRadius:'40px' }} />
        </div>    
        <h1>How can we help you?</h1><br/><br/>      
        </header>

        <main>

      <div className="cust-hs-grid">
        {helpsupport.map((support, index) => (
          <div className="cust-hs-card" key={index}>
            <div className="cust-hs-card-inner">
              <div className="cust-hs-cat-card-front">
                <h3>{support.question}</h3>
              </div>
              <div className="cust-hs-cat-card-back" style={{ fontSize: '8px' }}>
                <p>{support.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      </main>
    </div>
    </div>
  )
}

export default CustomerHelpSupport
