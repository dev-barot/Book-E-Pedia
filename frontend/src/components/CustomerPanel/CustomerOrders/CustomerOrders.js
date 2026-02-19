
// import React, { useEffect, useState } from "react";
// import { NavLink, Link } from "react-router-dom"; // Import Link
// import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
// import './CustomerOrders.css';
// import p1 from './download(1).jpeg'; // Placeholder image

// function CustomerOrders() {
//   const baseUrl = "http://127.0.0.1:8000/api";
//   const customerId = localStorage.getItem('customer_id');
//   const [OrderItems, setOrderItems] = useState([]);

//   useEffect(() => {
//     fetchData(`${baseUrl}/customer/${1}/orders`);
//   }, []);

//   function fetchData(url) {
//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data); // Log the entire data structure
//         if (data && Array.isArray(data.data)) {
//           setOrderItems(data.data);
//         } else {
//           console.error("Expected an array but got:", data);
//           setOrderItems([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setOrderItems([]);
//       });
//   }

//   // Group order items by MasterOrder_ID
//   const groupedOrders = OrderItems.reduce((acc, item) => {
//     const masterOrderId = item.MasterOrder_ID;
//     if (!acc[masterOrderId]) {
//       acc[masterOrderId] = {
//         MasterOrder_ID: masterOrderId,
//         order_details: [],
//         totalAmount: 0
//       };
//     }
//     acc[masterOrderId].order_details.push(item);
//     acc[masterOrderId].totalAmount += parseFloat(item.T_amount);
//     return acc;
//   }, {});

//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [orderStatus, setOrderStatus] = useState(null);

//   // Toggle order details visibility
//   const toggleOrderDetails = (orderId, status) => {
//     if (expandedOrder === orderId) {
//       setExpandedOrder(null);
//       setOrderStatus(null);
//     } else {
//       setExpandedOrder(orderId);
//       setOrderStatus(status);
//     }
//   };

//   const masterOrderCount = Object.keys(groupedOrders).length;

//   return (
//     <div className="cust-order-body">
//       <CustomerSidebar />
//       <div className="cust-order-content">
//         <div className="cust-order-header">
//           <h1>Order History</h1>
//           <span style={{ color: 'white' }}>{masterOrderCount} Orders</span>
//         </div>

//         {masterOrderCount > 0 ? (
//           Object.values(groupedOrders).map((masterOrder) => (
//             <div className="cust-order-card text-center" key={masterOrder.MasterOrder_ID}>
//               <h3>Master Order ID: {masterOrder.MasterOrder_ID}</h3>
              
//               {/* Order Details - Books Listed Vertically */}
//               <div className="cust-order-details">
//                 {masterOrder.order_details.map((orderDetail) => (
//                   <div key={orderDetail.Order_ID} className="cust-order-product">
//                     <Link to={`/product/${orderDetail.product_details?.Product_Name.replace(/\s+/g, '-').toLowerCase()}/${orderDetail.product_details?.Product_ID}`}>
//                       <img 
//                         src={orderDetail.product_details?.Cover_Photo || p1} 
//                         alt={orderDetail.product_details?.Product_Name} 
//                         className="product-image-child"
//                       />
//                     </Link>
//                     <div className="cust-order-info">
//                       <Link to={`/product/${orderDetail.product_details?.Product_Name.replace(/\s+/g, '-').toLowerCase()}/${orderDetail.product_details?.Product_ID}`}>
//                         <p><strong>Product Name:</strong> {orderDetail.product_details?.Product_Name}</p>
//                       </Link>
//                       <p><strong>Quantity:</strong> {orderDetail.Product_Quantity}</p>
//                       <p><strong>Price:</strong> Rs. {orderDetail.Product_Price}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Total Amount */}
//               <p><strong>Total Amount for this Master Order:</strong> Rs. {masterOrder.totalAmount.toFixed(2)}</p>

//               {/* Actions - Track Order & Invoice */}
//               <div className="cust-order-actions">
//                 <button 
//                   className="cust-order-btn-track" 
//                   onClick={() => toggleOrderDetails(masterOrder.MasterOrder_ID, masterOrder.order_details[0].Order_Status)}
//                 >
//                   <i className="fas fa-truck"></i> Track Order
//                 </button>
//                 <NavLink to="/invoice" className="cust-order-btn-invoice">
//                   <i className="fas fa-file-alt"></i> Get Invoice
//                 </NavLink>
//               </div>

//               {/* Tracking Information */}
//               {expandedOrder === masterOrder.MasterOrder_ID && orderStatus && (
//                 <div className="order-tracking-info">
//                   <p><strong>Tracking Info:</strong> {orderStatus}</p>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No orders found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CustomerOrders;
import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import './CustomerOrders.css';
import p1 from './download(1).jpeg'; // Verify this path is correct

function CustomerOrders() {
  const baseUrl = "http://127.0.0.1:8000"; // Ensure this matches your Django server
  const customerId = localStorage.getItem('customer_id');
  const [OrderItems, setOrderItems] = useState([]);

  useEffect(() => {
    if (customerId) {
      fetchData(`${baseUrl}/api/customer/${customerId}/orders`);
    }
  }, [customerId]);

  function fetchData(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Raw API Response:", data); // Log the entire data structure
        if (data && Array.isArray(data.data)) {
          setOrderItems(data.data);
        } else {
          console.error("Expected an array but got:", data);
          setOrderItems([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setOrderItems([]);
      });
  }

  // Group order items by MasterOrder_ID
  const groupedOrders = OrderItems.reduce((acc, item) => {
    const masterOrderId = item.MasterOrder_ID;
    if (!acc[masterOrderId]) {
      acc[masterOrderId] = {
        MasterOrder_ID: masterOrderId,
        order_details: [],
        totalAmount: 0
      };
    }
    acc[masterOrderId].order_details.push(item);
    acc[masterOrderId].totalAmount += parseFloat(item.T_amount || 0);
    return acc;
  }, {});

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);

  // Toggle order details visibility
  const toggleOrderDetails = (orderId, status) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      setOrderStatus(null);
    } else {
      setExpandedOrder(orderId);
      setOrderStatus(status);
    }
  };

  const masterOrderCount = Object.keys(groupedOrders).length;

  return (
    <div className="cust-order-body">
      <CustomerSidebar />
      <div className="cust-order-content">
        <div className="cust-order-header">
          <h1>Order History</h1>
          <span style={{ color: 'white' }}>{masterOrderCount} Orders</span>
        </div>

        {masterOrderCount > 0 ? (
          Object.values(groupedOrders).map((masterOrder) => (
            <div className="cust-order-card text-center" key={masterOrder.MasterOrder_ID}>
              <h3>Master Order ID: {masterOrder.MasterOrder_ID}</h3>
              
              {/* Order Details - Books Listed Vertically */}
              <div className="cust-order-details">
                {masterOrder.order_details.map((orderDetail) => (
                  <div key={orderDetail.Order_ID} className="cust-order-product">
                    <Link to={`/product/${orderDetail.product_details?.Product_Name.replace(/\s+/g, '-').toLowerCase()}/${orderDetail.product_details?.Product_ID}`}>
                      <img 
                        src={orderDetail.product_details?.Cover_Photo ? `${baseUrl}${orderDetail.product_details.Cover_Photo}` : p1} 
                        alt={orderDetail.product_details?.Product_Name || "Product Image"}
                        className="product-image-child"
                        onError={(e) => {
                          console.log(`Failed to load image: ${baseUrl}${orderDetail.product_details?.Cover_Photo}`);
                          e.target.src = p1; // Fallback to placeholder on error
                        }}
                      />
                    </Link>
                    <div className="cust-order-info">
                      <Link to={`/product/${orderDetail.product_details?.Product_Name.replace(/\s+/g, '-').toLowerCase()}/${orderDetail.product_details?.Product_ID}`}>
                        <p><strong>Product Name:</strong> {orderDetail.product_details?.Product_Name}</p>
                      </Link>
                      <p><strong>Quantity:</strong> {orderDetail.Product_Quantity}</p>
                      <p><strong>Price:</strong> Rs. {orderDetail.Product_Price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <p><strong>Total Amount for this Master Order:</strong> Rs. {masterOrder.totalAmount.toFixed(2)}</p>

              {/* Actions - Track Order & Invoice */}
              <div className="cust-order-actions">
                <button 
                  className="cust-order-btn-track" 
                  onClick={() => toggleOrderDetails(masterOrder.MasterOrder_ID, masterOrder.order_details[0].Order_Status)}
                >
                  <i className="fas fa-truck"></i> Track Order
                </button>
                <NavLink to="/invoice" className="cust-order-btn-invoice">
                  <i className="fas fa-file-alt"></i> Get Invoice
                </NavLink>
              </div>

              {/* Tracking Information */}
              {expandedOrder === masterOrder.MasterOrder_ID && orderStatus && (
                <div className="order-tracking-info">
                  <p><strong>Tracking Info:</strong> {orderStatus}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerOrders;