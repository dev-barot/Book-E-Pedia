import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import "./CustomerOrders.css";
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
    <div className="cust-order-body">
      <CustomerSidebar />

      <div className="cust-order-content">
        <div className="cust-order-header">
          <h1>Order History</h1>
          <span style={{ color: "white" }}>
            {masterOrderCount} Orders
          </span>
        </div>

        {masterOrderCount > 0 ? (
          orderItems.map((order) => {
            const totalAmount = order.products.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );

            return (
              <div
                className="cust-order-card text-center"
                key={order.MasterOrder_ID}
              >
                <h3>Master Order ID: {order.MasterOrder_ID}</h3>

                <div className="cust-order-details">
                  {order.products.map((product) => (
                    <div
                      key={product.id}
                      className="cust-order-product"
                    >
                      <Link to={`/product-detail/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-image-child"
                        />
                      </Link>

                      <div className="cust-order-info">
                        <Link to={`/product-detail/${product.id}`}>
                          <p>
                            <strong>Product Name:</strong>{" "}
                            {product.name}
                          </p>
                        </Link>
                        <p>
                          <strong>Quantity:</strong>{" "}
                          {product.quantity}
                        </p>
                        <p>
                          <strong>Price:</strong> Rs.{" "}
                          {product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p>
                  <strong>Total Amount:</strong> Rs.{" "}
                  {totalAmount.toFixed(2)}
                </p>

                <div className="cust-order-actions">
                  <button
                    className="cust-order-btn-track"
                    onClick={() =>
                      toggleOrderDetails(order.MasterOrder_ID)
                    }
                  >
                    <i className="fas fa-truck"></i> Track Order
                  </button>

                  <NavLink
                    to="/invoice"
                    className="cust-order-btn-invoice"
                  >
                    <i className="fas fa-file-alt"></i> Get Invoice
                  </NavLink>
                </div>

                {expandedOrder === order.MasterOrder_ID && (
                  <div className="order-tracking-info">
                    <p>
                      <strong>Status:</strong>{" "}
                      {order.Order_Status}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerOrders;
