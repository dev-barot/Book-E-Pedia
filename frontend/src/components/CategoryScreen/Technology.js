import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Nav } from "react-bootstrap";


// Import images
import book2 from "./download(1).jpeg";
import book4 from "./download (2).jpeg";
import book6 from "./harry.jpeg";
import book7 from "./gatsby.jpeg";

const books = [
    {
      id: "SAGEThePower",
      name: "SAGE The Power",
      author: "Stephanie Folder",
      publisher: "Publisher A",
      language: "English",
      pages: 300,
      audioDuration: "10 hours",
      videoDuration: "5 hours",
      price: 200,
      image: book2,
      description: "An inspiring tale of resilience and strength.",
      formats: ["Audio Book", "Video Book", "E-book", "Physical Book"],
      
    },
    {
      id: "MyBookCover",
      name: "My Book Cover",
      author: "Harper Lee",
      price: 350,
      image: book4,
      description: "A gripping story of hope and justice.",
      formats: ["E-book", "Physical Book"],
      publisher: "Publisher B",
      language: "English",
      pages: 250,
      audioDuration: "8 hours",
      videoDuration: "4 hours",
    },
    {
      id: "TheGreatGatsby",
      name: "The Great Gatsby",
      author: "P Scott",
      price: 300,
      image: book7,
      description: "Discover the secrets of the unknown.",
      formats: ["Audio Book", "E-book"],
      publisher: "Publisher C",
      language: "English",
      pages: 400,
      audioDuration: "12 hours",
      videoDuration: "6 hours",
    },
    {
      id: "HarryPotter",
      name: "Harry Potter",
      author: "J.K. Rowling",
      price: 400,
      image: book6,
      description: "A thrilling journey through time.",
      formats: ["Video Book", "Physical Book"],
      publisher: "Publisher D",
      language: "English",
      pages: 500,
      audioDuration: "15 hours",
      videoDuration: "7 hours",
    
    },
  ];

  const ProductItem = ({ book, addToCart }) => {
    return (
      
      <div className="product">
        <Nav.Link as={Link} to={`/product-detail/${book.id}`}>
          <img className='prodImg' src={book.image} alt={book.name} />
          <div className="product-name">{book.name}</div>
          <div className="author-name">By {book.author}</div>
          <div className="product-price">Rs. {book.price}</div>
          <div className="product-description">{book.description}</div>
          <div className="product-description">
            <strong>Available Formats:</strong> {book.formats.join(", ")}
          </div>
          
          {/* <div className="product-hid">Publisher: {book.publisher}</div>
              <div className="product-hid">Language: {book.language}</div>
              <div className="product-hid">Number of Pages: {book.pages}</div>
              <div className="product-hid">Audio Duration: {book.audioDuration}</div>
              <div className="product-hid">Video Duration: {book.videoDuration}</div> */}
        </Nav.Link>
        <button className="add-to-cart" onClick={() => addToCart(book)}>
          Add to Cart
        </button>
        
      </div>
      
    );
  };

function Technology() {
    const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Store cart in local storage
    navigate('/cart'); // Navigate to the cart page
  };
  return (
    <div className="product-container">
      <h1>Technology Books Collection</h1>
      <div className="product-list">
        {books.map((book) => (
          <ProductItem key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>
    </div>
  )
}

export default Technology
