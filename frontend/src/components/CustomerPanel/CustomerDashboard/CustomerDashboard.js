
// import React, { useEffect, useState } from 'react';
// import { NavLink, Link } from 'react-router-dom';
// import CustomerSidebar from '../CustomerSidebar/CustomerSidebar';
// import './CustomerDashboard.css';
// import p1 from './p1.jpeg';

// function CustomerDashboard() {
//   const baseUrl = "http://127.0.0.1:8000";
//   const customerId = localStorage.getItem('customer_id');
//   const [OrderItems, setOrderItems] = useState([]);
//   const [customerName, setCustomerName] = useState('');
//   const [totalOrders, setTotalOrders] = useState(0);

//   useEffect(() => {
//     if (customerId) {
//       fetchOrders();
//       fetchCustomerDetails();
//     }
//   }, [customerId]);

//   function fetchOrders() {
//     fetch(`${baseUrl}/api/customer/${customerId}/orders`)
//       .then(response => response.json())
//       .then(data => {
//         if (data && Array.isArray(data.data)) {
//           setOrderItems(data.data);
//           setTotalOrders(data.data.length);
//         } else {
//           setOrderItems([]);
//           setTotalOrders(0);
//         }
//       })
//       .catch(error => console.error("Error fetching orders:", error));
//   }

//   function fetchCustomerDetails() {
//     fetch(`${baseUrl}/api/customer/${customerId}`)
//       .then(response => response.json())
//       .then(data => {
//         if (data && data.Fname) {
//           setCustomerName(data.Fname);
//         } else {
//           setCustomerName("User");
//         }
//       })
//       .catch(error => console.error("Error fetching customer details:", error));
//   }

//   if (!customerId) {
//     return <p>Please log in to view your dashboard.</p>;
//   }

//   const uniqueBooks = Array.from(new Map(OrderItems.map(item => [item.product_details.Product_ID, item])).values());

//   return (
//     <div className="cust-body">
//       <CustomerSidebar />

//       <div className="cust-main-content">
//         {/* Profile Summary Card */}
//         <div className="cust-profile-card">
//           <div className="cust-profile-details">
//             <h1>Welcome, {customerName}</h1>
//             <p>Total Orders: {totalOrders}</p>
//             <Link to="/profile/edit" className="cust-profile-edit-btn">Edit Profile</Link>
//           </div>
//           <div className="cust-profile-avatar">
//             <img src={p1} alt="Profile Avatar" />
//           </div>
//         </div>

//         {/* Library Section */}
//         <div className="library-container">
//           <h2>My Library</h2>
//           {uniqueBooks.length > 0 ? (
//             <div className="cust-library">
//               {uniqueBooks.map(orderDetail => (
//                 <div key={orderDetail.Order_ID} className="cust-book-card">
//                   <Link to={`/product/${orderDetail.product_details?.Product_Name.replace(/\s+/g, '-').toLowerCase()}/${orderDetail.product_details?.Product_ID}`}>
//                     <img 
//                       src={orderDetail.product_details?.Cover_Photo ? `${baseUrl}${orderDetail.product_details.Cover_Photo}` : p1} 
//                       alt="Book Cover" 
//                       className="cust-book-image" 
//                       onError={(e) => {
//                         console.log(`Failed to load image: ${baseUrl}${orderDetail.product_details?.Cover_Photo}`);
//                         e.target.src = p1; // Fallback to default image on error
//                       }}
//                     />
//                   </Link>
//                   <div className="cust-book-details">
//                     <h3>{orderDetail.product_details?.Product_Name}</h3>
//                     <div className="cust-book-formats">
//                       <NavLink to="/audio-book" title="Audio Book">
//                         <i className="fa fa-headphones"></i>
//                       </NavLink>
//                       <NavLink to="/video-book" title="Video Book">
//                         <i className="fa-solid fa-file-video"></i>
//                       </NavLink>
//                       <NavLink to="/e-book" title="E-Book">
//                         <i className="fa fa-book-reader"></i>
//                       </NavLink>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="cust-empty-library">Your library is empty. Start exploring books now!</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import { NavLink, Link, useNavigate } from 'react-router-dom';
// import CustomerSidebar from '../CustomerSidebar/CustomerSidebar';
// import './CustomerDashboard.css';
// import p1 from './p1.jpeg';

// function CustomerDashboard() {
//   const baseUrl = "http://127.0.0.1:8000";
//   const customerId = localStorage.getItem('customer_id');
//   const [OrderItems, setOrderItems] = useState([]);
//   const [customerName, setCustomerName] = useState('');
//   const [totalOrders, setTotalOrders] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (customerId) {
//       fetchOrders();
//       fetchCustomerDetails();
//     }
//   }, [customerId]);

//   function fetchOrders() {
//     fetch(`${baseUrl}/api/customer/${customerId}/orders`)
//       .then(response => response.json())
//       .then(data => {
//         console.log("Raw API Response:", data);
//         if (data && Array.isArray(data.data)) {
//           const filteredItems = data.data.filter(item => {
//             const bookType = item.product_details?.Book_Type_Details;
//             console.log("Full product_details with Book_Type_Details:", { ...item.product_details, Book_Type_Details: bookType });
//             if (!bookType) return false;
//             const hasAudio = bookType.Audio_Book === "1" || bookType.Audio_Book === true;
//             const hasEBook = bookType.E_Book === "1" || bookType.E_Book === true;
//             const hasVideo = bookType.Video_Book === "1" || bookType.Video_Book === true;
//             const isPhysical = bookType.Physical_Book === "1" || bookType.Physical_Book === true;
//             const isPhysicalOnly = isPhysical && !hasAudio && !hasEBook && !hasVideo;
//             console.log(`Item: ${item.product_details?.Product_Name}, isPhysicalOnly: ${isPhysicalOnly}, hasAudio: ${hasAudio}, hasEBook: ${hasEBook}, hasVideo: ${hasVideo}`);
//             return !isPhysicalOnly;
//           });
//           console.log("Filtered OrderItems:", filteredItems);
//           setOrderItems(filteredItems);
//           setTotalOrders(filteredItems.length);
//         } else {
//           console.error("Expected an array but got:", data);
//           setOrderItems([]);
//           setTotalOrders(0);
//         }
//       })
//       .catch(error => console.error("Error fetching orders:", error));
//   }

//   function fetchCustomerDetails() {
//     fetch(`${baseUrl}/api/customer/${customerId}`)
//       .then(response => response.json())
//       .then(data => {
//         if (data && data.Fname) {
//           setCustomerName(data.Fname);
//         } else {
//           setCustomerName("User");
//         }
//       })
//       .catch(error => console.error("Error fetching customer details:", error));
//   }

//   if (!customerId) {
//     return <p>Please log in to view your dashboard.</p>;
//   }

//   const uniqueBooks = Array.from(new Map(OrderItems.map(item => [item.product_details.Product_ID, item])).values());

//   const handleAudioClick = (orderDetail) => {
//     const bookType = orderDetail.product_details?.Book_Type_Details;
//     const audioFileUrl = bookType?.Audio_File ? bookType.Audio_File : null; // Use raw path if full URL, adjust based on API response
//     if (audioFileUrl) {
//       navigate('/audio-book', { state: { audioFileUrl, productDetails: orderDetail.product_details } });
//     } else {
//       console.error("No audio file available for this book");
//     }
//   };

//   return (
//     <div className="cust-body">
//       <CustomerSidebar />

//       <div className="cust-main-content">
//         {/* Profile Summary Card */}
//         <div className="cust-profile-card">
//           <div className="cust-profile-details">
//             <h1>Welcome, {customerName}</h1>
//             <p>Total Orders: {totalOrders}</p>
//             <Link to="/profile/edit" className="cust-profile-edit-btn">Edit Profile</Link>
//           </div>
//           <div className="cust-profile-avatar">
//             <img src={p1} alt="Profile Avatar" />
//           </div>
//         </div>

//         {/* Library Section */}
//         <div className="library-container">
//           <h2>My Library</h2>
//           {uniqueBooks.length > 0 ? (
//             <div className="cust-library">
//               {uniqueBooks.map(orderDetail => {
//                 const bookType = orderDetail.product_details?.Book_Type_Details;
//                 const hasAudio = bookType?.Audio_Book === "1" || bookType?.Audio_Book === true;
//                 const hasEBook = bookType?.E_Book === "1" || bookType?.E_Book === true;
//                 const hasVideo = bookType?.Video_Book === "1" || bookType?.Video_Book === true;

//                 return (
//                   <div key={orderDetail.Order_ID} className="cust-book-card">
//                     <Link to={`/product/${orderDetail.product_details?.Product_Name.replace(/\s+/g, '-').toLowerCase()}/${orderDetail.product_details?.Product_ID}`}>
//                       <img 
//                         src={orderDetail.product_details?.Cover_Photo ? `${baseUrl}${orderDetail.product_details.Cover_Photo}` : p1} 
//                         alt="Book Cover" 
//                         className="cust-book-image" 
//                         onError={(e) => {
//                           console.log(`Failed to load image: ${baseUrl}${orderDetail.product_details?.Cover_Photo}`);
//                           e.target.src = p1;
//                         }}
//                       />
//                     </Link>
//                     <div className="cust-book-details">
//                       <h3>{orderDetail.product_details?.Product_Name}</h3>
//                       <div className="cust-book-formats">
//                         {hasAudio && (
//                           <NavLink to="#" title="Audio Book" onClick={(e) => { e.preventDefault(); handleAudioClick(orderDetail); }}>
//                             <i className="fa fa-headphones"></i>
//                           </NavLink>
//                         )}
//                         {hasVideo && (
//                           <NavLink to="/video-book" title="Video Book">
//                             <i className="fa-solid fa-file-video"></i>
//                           </NavLink>
//                         )}
//                         {hasEBook && (
//                           <NavLink to="/e-book" title="E-Book">
//                             <i className="fa fa-book-reader"></i>
//                           </NavLink>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <p className="cust-empty-library">Your library is empty. Start exploring books now!</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CustomerDashboard;
import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import CustomerSidebar from '../CustomerSidebar/CustomerSidebar';
import './CustomerDashboard.css';
import p1 from './p1.jpeg';

function CustomerDashboard() {
  const baseUrl = "http://127.0.0.1:8000";
  const customerId = localStorage.getItem('customer_id');
  const [OrderItems, setOrderItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [totalOrders, setTotalOrders] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (customerId) {
      fetchOrders();
      fetchCustomerDetails();
    }
  }, [customerId]);

  function fetchOrders() {
    fetch(`${baseUrl}/api/customer/${customerId}/orders`)
      .then(response => response.json())
      .then(data => {
        console.log("Raw API Response:", data);
        if (data && Array.isArray(data.data)) {
          const filteredItems = data.data.filter(item => {
            const bookType = item.product_details?.Book_Type_Details;
            console.log("Full product_details with Book_Type_Details:", { ...item.product_details, Book_Type_Details: bookType });
            if (!bookType) return false;
            const hasAudio = bookType.Audio_Book === "1" || bookType.Audio_Book === true;
            const hasEBook = bookType.E_Book === "1" || bookType.E_Book === true;
            const hasVideo = bookType.Video_Book === "1" || bookType.Video_Book === true;
            const isPhysical = bookType.Physical_Book === "1" || bookType.Physical_Book === true;
            const isPhysicalOnly = isPhysical && !hasAudio && !hasEBook && !hasVideo;
            console.log(`Item: ${item.product_details?.Product_Name}, isPhysicalOnly: ${isPhysicalOnly}, hasAudio: ${hasAudio}, hasEBook: ${hasEBook}, hasVideo: ${hasVideo}`);
            return !isPhysicalOnly;
          });
          console.log("Filtered OrderItems:", filteredItems);
          setOrderItems(filteredItems);
          setTotalOrders(filteredItems.length);
        } else {
          console.error("Expected an array but got:", data);
          setOrderItems([]);
          setTotalOrders(0);
        }
      })
      .catch(error => console.error("Error fetching orders:", error));
  }

  function fetchCustomerDetails() {
    fetch(`${baseUrl}/api/customer/${customerId}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.Fname) {
          setCustomerName(data.Fname);
        } else {
          setCustomerName("User");
        }
      })
      .catch(error => console.error("Error fetching customer details:", error));
  }

  if (!customerId) {
    return <p>Please log in to view your dashboard.</p>;
  }

  const uniqueBooks = Array.from(new Map(OrderItems.map(item => [item.product_details.Product_ID, item])).values());

  const handleAudioClick = (orderDetail) => {
    const bookType = orderDetail.product_details?.Book_Type_Details;
    const audioFileUrl = bookType?.Audio_File;
    if (audioFileUrl) {
      navigate('/audio-book', { state: { audioFileUrl, productDetails: orderDetail.product_details } });
    } else {
      console.error("No audio file available for this book");
    }
  };

  const handleVideoClick = (orderDetail) => {
    const bookType = orderDetail.product_details?.Book_Type_Details;
    const videoFileUrl = bookType?.Video_File;
    if (videoFileUrl) {
      navigate('/video-book', { state: { videoFileUrl, productDetails: orderDetail.product_details } });
    } else {
      console.error("No video file available for this book");
    }
  };

  const handleEBookClick = (orderDetail) => {
    const bookType = orderDetail.product_details?.Book_Type_Details;
    const eBookFileUrl = bookType?.E_Book_File;
    if (eBookFileUrl) {
      navigate('/e-book', { state: { eBookFileUrl, productDetails: orderDetail.product_details } });
    } else {
      console.error("No e-book file available for this book");
    }
  };

  return (
    <div className="cust-body">
      <CustomerSidebar />

      <div className="cust-main-content">
        {/* Profile Summary Card */}
        <div className="cust-profile-card">
          <div className="cust-profile-details">
            <h1>Welcome, {customerName}</h1>
            <p>Total Orders: {totalOrders}</p>
            <Link to="/profile/edit" className="cust-profile-edit-btn">Edit Profile</Link>
          </div>
          <div className="cust-profile-avatar">
            <img src={p1} alt="Profile Avatar" />
          </div>
        </div>

        {/* Library Section */}
        <div className="library-container">
          <h2>My Library</h2>
          {uniqueBooks.length > 0 ? (
            <div className="cust-library">
              {uniqueBooks.map(orderDetail => {
                const bookType = orderDetail.product_details?.Book_Type_Details;
                const hasAudio = bookType?.Audio_Book === "1" || bookType?.Audio_Book === true;
                const hasEBook = bookType?.E_Book === "1" || bookType?.E_Book === true;
                const hasVideo = bookType?.Video_Book === "1" || bookType?.Video_Book === true;

                return (
                  <div key={orderDetail.Order_ID} className="cust-book-card">
                    <Link to={`/product/${orderDetail.product_details?.Product_Name.replace(/\s+/g, '-').toLowerCase()}/${orderDetail.product_details?.Product_ID}`}>
                      <img 
                        src={orderDetail.product_details?.Cover_Photo ? `${baseUrl}${orderDetail.product_details.Cover_Photo}` : p1} 
                        alt="Book Cover" 
                        className="cust-book-image" 
                        onError={(e) => {
                          console.log(`Failed to load image: ${baseUrl}${orderDetail.product_details?.Cover_Photo}`);
                          e.target.src = p1;
                        }}
                      />
                    </Link>
                    <div className="cust-book-details">
                      <h3>{orderDetail.product_details?.Product_Name}</h3>
                      <div className="cust-book-formats">
                        {hasAudio && (
                          <NavLink to="#" title="Audio Book" onClick={(e) => { e.preventDefault(); handleAudioClick(orderDetail); }}>
                            <i className="fa fa-headphones"></i>
                          </NavLink>
                        )}
                        {hasVideo && (
                          <NavLink to="#" title="Video Book" onClick={(e) => { e.preventDefault(); handleVideoClick(orderDetail); }}>
                            <i className="fa-solid fa-file-video"></i>
                          </NavLink>
                        )}
                        {hasEBook && (
                          <NavLink to="#" title="E-Book" onClick={(e) => { e.preventDefault(); handleEBookClick(orderDetail); }}>
                            <i className="fa fa-book-reader"></i>
                          </NavLink>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="cust-empty-library">Your library is empty. Start exploring books now!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;