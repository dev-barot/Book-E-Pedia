import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Nav } from "react-bootstrap";


// Import images
import book2 from "./alchemist.jpeg";
import book4 from "./epic.jpeg";
import book6 from "./p1.jpeg";
import book7 from "./mockingbird.jpeg";

const books = [
  {
    id: "TheAlchemist",
    name: "The Alchemist",
    author: "Paulo Coelho",
    price: 300,
    image: book2,
    description: "A magical fable about following your dreams.",
    formats: ["Audio Book", "Physical Book"],
    publisher: "Publisher F",
    language: "English",
    pages: 200,
    audioDuration: "9 hours",
    videoDuration: "4.5 hours",
  },
    {
      id: "ToKillAMockingbird",
      name: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 280,
      image: book7,
      description: "A timeless classic of racial injustice and childhood innocence.",
      formats: ["E-book", "Physical Book"],
      publisher: "Publisher G",
      language: "English",
      pages: 320,
      audioDuration: "10 hours",
      videoDuration: "5 hours",
    },
    {
      id: "EpicAdventures",
      name: "Epic Adventures",
      author: "Jane Austen",
      price: 325,
      image: book4,
      description: "A thrilling journey through time.",
      formats: ["Audio Book", "E-book"],
      publisher: "Publisher E",
      language: "English",
      pages: 350,
      audioDuration: "11 hours",
      videoDuration: "5.5 hours",
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

function Entertainment() {
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
      <h1>Entertainment Books Collection</h1>
      <div className="product-list">
        {books.map((book) => (
          <ProductItem key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>
    </div>
  )
}

export default Entertainment
