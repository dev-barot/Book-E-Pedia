import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";

// Assets imported exactly as in the original to prevent missing file errors
import heroGemini from "./Gemini-removebg-preview.png";
import rightShelfImage from "./right_shelf.png";

import entertainmentBook from "./entertainment-book-icon (1).png";
import technologyBook from "./technology-book-icon-removebg-preview.png";
import adventureBook from "./adventure-book-icon-removebg-preview.png";
import horrorBook from "./horror-book-icon-removebg-preview.png";
import comicBook from "./comic-book-icon-removebg-preview.png";
import scienceBook from "./science-book-icon-removebg-preview.png";
import fictionBook from "./fiction-book-icon-removebg-preview.png";
import sportsBook from "./sports-book-icon-removebg-preview.png";
import motivationalBook from "./motivational-book-icon-removebg-preview.png";
import mythologyBook from "./mythology-book-icon-removebg-preview.png";

import bestbook1 from "./download (1).jpeg";
import bestbook2 from "./download (2).jpeg";
import bestbook3 from "./download.jpeg";
import bestbook4 from "./img.jpeg";
import bestbook5 from "./p1.jpeg";

import bookCollection from "./create-an-image-of-e-book-for-the-bookstore-websit (1).png";
import audiobookImg from "./create-an-image-of-audio-book-for-the-bookstore-we.png";
import videobookImg from "./create-an-image-of-video-book-for-the-bookstore-we.png";
import physicalbookImg from "./create-an-image-of-e-book-for-the-bookstore-websit.png";

import bookShelf from "./Realistic_Digital_Bookshelf_With_Colorful_Books_And_Signboard_1__1_-removebg-preview (1).png";

function Home() {
  const navigate = useNavigate();

  // Add to cart with login check
  const addToCart = (book) => {
    const isLoggedIn = localStorage.getItem('userToken');
    if (!isLoggedIn) {
      alert("You must be logged in to add a product to the cart!");
      navigate("/login");
      return;
    }
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const bookInCart = existingCart.find(item => item.id === book.id);
    if (bookInCart) {
      bookInCart.quantity += 1;
    } else {
      existingCart.push({ ...book, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`${book.title} has been added to your cart!`);
  };

  const [currentImage, setCurrentImage] = useState({
    src: bookCollection,
    alt: "Book Collection",
  });
  
  const [activeTab, setActiveTab] = useState("ebook");

  const changeImage = (type) => {
    const imageMap = {
      ebook: { src: bookCollection, alt: "E-Books" },
      audiobook: { src: audiobookImg, alt: "Audiobooks" },
      video: { src: videobookImg, alt: "Videos" },
      physical: { src: physicalbookImg, alt: "Physical Books" },
    };
    setCurrentImage(imageMap[type] || { src: bookCollection, alt: "Book Collection" });
    setActiveTab(type);
  };

  const scrollContainer = (className, direction) => {
    const container = document.querySelector(`.${className}`);
    if(container) {
      container.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: "smooth" });
    }
  };

  const categories = [
    { img: entertainmentBook, text: "Entertainment" },
    { img: technologyBook, text: "Technology" },
    { img: adventureBook, text: "Adventure" },
    { img: horrorBook, text: "Horror" },
    { img: comicBook, text: "Comics" },
    { img: scienceBook, text: "Science" },
    { img: fictionBook, text: "Fiction" },
    { img: sportsBook, text: "Sports" },
    { img: motivationalBook, text: "Self Help" },
    { img: mythologyBook, text: "Mythology" },
  ];

  const dummyBooks = [
    { id: 1, img: bestbook1, title: "Walk into the Shadow", author: "Olivia Wilson", price: 250 },
    { id: 2, img: bestbook2, title: "My Book Cover", author: "John Doe", price: 500 },
    { id: 3, img: bestbook3, title: "Soul", author: "Olivia Wilson", price: 1000 },
    { id: 4, img: bestbook4, title: "Fairytale World", author: "Jane Smith", price: 700 },
    { id: 5, img: bestbook5, title: "Hare and Rabbit", author: "Mark Twain", price: 950 },
  ];

  return (
    <div className="home-lux-container" translate="no">
      {/* 1. PREMIUM HERO SECTION */}
      <section className="hero-section-lux">
        <div className="hero-ambient-glow"></div>
        <div className="container-xxl">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6 hero-text-col">
              <span className="badge-lux mb-3">Welcome to Book-E-Pedia</span>
              <h1 className="hero-title">
                Unleash Your <br /> <span className="text-gradient">Imagination.</span>
              </h1>
              <p className="hero-subtitle">
                Discover a vast, curated selection of premium books for all ages and interests. Start your next great adventure today.
              </p>
              
              <div className="hero-actions mt-4">
                <Link to="/products" className="btn-explore-wide">
                  Explore Collection <i className="fa-solid fa-arrow-right ms-2 text-sm"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-6 hero-image-col d-flex justify-content-center align-items-center">
              <img src={heroGemini} alt="Aesthetic Book Table" className="hero-transparent-png img-fluid" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES (Glassmorphism slider) */}
      <section className="categories-lux-section py-5">
        <div className="container-xxl">
          <div className="section-header d-flex justify-content-between align-items-end mb-4">
            <div>
              <h6 className="text-muted fw-bold text-uppercase tracking-wide">Discover Genres</h6>
              <h2 className="section-title">Featured Categories</h2>
            </div>
            <div className="nav-controls">
              <button className="nav-btn-lux" onClick={() => scrollContainer('categories-track', 'left')}><i className="fa-solid fa-chevron-left"></i></button>
              <button className="nav-btn-lux ms-3" onClick={() => scrollContainer('categories-track', 'right')}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          
          <div className="categories-slider-wrapper">
            <div className="categories-track">
              {categories.map((cat, i) => (
                <div className="category-glass-card" key={i} onClick={() => navigate("/categories")}>
                  <div className="cat-icon-wrapper">
                    <img src={cat.img} alt={cat.text} />
                  </div>
                  <h5>{cat.text}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS & 4. TRENDING (Sleek Product Grids) */}
      <section className="products-lux-section py-5 bg-light-gradient">
        <div className="container-xxl">
          <h6 className="text-muted fw-bold text-uppercase tracking-wide text-center">Wall of Fame</h6>
          <h2 className="section-title text-center mb-5">Best Sellers & Trending</h2>
          
          <div className="products-grid-lux">
            {dummyBooks.map((book) => (
              <div className="product-card-lux" key={`bs-${book.id}`}>
                <div className="product-image-container">
                  <img src={book.img} alt={book.title} />
                  <div className="product-overlay">
                    <button className="btn-add-cart-lux" onClick={() => addToCart(book)}>
                      <i className="fa-solid fa-cart-plus me-2"></i> Add to Cart
                    </button>
                  </div>
                  <div className="trending-badge"><i className="fa-solid fa-fire text-white"></i></div>
                </div>
                <div className="product-details-lux">
                  <p className="product-author">{book.author}</p>
                  <h4 className="product-title">{book.title}</h4>
                  <div className="product-footer">
                    <span className="product-price">₹{book.price}</span>
                    <span className="product-rating"><i className="fa-solid fa-star text-warning text-small"></i> 4.8</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <button className="btn-outline-lux px-5 py-2" onClick={() => navigate("/products")}>View Full Catalog</button>
          </div>
        </div>
      </section>

      {/* 5. EXPLORE MEDIA TYPES (Interactive Mac-style Tab) */}
      <section className="media-explore-section py-5">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <h6 className="text-muted fw-bold text-uppercase tracking-wide">Endless Formats</h6>
              <h2 className="section-title mb-4">Explore Our Diverse Collection</h2>
              <p className="text-muted fs-5 mb-5">
                Dive into a world of e-books, audiobooks, immersive videos, and classic physical books across every genre imaginable.
              </p>
              
              <div className="media-tabs-lux">
                <button className={`media-tab ${activeTab === 'ebook' ? 'active' : ''}`} onClick={() => changeImage("ebook")}>
                  <i className="fa-solid fa-tablet-screen-button me-2"></i> E-Books
                </button>
                <button className={`media-tab ${activeTab === 'audiobook' ? 'active' : ''}`} onClick={() => changeImage("audiobook")}>
                  <i className="fa-solid fa-headphones me-2"></i> Audiobooks
                </button>
                <button className={`media-tab ${activeTab === 'video' ? 'active' : ''}`} onClick={() => changeImage("video")}>
                  <i className="fa-solid fa-circle-play me-2"></i> Videos
                </button>
                <button className={`media-tab ${activeTab === 'physical' ? 'active' : ''}`} onClick={() => changeImage("physical")}>
                  <i className="fa-solid fa-book-open me-2"></i> Physical
                </button>
              </div>
            </div>
            <div className="col-lg-7 text-center position-relative mt-5 mt-lg-0">
              <div className="blob-bg-shape"></div>
              <img src={currentImage.src} alt={currentImage.alt} className="dynamic-media-img shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROMO STRIP */}
      <section className="promo-strip-lux">
        <div className="container-xxl">
          <div className="promo-content">
            <h3>Huge Collection. Attractive Discounts. Special Offers.</h3>
            <p>Don't miss out on our limited time seasonal sale of up to 40% off on all premium hardcovers.</p>
            <Link to='/products' className="btn-light-lux">Claim Offers Now</Link>
          </div>
        </div>
      </section>

      {/* 7. ABOUT / WHY CHOOSE US */}
      <section className="about-lux-section py-5">
        <div className="container-xxl">
          <div className="glass-panel-huge">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0 p-5">
                <img src={bookShelf} alt="Digital Bookshelf" className="img-fluid rounded-3" />
              </div>
              <div className="col-lg-6 p-5">
                <h6 className="text-muted fw-bold text-uppercase tracking-wide">Our Mission</h6>
                <h2 className="section-title mb-4">Why Choose Book-E-Pedia?</h2>
                <p className="text-muted fs-6 mb-4 lh-lg">
                  At Book-E-Pedia, we believe in the power of stories to inspire, educate, and connect people. Whether you're a passionate reader, a curious learner, or someone seeking the perfect gift, we make it easy to explore.
                </p>
                <ul className="feature-list-lux mb-4">
                  <li><i className="fa-solid fa-circle-check text-success me-2"></i> Instant digital downloads</li>
                  <li><i className="fa-solid fa-circle-check text-success me-2"></i> Premium pristine physical packaging</li>
                  <li><i className="fa-solid fa-circle-check text-success me-2"></i> 24/7 dedicated customer support</li>
                </ul>
                <Link to="/about" className="btn-outline-lux px-4 py-2">Learn More About Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
