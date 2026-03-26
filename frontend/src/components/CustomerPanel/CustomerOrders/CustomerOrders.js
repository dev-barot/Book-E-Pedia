import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import "./CustomerOrders.css";
// Importing the local dummy images matching the original file
import p1 from "./download(1).jpeg";

function CustomerOrders() {
  const [orderItems, setOrderItems] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Dummy Order Data (Frontend Only)
  useEffect(() => {
    const dummyOrders = [
      {
        MasterOrder_ID: 1001,
        Order_Status: "Shipped",
        products: [
          {
            id: 1,
            name: "The Alchemist",
            quantity: 1,
            price: 300,
            image: p1,
          },
          {
            id: 2,
            name: "Harry Potter",
            quantity: 2,
            price: 400,
            image: p1,
          },
        ],
      },
      {
        MasterOrder_ID: 1002,
        Order_Status: "Processing",
        products: [
          {
            id: 3,
            name: "SAGE The Power",
            quantity: 1,
            price: 250,
            image: p1,
          },
        ],
      },
    ];

    setOrderItems(dummyOrders);
  }, []);

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
            {orderItems.map((order) => {
              const totalAmount = order.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              );

              return (
                <div
                  className="order-glass-card"
                  key={order.MasterOrder_ID}
                >
                  <div className="order-card-header">
                    <h3 className="order-id-lux">Order #{order.MasterOrder_ID}</h3>
                    <span className={`order-status-badge status-${order.Order_Status.toLowerCase()}`}>
                      {order.Order_Status}
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
                      <button
                        className="btn-track-lux"
                        onClick={() => toggleOrderDetails(order.MasterOrder_ID)}
                      >
                        <i className="fas fa-truck-fast me-2"></i> Track Order
                      </button>

                      <NavLink
                        to="/invoice"
                        className="btn-invoice-lux"
                      >
                        <i className="fas fa-file-invoice me-2"></i> Invoice
                      </NavLink>
                    </div>
                  </div>

                  {expandedOrder === order.MasterOrder_ID && (
                    <div className="order-tracking-glass p-4 mt-3">
                      <h5 className="tracking-title-lux mb-3">Shipment Status</h5>
                      <div className="progress-track-lux">
                        <div className={`step ${order.Order_Status !== 'Pending' ? 'active' : ''}`}>
                          <i className="fas fa-box"></i>
                          <span>Processing</span>
                        </div>
                        <div className={`step ${order.Order_Status === 'Shipped' || order.Order_Status === 'Delivered' ? 'active' : ''}`}>
                          <i className="fas fa-truck-moving"></i>
                          <span>Shipped</span>
                        </div>
                        <div className={`step ${order.Order_Status === 'Delivered' ? 'active' : ''}`}>
                          <i className="fas fa-check-circle"></i>
                          <span>Delivered</span>
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
