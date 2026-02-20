// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "./Products.css";
// import SingleProduct from "./SingleProduct";

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const baseUrl = "http://127.0.0.1:8000/api";
//   const [totalResult, setTotalResults] = useState(0); // Pagination

//   useEffect(() => {
//     fetchData(baseUrl + "/products/");
//   }, []);

//   function fetchData(baseurl) {
//     fetch(baseurl)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("Products API Response (Raw):", JSON.stringify(data, null, 2)); // Log the raw response
//         let productArray = [];
        
//         // Check if data is an array
//         if (Array.isArray(data)) {
//           productArray = data;
//         } else if (data && data.data && Array.isArray(data.data)) {
//           // Check if data has a 'data' key with an array
//           productArray = data.data;
//         } else {
//           console.error("Unexpected API response format:", data);
//           throw new Error("API response is not an array or does not contain a 'data' array");
//         }

//         // Filter active products, accepting both boolean true and string "1"
//         const activeProducts = productArray.filter(
//           (product) => product.IsActive === true || product.IsActive === "1"
//         );
//         console.log("Active Products after filtering:", activeProducts);
//         setProducts(activeProducts);
//         setTotalResults(activeProducts.length);
//       })
//       .catch((error) => {
//         console.error("Error fetching products:", error);
//         setProducts([]); // Ensure products is an empty array on error
//         setTotalResults(0);
//       });
//   }

//   function changeUrl(baseurl) {
//     fetchData(baseurl);
//   }

//   var links = []; // Creating links for pagination
//   var limit = 1; // How many products to show per page
//   var totalLinks = Math.ceil(totalResult / limit);

//   for (let i = 1; i <= totalLinks; i++) {
//     links.push(
//       <li className="page-item" key={i}>
//         <Link
//           onClick={() => changeUrl(baseUrl + `/products/?page=${i}`)}
//           to={`/products/?page=${i}`}
//           className="page-link"
//         >
//           {i}
//         </Link>
//       </li>
//     );
//   }

//   return (
//     <div className="product-container">
//       <h1>Shop Our Book Collection</h1>
//       <div className="product-list">
//         {products.length > 0 ? (
//           products.map((product, index) => (
//             <SingleProduct key={index} product={product} />
//           ))
//         ) : (
//           <p>No active products available.</p>
//         )}
//       </div>
//       <ul className="pagination">{links}</ul>
//     </div>
//   );
// };

// export default Products;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Products.css";
import SingleProduct from "./SingleProduct";

const Products = () => {
  const [products, setProducts] = useState([]);
  const baseUrl = "http://127.0.0.1:8000/api";
  const [totalResult, setTotalResults] = useState(0); // Pagination

  useEffect(() => {
    fetchData(`${baseUrl}/products/`);
  }, []);

  function fetchData(baseurl) {
    fetch(baseurl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Products API Response (Raw):", JSON.stringify(data, null, 2)); // Log the raw response
        let productArray = [];

        // Check if data is an array
        if (Array.isArray(data)) {
          productArray = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          // Check if data has a 'data' key with an array
          productArray = data.data;
        } else {
          console.error("Unexpected API response format:", data);
          throw new Error("API response is not an array or does not contain a 'data' array");
        }

        const activeProducts = productArray.filter(
           (product) => product.IsActive === true || product.IsActive === "1"
        );
        console.log("Active Products after filtering:", activeProducts);
        setProducts(activeProducts);
        setTotalResults(activeProducts.length);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]); // Ensure products is an empty array on error
        setTotalResults(0);
      });
  }

  function changeUrl(baseurl) {
    fetchData(baseurl);
  }

  var links = []; // Creating links for pagination
  var limit = 1; // How many products to show per page
  var totalLinks = Math.ceil(totalResult / limit);

  for (let i = 1; i <= totalLinks; i++) {
    links.push(
      <li className="page-item" key={i}>
        <Link
          onClick={() => changeUrl(`${baseUrl}/products/?page=${i}`)}
          to={`/products/?page=${i}`}
          className="page-link"
        >
          {i}
        </Link>
      </li>
    );
  }

  return (
    <div className="product-container">
      <h1>Shop Our Book Collection</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product, index) => (
            <SingleProduct key={index} product={product} />
          ))
        ) : (
          <p>No active products available.</p>
        )}
      </div>
      <ul className="pagination">{links}</ul>
    </div>
  );
};

export default Products;
