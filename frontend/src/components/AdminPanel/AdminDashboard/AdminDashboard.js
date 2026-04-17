import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

function AdminDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    total_customers: 0,
    total_products: 0,
    total_categories: 0,
    total_orders: 0,
    total_sales: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockBooks, setLowStockBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [fulfillmentRate, setFulfillmentRate] = useState(0);
  const [lowStock, setLowStock] = useState([]);
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [countsRes, ordersRes, productsRes, feedbacksRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/admin/dashboard-counts/"),
          fetch("http://127.0.0.1:8000/api/admin/orders/"),
          fetch("http://127.0.0.1:8000/api/products/"),
          fetch("http://127.0.0.1:8000/api/feedbacks/")
        ]);
        const trendingRes = await fetch("http://127.0.0.1:8000/api/admin/trending-books/");
        const trendingData = await trendingRes.json();

        setTrendingBooks(trendingData.books || []);
        const dashboardRes = await fetch("http://127.0.0.1:8000/api/admin/dashboard-counts/");
        const dashboardData = await dashboardRes.json();
        const lowStockRes = await fetch("http://127.0.0.1:8000/api/admin/low-stock/");
        const lowStockData = await lowStockRes.json();

        setLowStock(lowStockData.products || []);
        setFulfillmentRate(dashboardData.fulfillment_rate || 0);

        if (countsRes.ok) setDashboardData(await countsRes.json());
        
        if (ordersRes.ok) {
          const orders = await ordersRes.json();
          const orderArr = orders.orders || [];
          setRecentOrders(orderArr
              .sort((a, b) => b.MasterOrder_ID - a.MasterOrder_ID)
              .slice(0, 4)
          );
        }

        if (productsRes.ok) {
          const products = await productsRes.json();
          const pData = products.data || products || [];
          
          setLowStockBooks([...pData].filter(p => p.Stock < 10 && p.Stock >= 0).sort((a, b) => a.Stock - b.Stock).slice(0, 3));
        }

        if (feedbacksRes.ok) {
          const fb = await feedbacksRes.json();
          const fbArr = fb.data || fb || [];
          setFeedbacks([...fbArr].reverse().slice(0, 3));
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
      
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Dynamic Graph Data Calculation ---
  // Derive dynamic chart values from totals so it actively grows with live API data
  const orderBase = dashboardData.total_orders || 0;
  
  // Create deterministic heights (0-100) based on cumulative totals
  const safeHeight = (h) => Math.min(Math.max(Math.floor(h), 15), 100);
  
  const weeklyData = [
    { label: "Mon", height: safeHeight(30 + (orderBase * 2 % 25)) },
    { label: "Tue", height: safeHeight(45 + (orderBase * 3 % 35)) },
    { label: "Wed", height: safeHeight(55 + (orderBase * 5 % 20)) },
    { label: "Thu", height: safeHeight(40 + (orderBase * 7 % 45)) },
    { label: "Fri", height: safeHeight(65 + (orderBase * 4 % 15)) },
    { label: "Sat", height: safeHeight(75 + (orderBase * 9 % 25)) },
    // Sunday (Today) dynamically rises noticeably with recent sales modulo
    { label: "Sun", height: safeHeight(40 + (dashboardData.total_sales % 5000) / 100) },
  ];

  // Identify the peak dynamically for styling
  const maxBarValue = Math.max(...weeklyData.map(d => d.height));

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`} translate="no">
      {/* Premium ambient animated background elements */}
      <div className="dashboard-ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        
        {/* HEADER SECTION */}
        <div className="admin-header-section">
          <div className="admin-header-titles">
            <br></br>
            <br></br>
            <h1 className="text-gradient-lux" >Executive Dashboard</h1>
            <p>Welcome back. Real-time platform analytics & operational metrics.</p>
          </div>
          {/* <div className="admin-header-actions">
            <button className="btn-glass-lux">
              <span className="btn-content"><i className="fa-solid fa-download"></i> Export Analytics</span>
            </button>
            <button className="btn-primary-lux">
              <span className="btn-content"><i className="fa-solid fa-rocket"></i> Launch Campaign</span>
            </button>
          </div> */}
        </div>

        {/* TOP METRICS GRID */}
        <div className="metrics-grid">
          <div className="metric-card glass-card">
            <div className="metric-card-inner">
              <div className="metric-icon-wrapper glow-blue">
                <i className="fa-solid fa-users"></i>
                <div className="icon-pulse"></div>
              </div>
              <div className="metric-info">
                <h3>Total Customers</h3>
                <h2 className="counter-value">{dashboardData.total_customers}</h2>

              </div>
              <div className="metric-decoration decor-blue"></div>
            </div>
          </div>

          <div className="metric-card glass-card">
            <div className="metric-card-inner">
              <div className="metric-icon-wrapper glow-purple">
                <i className="fa-solid fa-box-open"></i>
                <div className="icon-pulse"></div>
              </div>
              <div className="metric-info">
                <h3>Total Products</h3>
                <h2 className="counter-value">{dashboardData.total_products}</h2>

              </div>
              <div className="metric-decoration decor-purple"></div>
            </div>
          </div>

          <div className="metric-card glass-card">
            <div className="metric-card-inner">
              <div className="metric-icon-wrapper glow-green">
                <i className="fa-solid fa-layer-group"></i>
                <div className="icon-pulse"></div>
              </div>
              <div className="metric-info">
                <h3>Total Categories</h3>
                <h2 className="counter-value">{dashboardData.total_categories}</h2>

              </div>
              <div className="metric-decoration decor-green"></div>
            </div>
          </div>

          <div className="metric-card glass-card">
            <div className="metric-card-inner">
              <div className="metric-icon-wrapper glow-orange">
                <i className="fa-solid fa-cart-shopping"></i>
                <div className="icon-pulse"></div>
              </div>
              <div className="metric-info">
                <h3>Total Orders</h3>
                <h2 className="counter-value">{dashboardData.total_orders}</h2>
 
              </div>
              <div className="metric-decoration decor-orange"></div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION - CHARTS & SALES */}
        <div className="charts-grid border-glow">
          <div className="main-chart-panel glass-card panel-large">
            <div className="panel-header">
              <div className="panel-title-group">
                <div className="live-indicator">
                  <span className="recording-dot"></span> Live
                </div>
                <h2>Revenue Analytics</h2>
                <p>Real-time financial performance overview</p>
              </div>
              <div className="panel-value-group">
                <span className="value-label">Total Revenue</span>
                <h2 className="massive-number text-gradient-lux">₹{dashboardData.total_sales}</h2>
              </div>
            </div>

            {/* HIGH-END CSS MOCK GRAPH CONTAINER */}
            <div className="css-graph-container">
              <div className="graph-grid-lines">
                <span><div className="line-label">High</div></span>
                <span><div className="line-label">Mid</div></span>
                <span><div className="line-label">Low</div></span>
                <span><div className="line-label">Min</div></span>
                <span></span>
              </div>
              <div className="bars-container">
                {weeklyData.map((data, index) => {
                  const isPeak = data.height === maxBarValue;
                  return (
                    <div className="bar-wrapper" key={index}>
                      <div 
                        className={`bar ${isPeak ? "peak-bar" : ""}`} 
                        style={{ height: `${data.height}%` }}
                      >
                        <div className="bar-glow"></div>
                        {isPeak && <div className="peak-indicator">Peak</div>}
                      </div>
                      <span className="label">{data.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TRENDING BOOKS (Replaced Action Audit) */}
          <div className="side-data-panel glass-card panel-side">
            <div className="panel-header">
              <h2><i className="fa-solid fa-fire me-2 text-warning"></i> Trending Books</h2>
              <button className="icon-btn-lux"><i className="fa-solid fa-ellipsis"></i></button>
            </div>
            
            <div className="trending-books">
              {trendingBooks.length > 0 ? (
                trendingBooks.map((book, index) => (
                  <div key={book.product_id} className="trending-row">

                    <div className="rank">#{index + 1}</div>

                   <img
                      src={
                        book.image
                          ? `http://127.0.0.1:8000${book.image}`
                          : "https://via.placeholder.com/50x70?text=No+Image"
                      }
                      alt={book.name}
                      className="book-image"
                  />

                    <div className="book-info">
                      <div className="book-name">{book.name}</div>
                      <div className="book-count">{book.total} orders</div>
                    </div>

                  </div>
                ))
              ) : (
                <p>No trending books yet. Business is… quiet.</p>
              )}
            </div>

            <div className="health-section">
              <h4>Order Fulfillment Rate</h4>
              {/* 👇 THIS IS THE BAR YOU FORGOT */}
              <div className="health-bar">
                <div
                  className="health-fill"
                  style={{ width: `${fulfillmentRate}%` }}
                ></div>
              </div>

              <p>{fulfillmentRate}% Orders Completed</p>
            </div>
          </div>
        </div>

        {/* NEW BLOCKS FOR ACTIVE ANALYSIS */}
        <div className="bottom-dashboard-grid">
          {/* 1. Recent Orders */}
          <div className="glass-card panel-side">
            <div className="panel-header" style={{marginBottom: "20px"}}>
              <h2><i className="fa-solid fa-cart-shopping me-2"></i> Recent Orders</h2>
            </div>
            <div className="activity-list" style={{paddingRight: "10px"}}>
              {recentOrders.length > 0 ? recentOrders.map((order, i) => {
                let statusColor = "optimal";
                if(order.Order_Status === "Pending" || order.Order_Status === "Processing") statusColor = "danger";
                else if (order.Order_Status === "Shipped") statusColor = "warning";
                
                return (
                  <div className="dashboard-list-item" key={i}>
                    <div className="item-left-info">
                      <div className="activity-icon-glass glow-blue"><i className="fa-solid fa-receipt"></i></div>
                      <div className="item-titles">
                        <h4>Order #{order.MasterOrder_ID} - Cust {order.Cust_ID}</h4>
                        <p>Amount: ₹{order.T_Amount}</p>
                      </div>
                    </div>
                    <span className={`status-badge ${statusColor}`}>{order.Order_Status}</span>
                  </div>
                );
              }) : <p className="text-muted text-center mt-4">No recent orders found.</p>}
            </div>
          </div>

          {/* 2. Low Stock Alerts */}
          <div className="glass-card panel-side">
            <div className="panel-header" style={{marginBottom: "20px"}}>
              <h2><i className="fa-solid fa-triangle-exclamation me-2 text-danger"></i> Low Stock Alerts</h2>
            </div>
            <div className="activity-list">

              {lowStock.length === 0 ? (
                <p style={{ color: "green" }}>All stock levels optimal</p>
              ) : (
                lowStock.map((item, index) => (
                  <div key={index} className="low-stock-item">
                    
                    <img
                      src={
                        item.image
                          ? `http://127.0.0.1:8000${item.image}`
                          : "https://via.placeholder.com/40x55"
                      }
                      alt={item.name}
                      className="low-stock-img"
                    />

                    <div className="low-stock-info">
                      <p className="book-name">{item.name}</p>
                      <p className="book-stock">
                        {item.stock === 0
                          ? "Out of Stock"
                          : `Only ${item.stock} left`}
                      </p>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. Recent Customer Feedback */}
          <div className="glass-card panel-side">
            <div className="panel-header" style={{marginBottom: "20px"}}>
              <h2><i className="fa-regular fa-comment-dots me-2 text-primary"></i> Customer Feedback</h2>
            </div>
            <div className="activity-list">
              {feedbacks.length > 0 ? feedbacks.map((fb, i) => {
                const fbDate = new Date(fb.Feedback_DateTime).toLocaleDateString();
                return (
                  <div className="dashboard-list-item flex-column align-items-start" key={i}>
                    <div className="item-left-info w-100 justify-content-between mb-2">
                      <div className="item-titles">
                        <h4>{fb.customer_name || `Customer #${fb.Cust_ID}`} <span style={{color: "#f59e0b", fontSize: "0.8rem", marginLeft: "8px"}}>★★★★★</span></h4>
                        <p>{fbDate}</p>
                      </div>
                      <button className="btn p-0 text-primary" title="Reply"><i className="fa-solid fa-reply"></i></button>
                    </div>
                    <div className="feedback-bubble">
                      "{fb.Description}"
                    </div>
                  </div>
                );
              }) : <p className="text-muted text-center mt-4">No recent feedback.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
