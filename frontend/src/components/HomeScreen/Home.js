import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import "./Home.css";
import leftShelfImage from "./flipright_shelf.png";
import rightShelfImage from "./right_shelf.png";
import audioBook from "./audio_T.png";
import physicalBook from "./book_T.png";
import videoBook from "./video_t.png";
import eBook from "./e-book_T.png";
import entertainmentBook from "./entertainment-book-icon (1).png";
import technologyBook from "./technology-book-icon-removebg-preview.png";
import adventureBook from "./adventure-book-icon-removebg-preview.png";
import horrorBook from "./horror-book-icon-removebg-preview.png";
import bestbook1 from "./download (1).jpeg";
import bestbook2 from "./download (2).jpeg";
import bestbook3 from "./download.jpeg";
import bestbook4 from "./img.jpeg";
import bestbook5 from "./p1.jpeg";
import bookCollection from "./create-an-image-of-e-book-for-the-bookstore-websit (1).png";
import audiobook from "./create-an-image-of-audio-book-for-the-bookstore-we.png";
import videobook from "./create-an-image-of-video-book-for-the-bookstore-we.png";
import physicalbook from "./create-an-image-of-e-book-for-the-bookstore-websit.png";
import bookShelf from "./Realistic_Digital_Bookshelf_With_Colorful_Books_And_Signboard_1__1_-removebg-preview (1).png";
import comicBook from "./comic-book-icon-removebg-preview.png";
import scienceBook from "./science-book-icon-removebg-preview.png";
import fictionBook from "./fiction-book-icon-removebg-preview.png";
import sportsBook from "./sports-book-icon-removebg-preview.png";
import motivationalBook from "./motivational-book-icon-removebg-preview.png";
import mythologyBook from "./mythology-book-icon-removebg-preview.png";
import Products from "../ProductScreen/Products";

import heroImage from "./heroimage.png";

function Home() {
  const navigate = useNavigate();
  
  // Add to cart with login check
  const addToCart = (book) => {
    // Check if the user is logged in by looking for a token or user ID in localStorage
    const isLoggedIn = localStorage.getItem('userToken'); // assuming userToken is stored in localStorage

    if (!isLoggedIn) {
      // If not logged in, navigate to the login page
      alert("You must be logged in to add a product to the cart!");
      navigate("/login"); // redirect to login page
      return;
    }

    // Retrieve existing cart from local storage
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the book is already in the cart
    const bookInCart = existingCart.find(item => item.id === book.id);

    if (bookInCart) {
      // If the book is already in the cart, you can update the quantity if needed
      bookInCart.quantity += 1; // Increment quantity
    } else {
      // If the book is not in the cart, add it
      existingCart.push({ ...book, quantity: 1 });
    }

    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`${book.title} has been added to your cart!`);
  };

  const [currentImage, setCurrentImage] = useState({
    src: bookCollection,
    alt: "Book Collection",
  });

  const changeImage = (type) => {
    const imageMap = {
      ebook: { src: bookCollection, alt: "E-Books" },
      audiobook: { src: audiobook, alt: "Audiobooks" },
      video: { src: videobook, alt: "Videos" },
      physical: { src: physicalbook, alt: "Physical Books" },
    };

    setCurrentImage(imageMap[type] || { src: bookCollection, alt: "Book Collection" });
  };

  const scrollCategoriesLeft = () => {
    const container = document.querySelector(".categories");
    container.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  };

  const scrollCategoriesRight = () => {
    const container = document.querySelector(".categories");
    container.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  };

  return (
      <>
      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="hero-inner">

          {/* LEFT SIDE IMAGE */}
          <div className="hero-left">
            <img
              src={heroImage}
              alt="Books"
              className="hero-img"
            />
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="hero-right">
            <h1 className="hero-title">
              Discover Books That <br />
              Inspire Your World
            </h1>

            <p className="hero-subtitle">
              From physical books to audiobooks and e-books —
              explore stories, knowledge, and imagination in one elegant space.
            </p>

            <button
              className="hero-btn"
              onClick={() => navigate("/products")}
            >
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      <div className="categories-section">
        <h1>Featured Categories</h1>
        <div className="categories-container">
          <div>
            <button
              className="scroll-btn left-btn"
              onClick={scrollCategoriesLeft}
            >
              &#8249;
            </button>
          </div>
          <div className="categories">
            {[
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
            ].map((category, index) => (
              <div className="category" key={index}>
                <img src={category.img} alt={category.text} />
                <br />
                <br />
                {category.text}
              </div>
            ))}
          </div>
          <div>
            <button
              className="scroll-btn right-btn"
              onClick={scrollCategoriesRight}
            >
              &#8250;
            </button>
          </div>
        </div>
        <button className="view-all-btn" onClick={() => navigate("/categories")}>
          View All
        </button>
      </div>

      <section className="bestseller-section">
        <h2>Best Sellers</h2>
        <div className="bestseller-container">
          {[
            { id: 1, img: bestbook1, title: "Walk into the Shadow", price: 250 },
            { id: 2, img: bestbook2, title: "My Book Cover", price: 500 },
            { id: 3, img: bestbook3, title: "Soul By Olivia Wilson", price: 1000 },
            { id: 4, img: bestbook4, title: "Fairytale World", price: 700 },
            { id: 5, img: bestbook5, title: "Hare and Rabbit", price: 950 },
          ].map((book) => (
            <div className="bestseller-card" key={book.id}>
              <img src={book.img} alt={book.title} />
              <p>
                {book.title}
                <br />
                ₹{book.price}
              </p>
              <button onClick={() => addToCart(book)}>Add to cart</button>
            </div>
          ))}
        </div>
      </section>

      <section className="trending-section">
        <h2>Trending Right Now</h2>
        <div className="trending-container">
          {[
            { id: 1, img: bestbook1, title: "Walk into the Shadow", price: 250 },
            { id: 2, img: bestbook2, title: "My Book Cover", price: 500 },
            { id: 3, img: bestbook3, title: "Soul By Olivia Wilson", price: 1000 },
            { id: 4, img: bestbook4, title: "Fairytale World", price: 700 },
            { id: 5, img: bestbook5, title: "Hare and Rabbit", price: 950 },
          ].map((book) => (
            <div className="bestseller-card" key={book.id}>
              <img src={book.img} alt={book.title} />
              <p>
                {book.title}
                <br />
                ₹{book.price}
              </p>
              <button onClick={() => addToCart(book)}>Add to cart</button>
            </div>
          ))}
        </div>
      </section>

      <div className="types-of-books_container">
        <div className="text-section">
          <h1>Explore Our Collection</h1>
        </div>
        <div className="buttons">
          <button onClick={() => changeImage("ebook")}>E-Books</button>
          <button onClick={() => changeImage("audiobook")}>Audiobooks</button>
          <button onClick={() => changeImage("video")}>Videos</button>
          <button onClick={() => changeImage("physical")}>Physical</button>
        </div>
        <p>
          Dive into a world of e-books, audiobooks, videos, and physical books
          across every genre imaginable!
          <br />
          <br />
          Your next adventure awaits!
        </p>
        <div className="image-section">
          <img id="display-image" src={currentImage.src} alt={currentImage.alt} />
        </div>
      </div>

      <section className="offer">
        <p>"Huge Collection. Attractive Discounts. Special Offers"</p>
        <button><Nav.Link as={Link} to='/products'>Explore Now!</Nav.Link></button>
      </section>

      {/* ================= WHY CHOOSE SECTION ================= */}

<section className="why-section">

  <h2 className="why-main-title">
    Why Choose Book-E-Pedia?
  </h2>

  <div className="why-container">

    {/* LEFT IMAGE */}
    <div className="why-left">
      <img src={require("./why-shelf.png")} alt="Bookshelf" />
    </div>

    {/* RIGHT CONTENT */}
    <div className="why-right">

      <p className="why-description">
        At Book-E-Pedia, we believe in the power of stories to inspire,
        educate, and connect people. Whether you're a passionate reader,
        a curious learner, or someone seeking the perfect gift, we make
        it easy to explore and indulge in the world of books.
      </p>

      <div className="why-cards">

        <div className="why-card">
          <h3>📚 Vast Collection</h3>
          <p>
            Explore physical books, e-books, audiobooks,
            and videos all under one roof.
          </p>
        </div>

        <div className="why-card">
          <h3>✨ Inspiring Stories</h3>
          <p>
            Discover books that inspire, educate,
            and entertain readers of all ages.
          </p>
        </div>

        <div className="why-card">
          <h3>🎬 Visual Adventures</h3>
          <p>
            Watch and learn with our engaging
            collection of video books.
          </p>
        </div>

        <div className="why-card">
          <h3>🎧 Listen Up!</h3>
          <p>
            Immerse yourself in stories
            with our premium audiobooks.
          </p>
        </div>

      </div>
    </div>
  </div>
</section>


      
    </>
  );
}

export default Home;