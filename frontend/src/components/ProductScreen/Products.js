import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Products.css";
import SingleProduct from "./SingleProduct";
import { BASE_URL } from "../../utils/config";

import img1 from "./alchemist.jpeg";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalResult, setTotalResults] = useState(0);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBookTypes, setSelectedBookTypes] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [availableCategories, setAvailableCategories] = useState([]);
  const [bookTypesData, setBookTypesData] = useState([]);

  // Fixed format options
  const FORMAT_OPTIONS = [
    { label: "Physical Book", key: "physical" },
    { label: "E-Book", key: "ebook" },
    { label: "Audio Book", key: "audio" },
    { label: "Video Book", key: "video" }
  ];

  // 1. Initial Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resBookTypes] = await Promise.all([
          fetch(`${BASE_URL}/api/products/`),
          fetch(`${BASE_URL}/api/book-types/`)
        ]);
        
        const productsData = await resProducts.json();
        const bookTypesJson = await resBookTypes.json();
        
        const fetchedProducts = productsData.data || [];
        const fetchedBookTypes = bookTypesJson.data || [];

        // Extract unique categories for sidebar
        const categories = [...new Set(fetchedProducts.map(p => p.category_name).filter(Boolean))];
        
        setAvailableCategories(categories);
        setBookTypesData(fetchedBookTypes);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // 2. Initialize from URL
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [categoryParam]);

  // 3. Apply Filters and Sorting
  useEffect(() => {
    let result = [...products];

    // Filter by Search Query
    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        (p.publisher && p.publisher.toLowerCase().includes(q)) ||
        (p.category_name && p.category_name.toLowerCase().includes(q)) ||
        (p.book_name && p.book_name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Filter by Categories
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category_name));
    }

    // Filter by Book Formats
    if (selectedBookTypes.length > 0) {
      const validBookIds = new Set();
      bookTypesData.forEach(bt => {
        const hasSelectedFormat = selectedBookTypes.some(formatKey => bt[formatKey] === "1");
        if (hasSelectedFormat) {
          validBookIds.add(bt.id);
        }
      });

      result = result.filter(p => validBookIds.has(p.book_id));
    }

    // Sorting
    if (sortOption === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortOption === "name-desc") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } else if (sortOption === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFilteredProducts(result);
    setTotalResults(result.length);
  }, [products, selectedCategories, selectedBookTypes, sortOption, bookTypesData, searchParam]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleBookTypeChange = (bt) => {
    setSelectedBookTypes(prev => 
      prev.includes(bt) ? prev.filter(b => b !== bt) : [...prev, bt]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBookTypes([]);
    setSortOption("default");
  };

  // Pagination logic
  function changeUrl(dummyString) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  var links = [];
  var limit = 8;
  var totalLinks = Math.ceil(totalResult / limit);

  for (let i = 1; i <= totalLinks; i++) {
    links.push(
      <li className="page-item" key={i}>
        <Link onClick={() => changeUrl()} to={`/products/?page=${i}`} className="page-link">
          {i}
        </Link>
      </li>
    );
  }

  return (
    <div className="shop-lux-page">
      <div className="container-fluid px-4 px-lg-5 py-5">
        
        {/* Page Header */}
        <div className="text-center mb-5 position-relative">
          <span className="badge-lux mb-3">
            {categoryParam ? `${categoryParam} Collection` : "Premium Collection"}
          </span>
          <h1 className="shop-title">
            {categoryParam ? (
              <>Shop <span className="text-gradient">{categoryParam}</span></>
            ) : (
              <>Shop Our <span className="text-gradient">Library</span></>
            )}
          </h1>
          <p className="shop-subtitle mx-auto">
            {categoryParam 
              ? `Discover our curated selection of premium ${categoryParam} books. Find your next great read.`
              : `Discover a vast curated selection of premium books. From timeless classics to modern discoveries, find your next great read.`}
          </p>
          
          {/* Sidebar Toggle Button */}
          <div className="d-flex justify-content-center mt-4">
            <button 
              className="btn-filter-toggle" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className={`fa-solid ${isSidebarOpen ? 'fa-filter-circle-xmark' : 'fa-filter'}`}></i> 
              {isSidebarOpen ? " Hide Filters" : " Show Filters"}
            </button>
          </div>
        </div>

        <div className="row">
          {/* Collapsible Sidebar */}
          {isSidebarOpen && (
            <div className="col-lg-3 col-md-4 mb-4 fade-in-left">
              <div className="shop-sidebar-lux">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="sidebar-title m-0"><i className="fa-solid fa-sliders text-gradient me-2"></i> Filters</h4>
                  {(selectedCategories.length > 0 || selectedBookTypes.length > 0 || sortOption !== "default") && (
                    <button className="btn-clear-filters" onClick={clearFilters}>Clear All</button>
                  )}
                </div>

                {/* Sort Section */}
                <div className="filter-section">
                  <h6 className="filter-heading">Sort By</h6>
                  <select 
                    className="lux-select w-100" 
                    value={sortOption} 
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="default">Featured</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

                <hr className="sidebar-divider" />

                {/* Categories Filter */}
                {availableCategories.length > 0 && (
                  <div className="filter-section">
                    <h6 className="filter-heading">Categories</h6>
                    <div className="filter-options-list">
                      {availableCategories.map((cat, idx) => (
                        <label key={idx} className="lux-checkbox-container">
                          {cat}
                          <input 
                            type="checkbox" 
                            checked={selectedCategories.includes(cat)}
                            onChange={() => handleCategoryChange(cat)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {availableCategories.length > 0 && (
                  <hr className="sidebar-divider" />
                )}

                {/* Book Formats Filter */}
                <div className="filter-section">
                  <h6 className="filter-heading">Book Formats</h6>
                  <div className="filter-options-list">
                    {FORMAT_OPTIONS.map((format, idx) => (
                      <label key={idx} className="lux-checkbox-container">
                        {format.label}
                        <input 
                          type="checkbox" 
                          checked={selectedBookTypes.includes(format.key)}
                          onChange={() => handleBookTypeChange(format.key)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className={isSidebarOpen ? "col-lg-9 col-md-8" : "col-12"}>
            <div className={`shop-lux-list ${!isSidebarOpen ? 'full-width-grid' : ''}`}>
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, limit).map((product) => (
                  <SingleProduct
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.cover_photo ? (product.cover_photo.startsWith('http') ? product.cover_photo : `${BASE_URL}${product.cover_photo}`) : img1,
                      author: product.author,
                      description: product.description
                    }}
                  />
                ))
              ) : (
                <div className="empty-state-lux text-center py-5">
                  <div className="empty-icon-wrapper mb-3">
                    <i className="fa-solid fa-box-open empty-state-icon" style={{fontSize: '48px', color: '#1A4B84'}}></i>
                  </div>
                  <h4 className="text-muted">No books found matching your criteria</h4>
                  <button className="btn-outline-lux mt-3" onClick={clearFilters}>Clear Filters</button>
                </div>
              )}
            </div>

            {totalLinks > 1 && (
              <ul className="pagination-lux mt-5">
                {links}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Products;
