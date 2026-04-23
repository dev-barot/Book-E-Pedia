import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import "./CustomerOrders.css";
// Importing the local dummy images matching the original file
import p1 from "./download(1).jpeg";

function CustomerOrders() {
  const [orderItems, setOrderItems] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const baseUrl = "http://127.0.0.1:8000";
  const customerId = localStorage.getItem("customer_id");

  useEffect(() => {
    if (customerId) {
      fetch(`${baseUrl}/api/customer/${customerId}/orders`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.data)) {
            setOrderItems(data.data);
          } else {
            setOrderItems([]);
          }
        })
        .catch(err => {
          console.error(err);
          setOrderItems([]);
        });
    }
  }, [customerId]);
  const groupedOrders = Object.values(
    orderItems.reduce((acc, item) => {
      const id = item.MasterOrder_ID;

      if (!acc[id]) {
        acc[id] = {
          MasterOrder_ID: id,
          Order_Status: item.Order_Status,
          hasPhysical: false,
          products: []
        };
      }

      const bookType = item.product_details?.Book_Type_Details;
      const isPhysical = bookType?.Physical_Book === '1' || bookType?.physical === '1';
      if (isPhysical) acc[id].hasPhysical = true;

      let oType = "Physical";
      if (bookType?.Audio_Book === '1') oType = "Audio";
      else if (bookType?.E_Book === '1') oType = "E-Book";
      else if (bookType?.Video_Book === '1') oType = "Video";

      acc[id].products.push({
        id: item.product_details?.Product_ID,
        name: item.product_details?.Product_Name,
        quantity: item.Product_Quantity,
        price: parseFloat(item.Product_Price) || 0,
        orderType: oType,
        image: item.product_details?.Cover_Photo
          ? `${baseUrl}${item.product_details.Cover_Photo}`
          : p1
      });

      return acc;
    }, {})
  );

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const masterOrderCount = orderItems.length;

  return (
    /* Must use the unified dashboard wrapper from CustomerDashboard for sidebar stability */
    <div className="cust-lux-body">
      <CustomerSidebar />

      <div className="cust-lux-main">
        
        {/* Page Header */}
        <div className="order-header-lux mb-5">
          <div>
            <h1 className="order-title-lux">Order History</h1>
            <p className="order-subtitle-lux">Review and track your past purchases</p>
          </div>
          <div className="order-count-badge">
            {masterOrderCount} Orders
          </div>
        </div>

        {/* Orders List */}
        {masterOrderCount > 0 ? (
          <div className="order-list-lux">
            {groupedOrders.map((order) => {
              const totalAmount = order.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              );

              // If it's a digital-only order, the status from backend might be "Completed"
              // but we ensure it looks consistent here.
              const currentStatus = order.Order_Status;

              return (
                <div
                  className="order-glass-card"
                  key={order.MasterOrder_ID}
                >
                  <div className="order-card-header">
                    <h3 className="order-id-lux">Order #{order.MasterOrder_ID}</h3>
                    <span className={`order-status-badge status-${currentStatus.toLowerCase()}`}>
                      {currentStatus}
                    </span>
                  </div>

                  <div className="order-products-glass">
                    {order.products.map((product) => (
                      <div
                        key={product.id}
                        className="order-product-row"
                      >
                        <div className="order-product-img-box">
                          <Link to={`/product-detail/${product.id}`}>
                            <img
                              src={product.image}
                              alt={product.name}
                            />
                          </Link>
                        </div>

                        <div className="order-product-info">
                          <Link to={`/product-detail/${product.id}`} className="order-product-name">
                            {product.name}
                          </Link>
                          <p className="order-product-meta">Qty: <strong>{product.quantity}</strong></p>
                        </div>

                        <div className="order-product-price">
                          Rs. {product.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <p className="order-total-lux">
                      Total Amount: <span>Rs. {totalAmount.toFixed(2)}</span>
                    </p>

                    <div className="order-actions-lux">
                      {order.hasPhysical && order.Order_Status !== 'Cancelled' && (
                        <button
                          className="btn-track-lux"
                          onClick={() => toggleOrderDetails(order.MasterOrder_ID)}
                        >
                          <i className="fas fa-truck-fast me-2"></i> Track Order
                        </button>
                      )}

                      <NavLink
                        to="/invoice"
                        state={{ orderData: order }}
                        className="btn-invoice-lux"
                      >
                        <i className="fas fa-file-invoice me-2"></i> Invoice
                      </NavLink>
                    </div>
                  </div>

                  {expandedOrder === order.MasterOrder_ID && order.hasPhysical && (
                    <div className="order-tracking-glass p-4 mt-3">
                      <h5 className="tracking-title-lux mb-3">Shipment Status</h5>
                      <div className="progress-track-lux">
                        {/* Step 1: Placed (Always active if not cancelled) */}
                        <div className={`step ${order.Order_Status !== 'Cancelled' ? 'active' : ''}`}>
                          <i className="fas fa-clipboard-list"></i>
                          <span>Placed</span>
                        </div>

                        {/* Step 2: Processing */}
                        <div className={`step ${['Processing', 'Shipped', 'Completed'].includes(order.Order_Status) ? 'active' : ''}`}>
                          <i className="fas fa-box"></i>
                          <span>Processing</span>
                        </div>

                        {/* Step 3: Shipped */}
                        <div className={`step ${['Shipped', 'Completed'].includes(order.Order_Status) ? 'active' : ''}`}>
                          <i className="fas fa-truck-moving"></i>
                          <span>Shipped</span>
                        </div>

                        {/* Step 4: Completed */}
                        <div className={`step ${order.Order_Status === 'Completed' ? 'active' : ''}`}>
                          <i className="fas fa-check-circle"></i>
                          <span>Completed</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="cust-empty-glass text-center">
            <i className="fas fa-box-open empty-icon-lux mb-3"></i>
            <p>You haven't placed any orders yet. Time to fill up that library!</p>
            <Link to="/products" className="btn-cust-lux mt-2">Browse the Shop</Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default CustomerOrders;
